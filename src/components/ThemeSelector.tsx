import { useState, useEffect } from "react";
import TABLE_THEMES from "../utils/Themes";
import { TableTheme } from "../types";

export default function ThemeSelector({
  tableTheme,
  handleThemeChange,
}: {
  tableTheme: TableTheme;
  handleThemeChange: (theme: TableTheme) => void;
}) {
  const [open, setOpen] = useState(false);
  const currentTheme = TABLE_THEMES[tableTheme];

  // Scroll lock
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none"; // prevents mobile scroll
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [open]);

  return (
    <div className="relative inline-block text-left w-full">
      {/* Label */}
      <label className="text-sm font-semibold text-slate-700 uppercase block mb-2">
        Table Theme
      </label>

      {/* Trigger Button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2 border-2 border-slate-300 rounded-xl bg-white text-slate-700 font-semibold hover:border-green-500 focus:ring-2 focus:ring-green-300 transition-all"
      >
        <div className="flex flex-col items-center gap-1 w-full">
          <div className="flex w-1/2 h-6 rounded overflow-hidden border border-slate-300">
            <div className={`flex-1 ${currentTheme.header}`} />
            <div className={`flex-1 ${currentTheme.subheading}`} />
            <div className={`flex-1 ${currentTheme.evenBg}`} />
            <div className={`flex-1 ${currentTheme.oddBg}`} />
          </div>
          <span className="text-xs font-semibold text-slate-700 truncate">
            {currentTheme.name}
          </span>
        </div>

        {/* Chevron */}
        <svg
          className={`w-5 h-5 ml-3 transform transition-transform ${
            open ? "rotate-180" : "rotate-0"
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Modal with blur & click-away */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn"
          onClick={() => setOpen(false)} // click-away to close
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-[95%] sm:w-[90%] md:w-[60%] lg:w-[50%] max-h-[85vh] overflow-y-auto flex flex-col"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-slate-200 sticky top-0 bg-white z-10">
              <h2 className="text-lg font-bold text-slate-800">Choose Theme</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-slate-500 hover:text-slate-700 text-xl"
              >
                ✕
              </button>
            </div>

            {/* Theme grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
              {(Object.keys(TABLE_THEMES) as TableTheme[]).map((theme) => {
                const t = TABLE_THEMES[theme];
                return (
                  <button
                    key={theme}
                    onClick={() => {
                      handleThemeChange(theme);
                      setOpen(false);
                    }}
                    className={`flex flex-col items-center justify-center rounded-lg border-2 p-3 transition-all ${
                      tableTheme === theme
                        ? "border-green-500 ring-2 ring-green-300"
                        : "border-transparent hover:border-slate-300"
                    }`}
                  >
                    <div className="flex w-full h-8 rounded overflow-hidden border border-slate-200">
                      <div className={`flex-1 ${t.header}`} />
                      <div className={`flex-1 ${t.subheading}`} />
                      <div className={`flex-1 ${t.evenBg}`} />
                      <div className={`flex-1 ${t.oddBg}`} />
                    </div>
                    <span className="mt-2 text-xs font-semibold text-slate-700 text-center">
                      {t.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
