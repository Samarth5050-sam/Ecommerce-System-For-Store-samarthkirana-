 import { format } from "date-fns";
 import { Package, X, Clock, CheckCircle, ShoppingBag } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
 import { Order } from "@/hooks/useOrders";
 import { Badge } from "@/components/ui/badge";
 import { ScrollArea } from "@/components/ui/scroll-area";
 
 interface OrderHistoryProps {
   isOpen: boolean;
   onClose: () => void;
   orders: Order[];
   loading: boolean;
 }
 
 const OrderHistory = ({ isOpen, onClose, orders, loading }: OrderHistoryProps) => {
   const getStatusIcon = (status: string) => {
     switch (status) {
       case "completed":
         return <CheckCircle className="h-4 w-4 text-secondary" />;
       case "pending":
         return <Clock className="h-4 w-4 text-accent" />;
       default:
         return <Package className="h-4 w-4 text-muted-foreground" />;
     }
   };
 
   const getStatusBadge = (status: string) => {
     switch (status) {
       case "completed":
         return <Badge variant="secondary" className="bg-secondary/10 text-secondary">Completed</Badge>;
       case "pending":
         return <Badge variant="outline" className="border-accent text-accent">Pending</Badge>;
       default:
         return <Badge variant="outline">{status}</Badge>;
     }
   };
 
   return (
     <Sheet open={isOpen} onOpenChange={onClose}>
       <SheetContent className="w-full sm:max-w-lg">
         <SheetHeader>
           <SheetTitle className="flex items-center gap-2">
             <Package className="h-5 w-5 text-primary" />
             Order History
           </SheetTitle>
         </SheetHeader>
 
         <ScrollArea className="h-[calc(100vh-100px)] mt-4">
           {loading ? (
             <div className="flex items-center justify-center py-12">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
             </div>
           ) : orders.length === 0 ? (
             <div className="text-center py-12">
               <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
               <h3 className="text-lg font-semibold text-foreground mb-2">No orders yet</h3>
               <p className="text-muted-foreground">
                 Your order history will appear here after your first purchase.
               </p>
             </div>
           ) : (
             <div className="space-y-4">
               {orders.map((order) => (
                 <div
                   key={order.id}
                   className="bg-muted/50 rounded-xl p-4 space-y-3"
                 >
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                       {getStatusIcon(order.status)}
                       <span className="text-sm font-medium">
                         {format(new Date(order.created_at), "MMM d, yyyy")}
                       </span>
                     </div>
                     {getStatusBadge(order.status)}
                   </div>
 
                   <div className="space-y-2">
                     {order.items.slice(0, 3).map((item, idx) => (
                       <div key={idx} className="flex items-center gap-3">
                         <img
                           src={item.image}
                           alt={item.name}
                           className="h-10 w-10 rounded-lg object-cover"
                         />
                         <div className="flex-1 min-w-0">
                           <p className="text-sm font-medium truncate">{item.name}</p>
                           <p className="text-xs text-muted-foreground">
                             Qty: {item.quantity} × ₹{item.price}
                           </p>
                         </div>
                       </div>
                     ))}
                     {order.items.length > 3 && (
                       <p className="text-xs text-muted-foreground">
                         +{order.items.length - 3} more items
                       </p>
                     )}
                   </div>
 
                   <div className="flex items-center justify-between pt-2 border-t border-border">
                     <span className="text-sm text-muted-foreground">Total</span>
                     <span className="text-lg font-bold text-primary">
                       ₹{order.total_amount.toFixed(0)}
                     </span>
                   </div>
                 </div>
               ))}
             </div>
           )}
         </ScrollArea>
       </SheetContent>
     </Sheet>
   );
 };
 
 export default OrderHistory;