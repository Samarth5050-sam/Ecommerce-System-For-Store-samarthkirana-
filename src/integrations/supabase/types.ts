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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      favorites: {
        Row: {
          created_at: string
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: []
      }
      inventory: {
        Row: {
          barcode: string | null
          base_unit: string | null
          batch_number: string | null
          brand: string | null
          category: string
          created_at: string
          discount: number | null
          expiry_date: string | null
          gst_rate: number
          hsn_code: string | null
          id: string
          image: string | null
          in_stock: boolean | null
          low_stock_threshold: number
          mrp: number
          name: string
          name_hindi: string | null
          price: number
          product_id: string
          purchase_price: number
          sku: string | null
          stock_qty: number
          stock_quantity: number
          tax_inclusive: boolean
          unit: string
          units_per_package: number
          updated_at: string
        }
        Insert: {
          barcode?: string | null
          base_unit?: string | null
          batch_number?: string | null
          brand?: string | null
          category: string
          created_at?: string
          discount?: number | null
          expiry_date?: string | null
          gst_rate?: number
          hsn_code?: string | null
          id?: string
          image?: string | null
          in_stock?: boolean | null
          low_stock_threshold?: number
          mrp?: number
          name: string
          name_hindi?: string | null
          price?: number
          product_id: string
          purchase_price?: number
          sku?: string | null
          stock_qty?: number
          stock_quantity?: number
          tax_inclusive?: boolean
          unit?: string
          units_per_package?: number
          updated_at?: string
        }
        Update: {
          barcode?: string | null
          base_unit?: string | null
          batch_number?: string | null
          brand?: string | null
          category?: string
          created_at?: string
          discount?: number | null
          expiry_date?: string | null
          gst_rate?: number
          hsn_code?: string | null
          id?: string
          image?: string | null
          in_stock?: boolean | null
          low_stock_threshold?: number
          mrp?: number
          name?: string
          name_hindi?: string | null
          price?: number
          product_id?: string
          purchase_price?: number
          sku?: string | null
          stock_qty?: number
          stock_quantity?: number
          tax_inclusive?: boolean
          unit?: string
          units_per_package?: number
          updated_at?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount_paid: number
          balance_due: number
          cgst_total: number
          client_ref: string | null
          created_at: string
          customer_name: string | null
          customer_phone: string | null
          discount_total: number
          grand_total: number
          gst_total: number
          id: string
          invoice_no: string
          invoice_type: string
          is_demo: boolean
          item_count: number
          items: Json
          notes: string | null
          payment_method: string
          payment_status: string
          quantity_total: number
          rounding_adjustment: number
          sgst_total: number
          status: string
          subtotal: number
          taxable_total: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount_paid?: number
          balance_due?: number
          cgst_total?: number
          client_ref?: string | null
          created_at?: string
          customer_name?: string | null
          customer_phone?: string | null
          discount_total?: number
          grand_total?: number
          gst_total?: number
          id?: string
          invoice_no: string
          invoice_type?: string
          is_demo?: boolean
          item_count?: number
          items?: Json
          notes?: string | null
          payment_method?: string
          payment_status?: string
          quantity_total?: number
          rounding_adjustment?: number
          sgst_total?: number
          status?: string
          subtotal?: number
          taxable_total?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount_paid?: number
          balance_due?: number
          cgst_total?: number
          client_ref?: string | null
          created_at?: string
          customer_name?: string | null
          customer_phone?: string | null
          discount_total?: number
          grand_total?: number
          gst_total?: number
          id?: string
          invoice_no?: string
          invoice_type?: string
          is_demo?: boolean
          item_count?: number
          items?: Json
          notes?: string | null
          payment_method?: string
          payment_status?: string
          quantity_total?: number
          rounding_adjustment?: number
          sgst_total?: number
          status?: string
          subtotal?: number
          taxable_total?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string
          id: string
          items: Json
          status: string
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          items: Json
          status?: string
          total_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          items?: Json
          status?: string
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          created_by: string | null
          id: string
          invoice_id: string
          method: string
          notes: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          created_by?: string | null
          id?: string
          invoice_id: string
          method?: string
          notes?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          created_by?: string | null
          id?: string
          invoice_id?: string
          method?: string
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      stock_movements: {
        Row: {
          balance_after: number | null
          created_at: string
          created_by: string | null
          id: string
          inventory_id: string | null
          invoice_id: string | null
          movement_type: string
          notes: string | null
          product_id: string | null
          quantity_delta: number
        }
        Insert: {
          balance_after?: number | null
          created_at?: string
          created_by?: string | null
          id?: string
          inventory_id?: string | null
          invoice_id?: string | null
          movement_type: string
          notes?: string | null
          product_id?: string | null
          quantity_delta: number
        }
        Update: {
          balance_after?: number | null
          created_at?: string
          created_by?: string | null
          id?: string
          inventory_id?: string | null
          invoice_id?: string | null
          movement_type?: string
          notes?: string | null
          product_id?: string | null
          quantity_delta?: number
        }
        Relationships: [
          {
            foreignKeyName: "stock_movements_inventory_id_fkey"
            columns: ["inventory_id"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_movements_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          address: string | null
          company: string | null
          created_at: string
          email: string | null
          gst_number: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          products_supplied: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          gst_number?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          products_supplied?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          gst_number?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          products_supplied?: string | null
          updated_at?: string
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      finalize_sale: { Args: { p_payload: Json }; Returns: Json }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
