 import { useState, useEffect, useCallback } from "react";
 import { supabase } from "@/integrations/supabase/client";
 import { useAuth } from "@/contexts/AuthContext";
 import { toast } from "sonner";
 import { CartItem } from "@/types/store";
 
 export interface Order {
   id: string;
   user_id: string;
   items: CartItem[];
   total_amount: number;
   status: string;
   created_at: string;
   updated_at: string;
 }
 
 export const useOrders = () => {
   const { user } = useAuth();
   const [orders, setOrders] = useState<Order[]>([]);
   const [loading, setLoading] = useState(false);
 
   const fetchOrders = useCallback(async () => {
     if (!user) {
       setOrders([]);
       return;
     }
 
     setLoading(true);
     const { data, error } = await supabase
       .from("orders")
       .select("*")
       .eq("user_id", user.id)
       .order("created_at", { ascending: false });
 
     if (!error && data) {
       setOrders(data.map(order => ({
         ...order,
         items: order.items as unknown as CartItem[],
       })));
     }
     setLoading(false);
   }, [user]);
 
   useEffect(() => {
     fetchOrders();
   }, [fetchOrders]);
 
   const createOrder = async (items: CartItem[], totalAmount: number) => {
     if (!user) {
       toast.error("Please login to place an order");
       return null;
     }
 
    const orderData = {
      user_id: user.id,
      items: JSON.parse(JSON.stringify(items)),
      total_amount: totalAmount,
      status: "pending",
    };
 
    const { data, error } = await supabase
       .from("orders")
      .insert(orderData)
       .select()
       .single();
 
     if (error) {
       toast.error("Failed to create order");
       return null;
     }
 
     toast.success("Order placed successfully!");
     await fetchOrders();
     return data;
   };
 
   return {
     orders,
     loading,
     createOrder,
     refetch: fetchOrders,
   };
 };