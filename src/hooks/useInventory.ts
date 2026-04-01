import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface InventoryItem {
  id: string;
  product_id: string;
  name: string;
  name_hindi: string | null;
  category: string;
  price: number;
  unit: string;
  image: string | null;
  stock_quantity: number;
  low_stock_threshold: number;
  expiry_date: string | null;
  discount: number | null;
  in_stock: boolean;
  barcode: string | null;
  created_at: string;
  updated_at: string;
}

export type InventoryInsert = Omit<InventoryItem, "id" | "in_stock" | "created_at" | "updated_at">;

export const useInventory = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    const { data, error } = await supabase
      .from("inventory")
      .select("*")
      .order("name", { ascending: true });
    if (error) {
      toast.error("Failed to load inventory");
    } else {
      setItems(data as InventoryItem[]);
    }
    setLoading(false);
  }, []);

  const addItem = async (item: InventoryInsert) => {
    const { error } = await supabase.from("inventory").insert(item);
    if (error) {
      toast.error(error.message);
      return false;
    }
    toast.success("Product added to inventory");
    return true;
  };

  const updateItem = async (id: string, updates: Partial<InventoryInsert>) => {
    const { error } = await supabase.from("inventory").update(updates).eq("id", id);
    if (error) {
      toast.error(error.message);
      return false;
    }
    toast.success("Product updated");
    return true;
  };

  const deleteItem = async (id: string) => {
    const { error } = await supabase.from("inventory").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return false;
    }
    toast.success("Product deleted");
    return true;
  };

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel("inventory-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "inventory" }, () => {
        fetchItems();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchItems]);

  const lowStockItems = items.filter(i => i.stock_quantity <= i.low_stock_threshold && i.stock_quantity > 0);
  const outOfStockItems = items.filter(i => i.stock_quantity === 0);
  const expiringItems = items.filter(i => {
    if (!i.expiry_date) return false;
    const diff = new Date(i.expiry_date).getTime() - Date.now();
    return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000;
  });

  return {
    items, loading, lowStockItems, outOfStockItems, expiringItems,
    addItem, updateItem, deleteItem, refetch: fetchItems,
  };
};
