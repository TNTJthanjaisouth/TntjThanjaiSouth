export interface Admin {
  id: string;
  username: string;
  password: string;
  created_at: string;
}

export interface DhayiName {
  id: string;
  name: string;
  sort_order: number;
  created_at: string;
}

export interface TableRow {
  id: string;
  s_no: number;
  branch: string;
  phone: string;
  time: string;
  dai_name_contact: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface AppSettings {
  id: string;
  title: string;
  description: string;
  contact_info: string;
  updated_at: string;
}
export interface DhayiName {
  id: string;
  name: string;
  sort_order: number;
  created_at: string;
}

export interface TableRow {
  id: string;
  sno?: string;
  branch: string;
  phone: string;
  time: string;
  dai_name_contact: string;
}

export interface ImageRow {
  FooterImage?: Base64URLString;
  HeaderImage?: Base64URLString;
}

export type Theme = "light" | "dark" | "tamil";
export type TableTheme =
  // Neutral & Classic
  | "classic"
  | "slate"
  | "minimal"

  // Cool tones
  | "ocean"
  | "sky"
  | "teal"
  | "arctic"

  // Warm tones
  | "sunset"
  | "ember"
  | "sand"
  | "coral"
  | "gold"

  // Earthy
  | "forest"
  | "moss"
  | "desert"

  // Dark
  | "midnight"
  | "graphite"
  | "abyss"

  // Soft / Pastel
  | "lavender"
  | "rose"
  | "peach"
  | "mint"
  | "lilac"
  | "ivory";
