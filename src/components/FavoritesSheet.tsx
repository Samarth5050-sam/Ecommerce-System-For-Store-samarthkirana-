 import { Heart, X, ShoppingBag } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
 import { ScrollArea } from "@/components/ui/scroll-area";
 import { Product } from "@/types/store";
 import { products } from "@/data/storeData";
 
 interface FavoritesSheetProps {
   isOpen: boolean;
   onClose: () => void;
   favorites: string[];
   onToggleFavorite: (productId: string) => void;
   onAddToCart: (product: Product) => void;
 }
 
 const FavoritesSheet = ({
   isOpen,
   onClose,
   favorites,
   onToggleFavorite,
   onAddToCart,
 }: FavoritesSheetProps) => {
   const favoriteProducts = products.filter((p) => favorites.includes(p.id));
 
   return (
     <Sheet open={isOpen} onOpenChange={onClose}>
       <SheetContent className="w-full sm:max-w-lg">
         <SheetHeader>
           <SheetTitle className="flex items-center gap-2">
             <Heart className="h-5 w-5 text-destructive" />
             My Favorites
           </SheetTitle>
         </SheetHeader>
 
         <ScrollArea className="h-[calc(100vh-100px)] mt-4">
           {favoriteProducts.length === 0 ? (
             <div className="text-center py-12">
               <Heart className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
               <h3 className="text-lg font-semibold text-foreground mb-2">No favorites yet</h3>
               <p className="text-muted-foreground">
                 Tap the heart icon on products you love to save them here.
               </p>
             </div>
           ) : (
             <div className="space-y-3">
               {favoriteProducts.map((product) => {
                 const discountedPrice = product.discount
                   ? product.price * (1 - product.discount / 100)
                   : product.price;
 
                 return (
                   <div
                     key={product.id}
                     className="flex items-center gap-4 p-3 bg-muted/50 rounded-xl"
                   >
                     <img
                       src={product.image}
                       alt={product.name}
                       className="h-16 w-16 rounded-lg object-cover"
                     />
                     <div className="flex-1 min-w-0">
                       <h4 className="font-medium text-foreground truncate">{product.name}</h4>
                       <p className="text-xs text-muted-foreground">{product.unit}</p>
                       <div className="flex items-baseline gap-2 mt-1">
                         <span className="text-sm font-bold text-primary">
                           ₹{discountedPrice.toFixed(0)}
                         </span>
                         {product.discount && (
                           <span className="text-xs text-muted-foreground line-through">
                             ₹{product.price}
                           </span>
                         )}
                       </div>
                     </div>
                     <div className="flex flex-col gap-2">
                       <Button
                         variant="ghost"
                         size="icon"
                         className="h-8 w-8 text-destructive hover:text-destructive"
                         onClick={() => onToggleFavorite(product.id)}
                       >
                         <Heart className="h-4 w-4 fill-current" />
                       </Button>
                       {product.inStock && (
                         <Button
                           variant="outline"
                           size="icon"
                           className="h-8 w-8"
                           onClick={() => onAddToCart(product)}
                         >
                           <ShoppingBag className="h-4 w-4" />
                         </Button>
                       )}
                     </div>
                   </div>
                 );
               })}
             </div>
           )}
         </ScrollArea>
       </SheetContent>
     </Sheet>
   );
 };
 
 export default FavoritesSheet;