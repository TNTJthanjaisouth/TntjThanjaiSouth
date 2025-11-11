import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  Save,
  RotateCcw,
  Eye,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

import { TableRow, DhayiName, ImageRow } from "../types";
import { DataTable } from "./DataTable";
import { db, ref, get, update } from "../../Firebase/firebase.config";

export const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [tableData, setTableData] = useState<(TableRow | ImageRow)[]>([]);
  const [ImageData, setImageData] = useState<(TableRow | ImageRow)[]>([]);
  const [dhayiNames, setDhayiNames] = useState<DhayiName[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [tamilDate, setTamilDate] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [headerText, setHeaderText] = useState("TNTJ தென்சென்னை மாவட்டம்");
  const [sessionTime, setSessionTime] = useState(30 * 60); // 30 minutes

  const tamilMonths = [
    "ஜனவரி",
    "பிப்ரவரி",
    "மார்ச்",
    "ஏப்ரல்",
    "மே",
    "ஜூன்",
    "ஜூலை",
    "ஆகஸ்ட்",
    "செப்டம்பர்",
    "அக்டோபர்",
    "நவம்பர்",
    "டிசம்பர்",
  ];

  const formatDateToTamil = (date: Date) => {
    const day = date.getDate();
    const month = tamilMonths[date.getMonth()];
    const year = date.getFullYear();
    return `${month} ${day} ம் தேதி, ${year}`;
  };

  // 🔹 Auto-select next Friday
  useEffect(() => {
    const today = new Date();
    const day = today.getDay(); // 0=Sunday, 5=Friday
    const daysUntilFriday = (5 - day + 7) % 7;
    const nextFriday = new Date(today);
    nextFriday.setDate(today.getDate() + daysUntilFriday);
    setSelectedDate(nextFriday);
    setTamilDate(formatDateToTamil(nextFriday));
  }, []);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.valueAsDate;
    if (date) {
      setSelectedDate(date);
      setTamilDate(formatDateToTamil(date));
    }
  };

  useEffect(() => {
    if (!hasLoaded) loadData();
  }, [hasLoaded]);

  // 🔹 Load data with timeout protection
  const loadData = async () => {
    try {
      setLoading(true);

      // ⏳ Show warning toast if loading exceeds 30 seconds
      const timeout = setTimeout(() => {
        toast.error("Connection issue detected!", {
          description: "Check your internet connection and try again.",
          action: {
            label: "Try Again",
            onClick: () => {
              setHasLoaded(false);
              loadData(); // Retry fetching
            },
          },
          duration: 10000,
        });
      }, 30000);

      const [jummahSnap, dayiSnap, Imagesnap] = await Promise.all([
        get(ref(db, "TNTJ_THANJAI_BRANCH/jummah_details")),
        get(ref(db, "DHAYINAMES")),
        get(ref(db, "IMAGES")),
      ]);

      clearTimeout(timeout);

      if (jummahSnap.exists()) {
        const jummahArray = jummahSnap.val();
        const tableArray: TableRow[] = jummahArray.map(
          (item: any, index: number) => ({
            id: item.kilai_id || `row_${index}`,
            s_no: item.s_no,
            branch: item.branch,
            phone: item.contact,
            time: item.time,
            dai_name_contact: "Nil",
          })
        );
        setTableData(tableArray);
      }
      if (Imagesnap.exists()) {
        const Images = Imagesnap.val();

        setImageData(Images);
      }

      if (dayiSnap.exists()) {
        const dayiObj = dayiSnap.val();
        const dayiList: DhayiName[] = Object.entries(dayiObj).map(
          ([id, val]: any) => ({
            id,
            name: val.dhayiname,
            sort_order: val.sort_order ?? 0,
            created_at: val.created_at ?? "",
          })
        );
        setDhayiNames(dayiList);
      }

      // Load from sessionStorage
      const saved = sessionStorage.getItem("dashboardData");
      if (saved) {
        const parsed = JSON.parse(saved);
        setTableData(parsed.tableData || []);
        setSelectedDate(
          parsed.selectedDate ? new Date(parsed.selectedDate) : null
        );
        setTamilDate(parsed.tamilDate || "");
        setHeaderText(parsed.headerText || "TNTJ தென்சென்னை மாவட்டம்");
      }

      setHasLoaded(true);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error(" Error loading data");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Save handler
  const handleSave = async () => {
    if (!selectedDate) {
      toast(" தயவுசெய்து தேதியை தேர்வு செய்யவும்");
      return;
    }

    try {
      // const updatedData = tableData.map(
      //   ({ s_no, branch, phone, time, dai_name_contact }) => ({
      //     s_no,
      //     branch,
      //     contact: phone,
      //     time,
      //     dai_name_contact,
      //   })
      // );

      // await update(ref(db, "JUMMAH_BRANCH"), { jummah_details: updatedData });
      sessionStorage.setItem(
        "dashboardData",
        JSON.stringify({
          tableData,
          selectedDate,
          tamilDate,
          ImageData,
          headerText,
        })
      );

      toast.success("Data saved successfully ( stored locally)!");
    } catch (error) {
      console.error(error);
      toast.error(" Error saving data");
    }
  };

  // 🔹 Reset handler
  const handleResetToDefault = () => {
    if (!confirm("Are you sure you want to reset data to default values?"))
      return;
    setHasLoaded(false);
    sessionStorage.removeItem("dashboardData");
    toast("Data reset to default values!");
  };

  // 🔹 Preview handler
  const handlePreview = () => {
    if (!selectedDate) {
      toast(" தயவுசெய்து தேதியை தேர்வு செய்யவும்");
      return;
    }

    navigate("/preview", {
      state: {
        tableData,
        selectedDate: tamilDate,
        headerText,
        ImageData,
      },
    });
  };

  // 🔹 Session countdown (auto logout)
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          sessionStorage.clear();
          logout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [logout]);

  // 🔹 Loading screen
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );

  // 🔹 Main dashboard UI
  return (
    <div className="min-h-screen dashboard-bg">
      <nav className="nav-bg border-b border-gray-200 shadow-sm bg-white">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          {/* Left Section: Logo + Title */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img
              src="/Images/tntjlogo.jpeg"
              alt="TNTJ Logo"
              className="w-10 h-10 object-contain rounded-full border border-gray-200"
            />
            <span className="text-lg sm:text-xl font-bold text-slate-800 truncate">
              TNTJ Thanjai South
            </span>
          </div>

          {/* Right Section */}
          <div className="flex items-center">
            {/* Desktop Buttons */}
            <div className="hidden md:flex space-x-5">
              <button
                className="bg-green-200 text-green-600 px-3 py-2 rounded-md text-sm sm:text-md font-semibold hover:bg-green-100 inline-flex items-center"
                onClick={() => navigate("/manageData")}
              >
                <Eye className="mr-2 w-4 h-4" />
                <span className="hidden sm:inline">View Dhayikal List</span>
                <span className="sm:hidden">View</span>
              </button>
              <button
                onClick={logout}
                className="btn-secondary flex items-center gap-2 text-sm sm:text-base"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                {isOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Inline */}
        {isOpen && (
          <div className="md:hidden  px-4 pb-3 space-y-2 bg-white border-t border-gray-200">
            <button
              className="w-full text-left mt-5  bg-green-200 text-green-600 px-3 py-2 rounded-md text-sm font-semibold hover:bg-green-100 flex items-center"
              onClick={() => {
                navigate("/manageData");
                setIsOpen(false);
              }}
            >
              <Eye className="mr-2 w-4 h-4" /> View Dhayikal List
            </button>
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="w-full text-left btn-secondary flex items-center gap-2 text-sm"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        )}
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="sticky top-0 shadow-lg z-50 card mb-6 p-4">
          <div className="flex flex-wrap gap-3 mb-4 items-center">
            {/* Save Button */}
            <button
              onClick={handleSave}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span className="hidden sm:inline">Save Changes</span>
            </button>

            {/* Reset Button */}
            <button
              onClick={handleResetToDefault}
              className="btn-secondary flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Reset to Default</span>
            </button>
            {/* Preview Button */}
            <div className="flex gap-2 ml-auto">
              <button
                onClick={handlePreview}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Preview</span>
              </button>
            </div>
            {/* Date Picker */}
            <div className="flex space-x-2 items-center">
              <label className="hidden sm:inline font-semibold">
                Select Date
              </label>
              <input
                type="date"
                value={
                  selectedDate ? selectedDate.toISOString().substr(0, 10) : ""
                }
                onChange={handleDateChange}
                className="border rounded px-3 py-2"
              />
              {tamilDate && (
                <span className="text-sm text-gray-700">{tamilDate}</span>
              )}
            </div>
          </div>
        </div>

        <div className="card" id="export-content">
          <DataTable
            data={tableData.filter((row): row is TableRow => "id" in row)}
            dayiNames={dhayiNames}
            onChange={setTableData}
          />
        </div>
      </div>
    </div>
  );
};
