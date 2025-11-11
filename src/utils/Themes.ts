import { TableTheme } from "../types";

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
  // 🌿 Neutral & Classic
  classic: {
    name: "Classic",
    evenBg: "bg-gray-50",
    oddBg: "bg-white",
    color: "bg-gray-50",
    header: "bg-gray-700 text-white",
    subheading: "bg-gray-200 text-gray-800",
    border: "border-gray-300",
    tablebg_outset: "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700",
  },
  slate: {
    name: "Slate",
    evenBg: "bg-slate-50",
    oddBg: "bg-slate-100",
    color: "bg-slate-100",
    header: "bg-slate-700 text-white",
    subheading: "bg-slate-200 text-slate-900",
    border: "border-slate-400",
    tablebg_outset:
      "bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700",
  },
  minimal: {
    name: "Minimal",
    evenBg: "bg-white",
    oddBg: "bg-gray-50",
    color: "bg-gray-50",
    header: "bg-gray-100 text-gray-900",
    subheading: "bg-gray-200 text-gray-800",
    border: "border-gray-200",
    tablebg_outset: "bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300",
  },

  // 🌊 Cool tones
  ocean: {
    name: "Ocean",
    evenBg: "bg-blue-50",
    oddBg: "bg-blue-100",
    color: "bg-blue-100",
    header: "bg-blue-600 text-white",
    subheading: "bg-blue-200 text-blue-900",
    border: "border-blue-400",
    tablebg_outset: "bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700",
  },
  sky: {
    name: "Sky",
    evenBg: "bg-sky-50",
    oddBg: "bg-sky-100",
    color: "bg-sky-100",
    header: "bg-sky-600 text-white",
    subheading: "bg-sky-200 text-sky-900",
    border: "border-sky-400",
    tablebg_outset: "bg-gradient-to-r from-sky-900 via-sky-800 to-sky-700",
  },
  teal: {
    name: "Teal",
    evenBg: "bg-teal-50",
    oddBg: "bg-teal-100",
    color: "bg-teal-100",
    header: "bg-teal-600 text-white",
    subheading: "bg-teal-200 text-teal-900",
    border: "border-teal-400",
    tablebg_outset: "bg-gradient-to-r from-teal-900 via-teal-800 to-teal-700",
  },
  arctic: {
    name: "Arctic",
    evenBg: "bg-cyan-50",
    oddBg: "bg-cyan-100",
    color: "bg-cyan-100",
    header: "bg-cyan-600 text-white",
    subheading: "bg-cyan-200 text-cyan-900",
    border: "border-cyan-400",
    tablebg_outset: "bg-gradient-to-r from-cyan-900 via-cyan-800 to-cyan-700",
  },

  // 🌅 Warm tones
  sunset: {
    name: "Sunset",
    evenBg: "bg-orange-50",
    oddBg: "bg-orange-100",
    color: "bg-orange-100",
    header: "bg-orange-600 text-white",
    subheading: "bg-orange-200 text-orange-900",
    border: "border-orange-400",
    tablebg_outset:
      "bg-gradient-to-r from-orange-900 via-orange-800 to-orange-700",
  },
  ember: {
    name: "Ember",
    evenBg: "bg-red-50",
    oddBg: "bg-red-100",
    color: "bg-red-100",
    header: "bg-red-700 text-white",
    subheading: "bg-red-200 text-red-900",
    border: "border-red-400",
    tablebg_outset: "bg-gradient-to-r from-red-900 via-red-800 to-red-700",
  },
  sand: {
    name: "Sand",
    evenBg: "bg-amber-50",
    oddBg: "bg-amber-100",
    color: "bg-amber-100",
    header: "bg-amber-600 text-white",
    subheading: "bg-amber-200 text-amber-900",
    border: "border-amber-400",
    tablebg_outset:
      "bg-gradient-to-r from-amber-900 via-amber-800 to-amber-700",
  },
  coral: {
    name: "Coral",
    evenBg: "bg-rose-50",
    oddBg: "bg-rose-100",
    color: "bg-rose-100",
    header: "bg-rose-600 text-white",
    subheading: "bg-rose-200 text-rose-900",
    border: "border-rose-400",
    tablebg_outset: "bg-gradient-to-r from-rose-900 via-rose-800 to-rose-700",
  },
  gold: {
    name: "Gold",
    evenBg: "bg-yellow-50",
    oddBg: "bg-yellow-100",
    color: "bg-yellow-100",
    header: "bg-yellow-600 text-gray-900",
    subheading: "bg-yellow-200 text-yellow-900",
    border: "border-yellow-400",
    tablebg_outset:
      "bg-gradient-to-r from-yellow-900 via-yellow-800 to-yellow-700",
  },

  // 🌳 Earthy tones
  forest: {
    name: "Forest",
    evenBg: "bg-green-50",
    oddBg: "bg-green-100",
    color: "bg-green-100",
    header: "bg-green-700 text-white",
    subheading: "bg-green-200 text-green-900",
    border: "border-green-400",
    tablebg_outset:
      "bg-gradient-to-r from-green-900 via-green-800 to-green-700",
  },
  moss: {
    name: "Moss",
    evenBg: "bg-lime-50",
    oddBg: "bg-lime-100",
    color: "bg-lime-100",
    header: "bg-lime-600 text-white",
    subheading: "bg-lime-200 text-lime-900",
    border: "border-lime-400",
    tablebg_outset: "bg-gradient-to-r from-lime-900 via-lime-800 to-lime-700",
  },
  desert: {
    name: "Desert",
    evenBg: "bg-yellow-50",
    oddBg: "bg-yellow-100",
    color: "bg-yellow-100",
    header: "bg-amber-700 text-white",
    subheading: "bg-yellow-200 text-yellow-900",
    border: "border-amber-400",
    tablebg_outset:
      "bg-gradient-to-r from-amber-900 via-amber-800 to-yellow-700",
  },

  // 🌙 Dark themes
  midnight: {
    name: "Midnight",
    evenBg: "bg-slate-200",
    oddBg: "bg-slate-300",
    color: "bg-slate-300",
    header: "bg-black text-white",
    subheading: "bg-slate-700 text-gray-100",
    border: "border-slate-700",
    tablebg_outset: "bg-gradient-to-r from-black via-slate-900 to-gray-800",
  },
  graphite: {
    name: "Graphite",
    evenBg: "bg-neutral-200",
    oddBg: "bg-neutral-300",
    color: "bg-neutral-300",
    header: "bg-neutral-950 text-white",
    subheading: "bg-neutral-700 text-gray-100",
    border: "border-neutral-700",
    tablebg_outset:
      "bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-700",
  },
  abyss: {
    name: "Abyss",
    evenBg: "bg-indigo-200",
    oddBg: "bg-indigo-450",
    color: "bg-indigo-950",
    header: "bg-indigo-950 text-white",
    subheading: "bg-indigo-600 text-indigo-50",
    border: "border-indigo-800",
    tablebg_outset: "bg-gradient-to-r from-black via-indigo-900 to-indigo-800",
  },

  lavender: {
    name: "Lavender",
    evenBg: "bg-purple-50",
    oddBg: "bg-purple-100",
    color: "bg-purple-100",
    header: "bg-purple-600 text-white",
    subheading: "bg-purple-200 text-purple-900",
    border: "border-purple-400",
    tablebg_outset:
      "bg-gradient-to-r from-purple-900 via-purple-800 to-purple-700",
  },
  rose: {
    name: "Rose",
    evenBg: "bg-rose-50",
    oddBg: "bg-rose-100",
    color: "bg-rose-100",
    header: "bg-rose-600 text-white",
    subheading: "bg-rose-200 text-rose-900",
    border: "border-rose-400",
    tablebg_outset: "bg-gradient-to-r from-rose-900 via-rose-800 to-rose-700",
  },
  peach: {
    name: "Peach",
    evenBg: "bg-orange-50",
    oddBg: "bg-orange-100",
    color: "bg-orange-100",
    header: "bg-orange-500 text-white",
    subheading: "bg-orange-200 text-orange-900",
    border: "border-orange-300",
    tablebg_outset:
      "bg-gradient-to-r from-orange-900 via-orange-700 to-orange-600",
  },
  mint: {
    name: "Mint",
    evenBg: "bg-emerald-50",
    oddBg: "bg-emerald-100",
    color: "bg-emerald-100",
    header: "bg-emerald-600 text-white",
    subheading: "bg-emerald-200 text-emerald-900",
    border: "border-emerald-400",
    tablebg_outset:
      "bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-700",
  },
  lilac: {
    name: "Lilac",
    evenBg: "bg-violet-50",
    oddBg: "bg-violet-100",
    color: "bg-violet-100",
    header: "bg-violet-600 text-white",
    subheading: "bg-violet-200 text-violet-900",
    border: "border-violet-400",
    tablebg_outset:
      "bg-gradient-to-r from-violet-900 via-violet-800 to-violet-700",
  },
  ivory: {
    name: "Ivory",
    evenBg: "bg-amber-50",
    oddBg: "bg-orange-50",
    color: "bg-orange-50",
    header: "bg-yellow-100 text-yellow-900",
    subheading: "bg-yellow-200 text-yellow-800",
    border: "border-yellow-200",
    tablebg_outset:
      "bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-400",
  },
};

export default TABLE_THEMES;
