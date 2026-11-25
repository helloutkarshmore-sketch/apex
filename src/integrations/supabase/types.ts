export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          city: string
          country: string
          id: string
          line1: string
          line2: string
          name: string
          phone: string
          pin: string
          state: string
          user_id: string
        }
        Insert: {
          city: string
          country?: string
          id?: string
          line1: string
          line2?: string
          name: string
          phone: string
          pin: string
          state: string
          user_id: string
        }
        Update: {
          city?: string
          country?: string
          id?: string
          line1?: string
          line2?: string
          name?: string
          phone?: string
          pin?: string
          state?: string
          user_id?: string
        }
        Relationships: []
      }
      admin_invitations: {
        Row: {
          email: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          email: string
          role?: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          email?: string
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          body: string
          category: string
          created_at: string
          excerpt: string
          image_url: string | null
          published: boolean
          slug: string
          title: string
        }
        Insert: {
          body?: string
          category?: string
          created_at?: string
          excerpt?: string
          image_url?: string | null
          published?: boolean
          slug: string
          title: string
        }
        Update: {
          body?: string
          category?: string
          created_at?: string
          excerpt?: string
          image_url?: string | null
          published?: boolean
          slug?: string
          title?: string
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          id: string
          product_id: string
          quantity: number
          user_id: string
        }
        Insert: {
          id?: string
          product_id: string
          quantity: number
          user_id: string
        }
        Update: {
          id?: string
          product_id?: string
          quantity?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          description: string
          id: string
          image_key: string
          name: string
          sort_order: number
        }
        Insert: {
          description?: string
          id: string
          image_key?: string
          name: string
          sort_order?: number
        }
        Update: {
          description?: string
          id?: string
          image_key?: string
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      cms_pages: {
        Row: {
          body: string
          published: boolean
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          body?: string
          published?: boolean
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          body?: string
          published?: boolean
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      coupons: {
        Row: {
          active: boolean
          code: string
          expires_at: string | null
          kind: string
          minimum_total: number
          usage_limit: number | null
          value: number
        }
        Insert: {
          active?: boolean
          code: string
          expires_at?: string | null
          kind: string
          minimum_total?: number
          usage_limit?: number | null
          value: number
        }
        Update: {
          active?: boolean
          code?: string
          expires_at?: string | null
          kind?: string
          minimum_total?: number
          usage_limit?: number | null
          value?: number
        }
        Relationships: []
      }
      enquiries: {
        Row: {
          company: string
          created_at: string
          document_path: string | null
          email: string
          gstin: string
          id: string
          internal_notes: string
          items: Json
          kind: string
          location: string
          message: string
          name: string
          phone: string
          quotation: Json | null
          status: string
          subject: string
          user_id: string
        }
        Insert: {
          company?: string
          created_at?: string
          document_path?: string | null
          email: string
          gstin?: string
          id?: string
          internal_notes?: string
          items?: Json
          kind: string
          location?: string
          message?: string
          name: string
          phone?: string
          quotation?: Json | null
          status?: string
          subject?: string
          user_id: string
        }
        Update: {
          company?: string
          created_at?: string
          document_path?: string | null
          email?: string
          gstin?: string
          id?: string
          internal_notes?: string
          items?: Json
          kind?: string
          location?: string
          message?: string
          name?: string
          phone?: string
          quotation?: Json | null
          status?: string
          subject?: string
          user_id?: string
        }
        Relationships: []
      }
      inventory_transactions: {
        Row: {
          actor_id: string | null
          created_at: string
          id: string
          new_stock: number | null
          previous_stock: number | null
          product_id: string | null
          sku: string
        }
        Insert: {
          actor_id?: string | null
          created_at?: string
          id?: string
          new_stock?: number | null
          previous_stock?: number | null
          product_id?: string | null
          sku: string
        }
        Update: {
          actor_id?: string | null
          created_at?: string
          id?: string
          new_stock?: number | null
          previous_stock?: number | null
          product_id?: string | null
          sku?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_transactions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
        }
        Insert: {
          created_at?: string
          email: string
        }
        Update: {
          created_at?: string
          email?: string
        }
        Relationships: []
      }
      order_status_history: {
        Row: {
          created_at: string
          id: string
          order_id: string
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          status: string
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_status_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          courier: string | null
          created_at: string
          estimated_delivery: string | null
          id: string
          invoice_path: string | null
          items: Json
          number: string
          payment_status: string
          shipping_address: Json
          status: string
          total: number
          tracking_number: string | null
          user_id: string
        }
        Insert: {
          courier?: string | null
          created_at?: string
          estimated_delivery?: string | null
          id?: string
          invoice_path?: string | null
          items: Json
          number: string
          payment_status?: string
          shipping_address: Json
          status?: string
          total: number
          tracking_number?: string | null
          user_id: string
        }
        Update: {
          courier?: string | null
          created_at?: string
          estimated_delivery?: string | null
          id?: string
          invoice_path?: string | null
          items?: Json
          number?: string
          payment_status?: string
          shipping_address?: Json
          status?: string
          total?: number
          tracking_number?: string | null
          user_id?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          brand: string
          bulk_tiers: Json
          category_id: string | null
          created_at: string
          description: string
          featured: boolean
          gst_rate: number | null
          id: string
          image_key: string
          image_url: string | null
          min_quantity: number
          name: string
          price: number | null
          published: boolean
          sku: string
          source_name: string
          specs: Json
          stock: number | null
          unit: string
        }
        Insert: {
          brand?: string
          bulk_tiers?: Json
          category_id?: string | null
          created_at?: string
          description?: string
          featured?: boolean
          gst_rate?: number | null
          id: string
          image_key?: string
          image_url?: string | null
          min_quantity?: number
          name: string
          price?: number | null
          published?: boolean
          sku: string
          source_name?: string
          specs?: Json
          stock?: number | null
          unit?: string
        }
        Update: {
          brand?: string
          bulk_tiers?: Json
          category_id?: string | null
          created_at?: string
          description?: string
          featured?: boolean
          gst_rate?: number | null
          id?: string
          image_key?: string
          image_url?: string | null
          min_quantity?: number
          name?: string
          price?: number | null
          published?: boolean
          sku?: string
          source_name?: string
          specs?: Json
          stock?: number | null
          unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          company: string | null
          full_name: string
          gstin: string | null
          id: string
          phone: string | null
        }
        Insert: {
          company?: string | null
          full_name?: string
          gstin?: string | null
          id: string
          phone?: string | null
        }
        Update: {
          company?: string | null
          full_name?: string
          gstin?: string | null
          id?: string
          phone?: string | null
        }
        Relationships: []
      }
      submission_limits: {
        Row: {
          fingerprint: string
          last_submitted_at: string
        }
        Insert: {
          fingerprint: string
          last_submitted_at?: string
        }
        Update: {
          fingerprint?: string
          last_submitted_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wishlist_items: {
        Row: {
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_manage: { Args: { _area: string }; Returns: boolean }
      claim_submission: { Args: { _fingerprint: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "super_admin"
        | "product_admin"
        | "order_admin"
        | "content_admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "super_admin",
        "product_admin",
        "order_admin",
        "content_admin",
      ],
    },
  },
} as const
