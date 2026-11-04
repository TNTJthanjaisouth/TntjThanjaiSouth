import { useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import {
  Download,
  ChevronDown,
  ArrowLeft,
  Palette,
  Image,
  Share2,
  Smartphone,
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "sonner";
import TABLE_THEMES from "../utils/Themes";
import { TableTheme } from "../types";
import ThemeSelector from "./ThemeSelector";

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
  const [showFormats, setShowFormats] = useState(false);
  const handleThemeChange = (theme: TableTheme) => {
    setTableTheme(theme);
    toast.success(`Table theme changed to ${TABLE_THEMES[theme].name}`, {
      duration: 2000,
    });
  };

  // Capture at a consistent desktop print width, regardless of mobile viewport or zoom.
  const captureSchedule = async (): Promise<HTMLCanvasElement> => {
    const element = previewRef.current;
    if (!element) throw new Error("Schedule preview is unavailable");
    await document.fonts.ready;
    const clone = element.cloneNode(true) as HTMLDivElement;
    Object.assign(clone.style, {
      width: "1000px", maxWidth: "none", minWidth: "1000px",
      height: "auto", maxHeight: "none", transform: "none", transition: "none",
      position: "fixed", top: "0", left: "0", zIndex: "-1", pointerEvents: "none",
    });
    document.body.appendChild(clone);
    try {
      const images = Array.from(clone.querySelectorAll("img"));
      await Promise.all(images.map(img => img.complete ? Promise.resolve() : new Promise<void>(resolve => {
        img.addEventListener("load", () => resolve(), {once:true});
        img.addEventListener("error", () => resolve(), {once:true});
      })));
      return await html2canvas(clone, {
        scale: 2, useCORS: true, allowTaint: false, backgroundColor: "#ffffff",
        width: 1000, height: clone.scrollHeight, windowWidth: 1100,
      });
    } finally {
      clone.remove();
    }
  };

  const canvasBlob = (canvas: HTMLCanvasElement, mime: string) => new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error("Unable to generate image")), mime, 0.94);
  });
  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = filename; document.body.appendChild(link); link.click(); link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 30000);
  };
  const handleExport = async (format: "pdf" | "png" | "jpg") => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      const canvas = await captureSchedule();
      const name = `jummah_schedule_${Date.now()}`;
      if (format === "pdf") {
        const pdf = new jsPDF({orientation:"portrait", unit:"mm", format:"a4"});
        const width = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const fullHeight = canvas.height * width / canvas.width;
        const image = canvas.toDataURL("image/jpeg", 0.94);
        let offset = 0;
        while (offset < fullHeight) {
          if (offset > 0) pdf.addPage();
          pdf.addImage(image, "JPEG", 0, -offset, width, fullHeight);
          offset += pageHeight;
        }
        pdf.save(`${name}.pdf`);
      } else {
        const mime = format === "png" ? "image/png" : "image/jpeg";
        downloadBlob(await canvasBlob(canvas, mime), `${name}.${format}`);
      }
      toast.success("கோப்பு பதிவிறக்கப்பட்டது");
    } catch (error) {
      console.error(error);
      toast.error("படம் உருவாக்க முடியவில்லை. படங்கள் மற்றும் இணைய இணைப்பைச் சரிபார்க்கவும்.");
    } finally { setIsExporting(false); }
  };

  const handleShare = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      const canvas = await captureSchedule();
      const blob = await canvasBlob(canvas, "image/png");
      const file = new File([blob], "jummah_schedule.png", {type:"image/png"});
      const shareText = `ஜும்ஆ அட்டவணை – ${selectedDate || ""}`;
      if (navigator.share && navigator.canShare?.({files:[file]})) {
        await navigator.share({files:[file], title:"ஜும்ஆ அட்டவணை", text:shareText});
      } else {
        downloadBlob(blob, file.name);
        toast.info("படம் பதிவிறக்கப்பட்டது. WhatsApp-ல் இந்தப் படத்தை இணைத்துப் பகிரவும்.");
      }
    } catch (error) {
      if ((error as Error)?.name !== "AbortError") {
        console.error(error);
        toast.error("பகிர முடியவில்லை. படத்தைப் பதிவிறக்கி WhatsApp-ல் பகிரவும்.");
      }
    } finally { setIsExporting(false); }
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

      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-emerald-100 shadow-sm -mx-4 md:-mx-8 px-3 sm:px-6 py-3">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center gap-2 sm:gap-3">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-3 text-slate-700 font-semibold min-h-11" aria-label="திரும்பு">
            <ArrowLeft size={18}/><span className="hidden sm:inline">திரும்பு</span>
          </button>
          <h1 className="flex-1 min-w-[110px] text-base sm:text-xl font-bold text-emerald-950">ஜும்ஆ அட்டவணை</h1>
          <button disabled={isExporting} onClick={() => void handleExport("png")} className="flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-3 sm:px-4 py-3 text-white font-semibold min-h-11 disabled:opacity-50">
            <Image size={18}/><span>படம் உருவாக்கு</span>
          </button>
          <button disabled={isExporting} onClick={() => void handleShare()} className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-3 sm:px-4 py-3 text-white font-semibold min-h-11 disabled:opacity-50">
            <Share2 size={18}/><span>WhatsApp பகிர்</span>
          </button>
          <div className="relative" ref={dropdownRef}>
            <button disabled={isExporting} onClick={() => setShowFormats(v=>!v)} className="flex items-center gap-1 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-3 font-semibold text-emerald-900 min-h-11 disabled:opacity-50">
              <Download size={18}/><span className="hidden sm:inline">பதிவிறக்கம்</span><ChevronDown size={16}/>
            </button>
            {showFormats && <div className="absolute right-0 top-full mt-2 w-40 overflow-hidden rounded-xl bg-white border shadow-xl z-50">
              {(["pdf","png","jpg"] as const).map(fmt => <button key={fmt} onClick={() => {setShowFormats(false);void handleExport(fmt)}} className="w-full px-4 py-3 text-left hover:bg-emerald-50">{fmt.toUpperCase()}</button>)}
            </div>}
          </div>
        </div>
      </div>

      {/* ✅ Content below Top Bar */}
      <div className="mt-5 max-w-7xl mx-auto space-y-5">
        {/* 🎨 Design Customization Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-3 sm:p-4 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Palette className="w-6 h-6 text-green-600" />
            Customize Design
          </h2>
          <ThemeSelector
            tableTheme={tableTheme}
            handleThemeChange={handleThemeChange}
          />
        </div>
        {/* Live Preview */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-3 sm:p-4 md:p-8">
          <h2 className="text-lg sm:text-2xl font-bold text-slate-800 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
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

          <p className="mb-3 text-xs text-slate-500 flex items-center gap-2"><Smartphone size={15}/> கைப்பேசியில் அட்டவணையைப் பார்க்க பக்கவாட்டில் நகர்த்தவும். பகிரும்போது முழு அட்டவணையும் படமாக உருவாகும்.</p>
          <div className="w-full overflow-x-auto overflow-y-hidden rounded-xl bg-slate-50 border border-slate-100">
            <div
              ref={previewRef}
              className="px-4 sm:px-6 py-6 sm:py-10 origin-top-left"
              style={{
                width: "1000px",
                maxWidth: "none",
                minWidth: "1000px",
                height: "fit-content",
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
                      className={`px-3 pt-2 pb-6 text-left align-middle   border ${TABLE_THEMES[tableTheme].border}`}
                    >
                      <span className="font-black text-3xl ">
                        ஜும்ஆ தாயிக்களின் விபரம்
                      </span>
                      <br />
                      <br />
                      <span className="text-2xl font-light">
                        இன்ஷா அல்லாஹ்{" "}
                        {selectedDate || "தேதி தேர்ந்தெடுக்கப்படவில்லை"}
                      </span>
                      <br />
                    </td>
                  </tr>

                  <tr className={`${TABLE_THEMES[tableTheme].header}`}>
                    <th
                      className={`py-3 px-4 border-2 ${TABLE_THEMES[tableTheme].border} text-left align-middle`}
                    >
                      நேரம்
                    </th>
                    <th
                      className={`py-3 px-4 border-2 ${TABLE_THEMES[tableTheme].border} text-left align-middle`}
                    >
                      கிளைகள் விபரம்
                    </th>
                    <th
                      className={`py-3 px-4 border-2 ${TABLE_THEMES[tableTheme].border} text-left align-middle`}
                    >
                      தொடர்புக்கு
                    </th>
                    <th
                      className={`py-3 px-4 border-2 ${TABLE_THEMES[tableTheme].border} text-left align-middle`}
                    >
                      பேச்சாளர் விபரம்
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
                        className={`py-3 px-4 border-2 ${TABLE_THEMES[tableTheme].border} font-semibold text-left align-middle whitespace-nowrap`}
                      >
                        {row.time}
                      </td>
                      <td
                        className={`py-3 px-4 border-2 ${TABLE_THEMES[tableTheme].border} text-left align-middle whitespace-nowrap`}
                      >
                        {row.branch}
                      </td>
                      <td
                        className={`py-3 px-4 border-2 ${TABLE_THEMES[tableTheme].border} text-left align-middle whitespace-nowrap`}
                      >
                        {row.phone}
                      </td>
                      <td
                        className={`py-3 px-4 border-2 ${TABLE_THEMES[tableTheme].border} text-red-700 font-semibold text-left align-middle whitespace-nowrap`}
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
