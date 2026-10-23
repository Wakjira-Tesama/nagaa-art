export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          label: string;
          is_builtin: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          label: string;
          is_builtin?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          label?: string;
          is_builtin?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      artworks: {
        Row: {
          id: string;
          legacy_id: number | null;
          title: string;
          description: string;
          medium: "leather" | "canvas" | "wall" | string;
          category: string;
          dimensions: string;
          year: string;
          image_url: string | null;
          image_key: string | null;
          sort_order: number;
          is_seed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          legacy_id?: number | null;
          title: string;
          description?: string;
          medium: "leather" | "canvas" | "wall" | string;
          category: string;
          dimensions?: string;
          year?: string;
          image_url?: string | null;
          image_key?: string | null;
          sort_order?: number;
          is_seed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          legacy_id?: number | null;
          title?: string;
          description?: string;
          medium?: "leather" | "canvas" | "wall" | string;
          category?: string;
          dimensions?: string;
          year?: string;
          image_url?: string | null;
          image_key?: string | null;
          sort_order?: number;
          is_seed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      inquiries: {
        Row: {
          id: string;
          name: string;
          phone: string;
          category: string;
          medium: "leather" | "canvas" | "both";
          message: string;
          status: "pending" | "in_progress" | "completed";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          phone: string;
          category: string;
          medium: "leather" | "canvas" | "both";
          message?: string;
          status?: "pending" | "in_progress" | "completed";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          phone?: string;
          category?: string;
          medium?: "leather" | "canvas" | "both";
          message?: string;
          status?: "pending" | "in_progress" | "completed";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      admin_profile: {
        Row: {
          id: number;
          name: string;
          role: string;
          email: string;
          phone: string;
          avatar_url: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name?: string;
          role?: string;
          email?: string;
          phone?: string;
          avatar_url?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          role?: string;
          email?: string;
          phone?: string;
          avatar_url?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type ArtworkRow = Database["public"]["Tables"]["artworks"]["Row"];
export type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];
export type InquiryRow = Database["public"]["Tables"]["inquiries"]["Row"];
export type AdminProfileRow = Database["public"]["Tables"]["admin_profile"]["Row"];
