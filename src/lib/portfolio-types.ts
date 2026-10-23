import type { Category } from "@/lib/art-content";

export interface Artwork {
  id: number;
  /** Supabase row id when backed by the database */
  uuid?: string;
  src: string;
  medium: "leather" | "canvas" | "wall" | string;
  category: Category;
  dimensions: string;
  year: string;
  customTitle?: string;
  customDesc?: string;
  isCustom?: boolean;
  imageKey?: string;
  additionalImages?: string[];
}

export interface Inquiry {
  id: string;
  name: string;
  phone: string;
  category: Category;
  medium: "leather" | "canvas" | "both";
  message: string;
  date: string;
  status: "pending" | "in_progress" | "completed";
}

export interface AdminProfile {
  name: string;
  role: string;
  email: string;
  phone: string;
  avatar: string;
}

export const defaultAdminProfile: AdminProfile = {
  name: "Nagaa Abboomaa",
  role: "Master Artist",
  email: "nagaaabboomaa@gmail.com",
  phone: "+251 917 362 405",
  avatar: "",
};

export function getProfileInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0];
  const second = parts[1];
  if (!first) return "NA";
  if (!second) return first.slice(0, 2).toUpperCase();
  return `${first[0]}${second[0]}`.toUpperCase();
}
