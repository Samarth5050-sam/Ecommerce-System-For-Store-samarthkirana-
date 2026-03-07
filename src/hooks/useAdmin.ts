import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { CartItem } from "@/types/store";

export interface AdminOrder {
  id: string;
  user_id: string;
  items: CartItem[];
  total_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
  customer_name?: string;
  customer_phone?: string;
}

export interface Supplier {
  id: string;
  name: string;
  company: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  gst_number: string | null;
  products_supplied: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CustomerProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  created_at: string;
}

export const useAdmin = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const checkAdmin = useCallback(async () => {
    if (!user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();
    
    setIsAdmin(!!data);
    setLoading(false);
  }, [user]);

  const fetchOrders = useCallback(async () => {
    if (!isAdmin) return;
    const { data: ordersData } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (ordersData) {
      // Fetch profiles for customer names
      const userIds = [...new Set(ordersData.map(o => o.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .in("user_id", userIds);

      const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);

      setOrders(ordersData.map(order => ({
        ...order,
        items: order.items as unknown as CartItem[],
        customer_name: profileMap.get(order.user_id)?.full_name || "Unknown",
        customer_phone: profileMap.get(order.user_id)?.phone || "",
      })));
    }
  }, [isAdmin]);

  const fetchCustomers = useCallback(async () => {
    if (!isAdmin) return;
    const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    if (data) setCustomers(data);
  }, [isAdmin]);

  const fetchSuppliers = useCallback(async () => {
    if (!isAdmin) return;
    const { data } = await supabase.from("suppliers").select("*").order("created_at", { ascending: false });
    if (data) setSuppliers(data as Supplier[]);
  }, [isAdmin]);

  const addSupplier = async (supplier: Omit<Supplier, "id" | "created_at" | "updated_at">) => {
    const { error } = await supabase.from("suppliers").insert(supplier);
    if (!error) await fetchSuppliers();
    return { error };
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
    if (!error) await fetchOrders();
    return { error };
  };

  useEffect(() => { checkAdmin(); }, [checkAdmin]);
  useEffect(() => {
    if (isAdmin) {
      fetchOrders();
      fetchCustomers();
      fetchSuppliers();
    }
  }, [isAdmin, fetchOrders, fetchCustomers, fetchSuppliers]);

  return {
    isAdmin, loading, orders, customers, suppliers,
    addSupplier, updateOrderStatus,
    refetchOrders: fetchOrders, refetchCustomers: fetchCustomers, refetchSuppliers: fetchSuppliers,
  };
};
