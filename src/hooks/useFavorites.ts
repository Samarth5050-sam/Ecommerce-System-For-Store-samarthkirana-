 import { useState, useEffect, useCallback } from "react";
 import { supabase } from "@/integrations/supabase/client";
 import { useAuth } from "@/contexts/AuthContext";
 import { toast } from "sonner";
 
 export const useFavorites = () => {
   const { user } = useAuth();
   const [favorites, setFavorites] = useState<string[]>([]);
   const [loading, setLoading] = useState(false);
 
   const fetchFavorites = useCallback(async () => {
     if (!user) {
       setFavorites([]);
       return;
     }
 
     setLoading(true);
     const { data, error } = await supabase
       .from("favorites")
       .select("product_id")
       .eq("user_id", user.id);
 
     if (!error && data) {
       setFavorites(data.map((f) => f.product_id));
     }
     setLoading(false);
   }, [user]);
 
   useEffect(() => {
     fetchFavorites();
   }, [fetchFavorites]);
 
   const toggleFavorite = async (productId: string) => {
     if (!user) {
       toast.error("Please login to save favorites");
       return false;
     }
 
     const isFavorite = favorites.includes(productId);
 
     if (isFavorite) {
       const { error } = await supabase
         .from("favorites")
         .delete()
         .eq("user_id", user.id)
         .eq("product_id", productId);
 
       if (!error) {
         setFavorites((prev) => prev.filter((id) => id !== productId));
         toast.success("Removed from favorites");
         return true;
       }
     } else {
       const { error } = await supabase
         .from("favorites")
         .insert({ user_id: user.id, product_id: productId });
 
       if (!error) {
         setFavorites((prev) => [...prev, productId]);
         toast.success("Added to favorites");
         return true;
       }
     }
 
     toast.error("Failed to update favorites");
     return false;
   };
 
   const isFavorite = (productId: string) => favorites.includes(productId);
 
   return {
     favorites,
     loading,
     toggleFavorite,
     isFavorite,
     refetch: fetchFavorites,
   };
 };