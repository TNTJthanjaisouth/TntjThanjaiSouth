import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import {
  Pencil,
  Trash2,
  Plus,
  X,
  Search,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { DhayiName } from "../types";
import {
  addDhayiName,
  updateDhayiName,
  deleteDhayiName,
  getDhayiNames,
} from "./services/dhayiservice";

export default function DhayiNamesManager() {
  const [dhayiNames, setDhayiNames] = useState<DhayiName[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", sortOrder: 0 });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadDhayiNames();
  }, []);

  const loadDhayiNames = async () => {
    try {
      setLoading(true);
      const names = await getDhayiNames();
      setDhayiNames(names.sort((a, b) => a.sort_order - b.sort_order));
    } catch (error) {
      console.error("Error loading Dhayi names:", error);
      toast.error("Failed to load Dhayi names");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nameTrimmed = formData.name.trim();

    if (!nameTrimmed) {
      toast.error("Name is required");
      return;
    }

    // ✅ Duplicate check using number part after "-"
    const newNumber = nameTrimmed.split("-").pop()?.trim();
    const numberExists = dhayiNames.some(
      (d) => d.name.split("-").pop()?.trim() === newNumber && d.id !== editingId
    );

    if (numberExists) {
      toast.error("This phone number already exists!");
      return;
    }

    try {
      setLoading(true);

      if (editingId) {
        await updateDhayiName(editingId, nameTrimmed, formData.sortOrder);
        toast.success("Dhayi name updated successfully");
      } else {
        await addDhayiName(nameTrimmed, formData.sortOrder);
        toast.success("Dhayi name added successfully");
      }

      setFormData({ name: "", sortOrder: 0 });
      setEditingId(null);
      setShowModal(false);
      await loadDhayiNames();
    } catch (error) {
      console.error("Error saving Dhayi name:", error);
      toast.error("Failed to save Dhayi name");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (dhayi: DhayiName) => {
    setEditingId(dhayi.id);
    setFormData({ name: dhayi.name, sortOrder: dhayi.sort_order });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this Dhayi name?")) return;

    try {
      setLoading(true);
      await deleteDhayiName(id);
      toast.success("Dhayi name deleted successfully");
      await loadDhayiNames();
    } catch (error) {
      console.error("Error deleting Dhayi name:", error);
      toast.error("Failed to delete Dhayi name");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ name: "", sortOrder: 0 });
  };

  // 🔍 Filtered list
  const filteredDhayiNames = useMemo(() => {
    return dhayiNames.filter((d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, dhayiNames]);

  return (
    <div className="bg-white rounded-xl  p-5 sm:p-8 border mt-12 transition-all duration-200 ">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6 sticky top-16 z-30  bg-gradient-to-b from-white via-white via-80% md:via-70% to-transparent  rounded-md p-5">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
          Dhayi Names Manager
        </h2>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search Dhayi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 text-sm outline-none"
            />
          </div>

          <button
            onClick={() => setShowModal(true)}
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 active:scale-95 transition text-sm disabled:opacity-70"
          >
            <Plus size={18} />
            Add New
          </button>
        </div>
      </div>

      {/* Table Section */}
      {loading && dhayiNames.length === 0 ? (
        <div className="flex justify-center py-8">
          <Loader2 className="animate-spin text-green-600" size={28} />
        </div>
      ) : filteredDhayiNames.length === 0 ? (
        <p className="text-center text-gray-500 py-8 text-sm sm:text-base">
          No Dhayi names found {searchQuery && `for "${searchQuery}"`}.
        </p>
      ) : (
        <>
          <div className="flex justify-end text-xs  sm:text-sm text-gray-600 mb-2">
            Total: {filteredDhayiNames.length}
          </div>

          {/* Small screen scroll hint */}
          <div className=" sm:hidden text-xs text-gray-500 text-center mb-2 flex items-center justify-center gap-1">
            <ArrowRight size={14} /> Scroll horizontally to view
          </div>

          <div className="overflow-x-auto border border-gray-200 rounded-lg  relative">
            <table className="w-full min-w-[500px] text-xs sm:text-sm">
              <thead className="bg-gray-100 text-gray-700 sticky top-0 z-20">
                <tr>
                  <th className="py-3 px-3 text-left font-semibold">#</th>
                  <th className="py-3 px-3 text-left font-semibold">
                    Name & Number
                  </th>

                  <th className="py-3 px-3 text-right font-semibold sticky right-0 bg-gray-100 shadow-lg">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredDhayiNames.map((dhayi, i) => {
                  return (
                    <tr key={dhayi.id} className="border-t  text-gray-700">
                      <td className="py-3 px-3">{i + 1}</td>

                      <td className="py-3 px-3 break-words">{dhayi.name}</td>

                      {/* ✅ Sticky Actions Column */}
                      <td className="py-3 px-3 sticky right-0 bg-gradient-to-r from-transparent via-white to-white shadow-lg">
                        <div className="flex justify-end gap-2 flex-wrap sm:flex-nowrap">
                          <button
                            onClick={() => handleEdit(dhayi)}
                            className="text-green-600 hover:text-green-800 p-1.5 rounded hover:bg-green-50"
                            disabled={loading}
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(dhayi.id)}
                            className="text-red-600 hover:text-red-800 p-1.5 rounded hover:bg-red-50"
                            disabled={loading}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* MODAL */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 px-3"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseModal();
          }}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X size={22} />
            </button>

            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-5">
              {editingId ? "Edit Dhayi Name" : "Add New Dhayi Name"}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name (Include number after dash)
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 outline-none text-sm"
                  placeholder="Example: செய்யத் முஸ்தபா B.Tech - 9715113441"
                  disabled={loading}
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition text-sm"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition text-sm disabled:bg-gray-400 flex items-center gap-2"
                  disabled={loading}
                >
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  {editingId ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
