import { useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import {
  Download,
  Trash2,
  ChevronDown,
  ArrowLeft,
  Check,
  Palette,
  FileText,
  Image,
  FileImage,
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "sonner";

type TableTheme = "classic" | "ocean" | "sunset" | "forest";

const TABLE_THEMES: Record<
  TableTheme,
  {
    name: string;
    evenBg: string;
    oddBg: string;
    color: string;
    header: string;
    subheading: string;
    border: string;
    tablebg_outset: string;
  }
> = {
  classic: {
    name: "Classic",
    evenBg: "bg-gray-50", // softer light gray
    oddBg: "bg-white",
    color: "bg-gray-50",
    header: "bg-gray-700 text-white", // deep gray header
    subheading: "bg-gray-200 text-gray-800", // muted subheader
    border: "border-gray-300",
    tablebg_outset: "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700",
  },
  ocean: {
    name: "Ocean",
    evenBg: "bg-green-50",
    oddBg: "bg-green-100",
    color: "bg-green-100",
    header: "bg-green-600 text-white",
    subheading: "bg-green-200 text-green-800",
    border: "border-green-400",
    tablebg_outset:
      "bg-gradient-to-r from-green-900 via-green-800 to-green-700",
  },
  sunset: {
    name: "Sunset",
    evenBg: "bg-orange-50",
    oddBg: "bg-orange-100",
    color: "bg-orange-100",
    header: "bg-orange-600 text-white",
    subheading: "bg-orange-200 text-orange-800",
    border: "border-orange-400",
    tablebg_outset:
      "bg-gradient-to-r from-orange-900 via-orange-800 to-orange-700",
  },
  forest: {
    name: "Forest",
    evenBg: "bg-green-50",
    oddBg: "bg-green-100",
    color: "bg-green-100",
    header: "bg-green-700 text-white",
    subheading: "bg-green-200 text-green-800",
    border: "border-green-400",
    tablebg_outset:
      "bg-gradient-to-r from-green-900 via-green-800 to-green-700",
  },
};

export const Preview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const previewRef = useRef<HTMLDivElement>(null);

  // Inside your component:
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // 👇 Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowFormats(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const {
    tableData = [],
    selectedDate,
    ImageData,
  } = (location.state as any) || {};

  // const [bgImage, setBgImage] = useState<string | null>(null);
  // const [footerImage, setFooterImage] = useState<string | null>(null);
  const [tableTheme, setTableTheme] = useState<TableTheme>("classic");
  const [zoom, setZoom] = useState(100);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);
  const [showFormats, setShowFormats] = useState(false);
  const handleThemeChange = (theme: TableTheme) => {
    setTableTheme(theme);
    toast.success(`Table theme changed to ${TABLE_THEMES[theme].name}`);
  };

  const handleExport = async (format: "pdf" | "png" | "jpg") => {
    const element = previewRef.current;
    if (!element) return;

    setIsExporting(true);
    setExportSuccess(null);

    try {
      const original = {
        width: element.style.width,
        height: element.style.height,
        transform: element.style.transform,
        position: element.style.position,
        left: element.style.left,
        top: element.style.top,
      };

      const actualWidth = 1000;

      const actualHeight = 3500;
      // console.log(actualWidth, actualHeight);

      // Temporarily move off-screen to prevent scroll interference
      Object.assign(element.style, {
        width: `${actualWidth}px`,
        height: `${actualHeight}px`,
        // transform: "scale(1)",
        position: "absolute",
        left: "-9999px",
        top: "0",
      });

      await new Promise((r) => setTimeout(r, 150));

      // Capture the element to canvas
      const canvas = await html2canvas(element, {
        scale: 2, // higher quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff", // solid white background
        scrollX: 0,
        scrollY: 0,
      });

      // Restore original styles
      Object.assign(element.style, original);

      // Convert to image data
      const imgData = canvas.toDataURL("image/jpeg", 0.95);

      if (format === "png" || format === "jpg") {
        const link = document.createElement("a");
        link.href = imgData;
        link.download = `jummah_schedule_${Date.now()}.${format}`;
        link.click();
      } else {
        const pdf = new jsPDF("p", "px");

        // A4 dimensions in pixels
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = canvas.width;
        const imgHeight = canvas.height;

        // Scale ratio to fit inside A4 while preserving aspect ratio
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight, 1);
        // The `1` ensures we don’t scale up if image is smaller than A4

        const newWidth = imgWidth * ratio;
        const newHeight = imgHeight * ratio;

        // Center the image on the page
        const offsetX = (pdfWidth - newWidth) / 2;
        const offsetY = (pdfHeight - newHeight) / 2;

        pdf.addImage(imgData, "JPEG", offsetX, offsetY, newWidth, newHeight);
        pdf.save(`jummah_schedule_${Date.now()}.pdf`);
      }

      setExportSuccess(format.toUpperCase());
      toast.success(`Exported successfully as ${format.toUpperCase()}!`);
      setTimeout(() => setExportSuccess(null), 3000);
    } catch (err) {
      console.error(err);
      toast.error("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 p-4 md:p-8">
      {/* Export Overlay */}
      {isExporting && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center space-y-5">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-slate-200 rounded-full" />
              <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0" />
            </div>
            <p className="text-xl font-bold text-slate-800">
              Preparing your file...
            </p>
          </div>
        </div>
      )}

      {/* ✅ Fixed Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md border-b border-slate-200 px-3 sm:px-6 py-3 flex flex-wrap sm:flex-nowrap justify-between items-center gap-3">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 sm:w-5 h-4 sm:h-5" />
          <span className="hidden sm:inline">Back</span>
        </button>

        {/* Title */}
        <h1 className="flex-1 text-center sm:text-left text-base sm:text-lg md:text-xl font-bold text-slate-800 truncate">
          Design Customization
        </h1>

        {/* Download Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowFormats((prev) => !prev)}
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-3 sm:px-4 py-2 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all text-sm sm:text-base"
          >
            <Download className="w-4 sm:w-5 h-4 sm:h-5" />
            <span className="hidden sm:inline">Download</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${
                showFormats ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown menu */}
          {showFormats && (
            <div
              ref={dropdownRef}
              className="absolute right-0 mt-2 w-36 sm:w-40 rounded-lg shadow-xl bg-white border border-slate-200 overflow-hidden animate-fadeIn"
            >
              {[
                {
                  fmt: "pdf",
                  label: "PDF",
                  icon: <FileText className="w-4 h-4 text-red-500" />,
                },
                {
                  fmt: "png",
                  label: "PNG",
                  icon: <Image className="w-4 h-4 text-green-500" />,
                },
                {
                  fmt: "jpg",
                  label: "JPG",
                  icon: <FileImage className="w-4 h-4 text-yellow-500" />,
                },
              ].map(({ fmt, label, icon }) => (
                <button
                  key={fmt}
                  onClick={() => {
                    handleExport(fmt as "pdf" | "png" | "jpg");
                    setShowFormats(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-left text-slate-700 hover:bg-green-50 transition-colors text-sm sm:text-base"
                >
                  {icon}
                  <span>{label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ✅ Content below Top Bar */}
      <div className="mt-24 max-w-7xl mx-auto space-y-6">
        {/* 🎨 Design Customization Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Palette className="w-6 h-6 text-green-600" />
            Customize Design
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700 uppercase">
                Table Theme
              </label>
              <select
                value={tableTheme}
                onChange={(e) =>
                  handleThemeChange(e.target.value as TableTheme)
                }
                className="w-full px-4 py-2 border-2 border-slate-300 rounded-xl bg-white text-slate-700 font-semibold focus:border-green-500 focus:ring-2 focus:ring-green-300 focus:outline-none transition-all"
              >
                {(Object.keys(TABLE_THEMES) as TableTheme[]).map((theme) => (
                  <option key={theme} value={theme}>
                    {TABLE_THEMES[theme].name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {/* Live Preview */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 md:p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <span>Live Preview</span>
            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-slate-600">
                Zoom:
              </label>
              <input
                type="range"
                min="50"
                max="150"
                step="5"
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-32 accent-green-600"
              />
              <span className="font-semibold text-slate-700 w-12 text-right">
                {zoom}%
              </span>
            </div>
          </h2>

          <div className="w-full overflow-auto flex justify-center">
            <div
              ref={previewRef}
              className={`   px-6 py-10  transition-transform duration-300 origin-top`}
              style={{
                width: "100%",
                maxWidth: "1000px",
                minWidth: "300px",
                height: "fit-content",
                maxHeight: "fit-content",
                transform: `scale(${zoom / 100})`,
              }}
            >
              <table className="w-full max-w-5xl border-collapse text-lg  font-extrabold overflow-hidden select-none">
                <thead>
                  <tr>
                    <td
                      colSpan={4}
                      className={`p-0 border ${TABLE_THEMES[tableTheme].border}`}
                    >
                      <img
                        src={ImageData?.header}
                        alt="TNTJ Thanjai Heading"
                        className="w-full h-40  object-cover rounded-t-xl"
                      />
                    </td>
                  </tr>
                  <tr className={`${TABLE_THEMES[tableTheme].subheading}`}>
                    <td
                      colSpan={4}
                      className={`px-6 py-4 text-center align-middle font-extrabold text-2xl border ${TABLE_THEMES[tableTheme].border}`}
                    >
                      இன்ஷா அல்லாஹ்{"  "}
                      {selectedDate || "தேதி தேர்ந்தெடுக்கப்படவில்லை"}
                    </td>
                  </tr>
                  <tr className={`${TABLE_THEMES[tableTheme].header}`}>
                    <th
                      className={`py-3 px-4 border-2 ${TABLE_THEMES[tableTheme].border} text-center align-middle`}
                    >
                      நேரம்
                    </th>
                    <th
                      className={`py-3 px-4 border-2 ${TABLE_THEMES[tableTheme].border} text-center align-middle`}
                    >
                      கிளைகள் விவரம்
                    </th>
                    <th
                      className={`py-3 px-4 border-2 ${TABLE_THEMES[tableTheme].border} text-center align-middle`}
                    >
                      தொடர்பு
                    </th>
                    <th
                      className={`py-3 px-4 border-2 ${TABLE_THEMES[tableTheme].border} text-center align-middle`}
                    >
                      பேச்சாளர் விவரம்
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row: any, i: number) => (
                    <tr
                      key={i}
                      className={`${
                        i % 2 === 0
                          ? TABLE_THEMES[tableTheme].evenBg
                          : TABLE_THEMES[tableTheme].oddBg
                      }  transition`}
                    >
                      <td
                        className={`py-3 px-4 border-2 ${TABLE_THEMES[tableTheme].border} font-semibold text-center align-middle whitespace-nowrap`}
                      >
                        {row.time}
                      </td>
                      <td
                        className={`py-3 px-4 border-2 ${TABLE_THEMES[tableTheme].border} text-center align-middle whitespace-nowrap`}
                      >
                        {row.branch}
                      </td>
                      <td
                        className={`py-3 px-4 border-2 ${TABLE_THEMES[tableTheme].border} text-center align-middle whitespace-nowrap`}
                      >
                        {row.phone}
                      </td>
                      <td
                        className={`py-3 px-4 border-2 ${TABLE_THEMES[tableTheme].border} text-red-700 font-semibold text-center align-middle whitespace-nowrap`}
                      >
                        {row.dai_name_contact === "Nil"
                          ? "-"
                          : row.dai_name_contact}
                      </td>
                    </tr>
                  ))}

                  {ImageData?.footer && (
                    <tr>
                      <td colSpan={4}>
                        <img
                          src={ImageData?.footer}
                          alt="Footer"
                          className="w-full h-24 md:h-36 object-cover rounded-b-xl"
                        />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ✅ Reusable UploadField Component */
// const UploadField = ({
//   label,
//   image,
//   setImage,
//   successMsg,
//   removeMsg,
// }: {
//   label: string;
//   image: string | null;
//   setImage: (val: string | null) => void;
//   successMsg: string;
//   removeMsg: string;
// }) => (
//   <div className="space-y-3">
//     <label className="text-sm font-semibold text-slate-700 uppercase">
//       {label}
//     </label>
//     <div className="flex items-center gap-3">
//       <label className="flex-1 cursor-pointer">
//         <div className="border-2 border-dashed border-slate-300 rounded-xl px-4 py-3 bg-slate-50 text-slate-600 text-sm text-center hover:border-primary hover:bg-slate-100 transition-all">
//           {image ? "✓ Change Image" : "📤 Upload Image"}
//         </div>
//         <input
//           type="file"
//           accept="image/*"
//           className="hidden"
//           onChange={(e) => {
//             const file = e.target.files?.[0];
//             if (file) {
//               setImage(URL.createObjectURL(file));
//               toast.success(successMsg);
//             }
//           }}
//         />
//       </label>
//       {image && (
//         <button
//           onClick={() => {
//             setImage(null);
//             toast.info(removeMsg);
//           }}
//           className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 shadow-md"
//         >
//           <Trash2 className="w-5 h-5" />
//         </button>
//       )}
//     </div>
//   </div>
// );
