import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, X, Search } from "lucide-react";
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

    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    try {
      setLoading(true);

      if (editingId) {
        await updateDhayiName(editingId, formData.name, formData.sortOrder);
        toast.success("Dhayi name updated successfully");
      } else {
        await addDhayiName(formData.name, formData.sortOrder);
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
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      {/* Header + Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          Dhayi Names Manager
        </h2>

        <div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search Dhayi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none text-sm"
            />
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition text-sm"
            disabled={loading}
          >
            <Plus size={18} />
            Add New
          </button>
        </div>
      </div>

      {/* Table Section */}
      {loading && dhayiNames.length === 0 ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      ) : filteredDhayiNames.length === 0 ? (
        <p className="text-center text-gray-500 py-8">
          No Dhayi names found {searchQuery && `for "${searchQuery}"`}.
        </p>
      ) : (
        <>
          <div className="flex justify-end text-sm text-gray-600 mb-2">
            Total: {filteredDhayiNames.length}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[400px]">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="text-left py-3 px-3 sm:px-4 font-semibold text-gray-700">
                    #
                  </th>
                  <th className="text-left py-3 px-3 sm:px-4 font-semibold text-gray-700">
                    Name
                  </th>

                  <th className="text-right py-3 px-3 sm:px-4 font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDhayiNames.map((dhayi, i) => (
                  <tr
                    key={dhayi.id}
                    className="border-b border-gray-200 hover:bg-gray-50 text-sm"
                  >
                    <td className="py-3 px-3 sm:px-4">{i + 1}</td>
                    <td className="py-3 px-3 sm:px-4 font-medium break-words">
                      {dhayi.name}
                    </td>

                    <td className="py-3 px-3 sm:px-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(dhayi)}
                          className="text-green-600 hover:text-green-800 p-1.5 rounded hover:bg-green-50"
                          disabled={loading}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(dhayi.id)}
                          className="text-red-600 hover:text-red-800 p-1.5 rounded hover:bg-red-50"
                          disabled={loading}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* MODAL */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 px-3"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseModal();
          }}
        >
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {editingId ? "Edit Dhayi Name" : "Add New Dhayi Name"}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="Enter Dhayi name"
                  disabled={loading}
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition text-sm"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition text-sm disabled:bg-gray-400"
                  disabled={loading}
                >
                  {loading ? "Saving..." : editingId ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
