import { useState } from "react";
import { Phone, MapPin, ShoppingCart, Menu, User, LogIn, Heart, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { storeInfo } from "@/data/storeData";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "./AuthModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
  onFavoritesClick?: () => void;
  onOrdersClick?: () => void;
  favoritesCount?: number;
}

const Header = ({ 
  cartCount, 
  onCartClick, 
  onFavoritesClick, 
  onOrdersClick,
  favoritesCount = 0,
}: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, profile, signOut } = useAuth();

  return (
    <>
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container mx-auto px-4">
          {/* Top bar with contact info */}
          <div className="hidden md:flex items-center justify-between py-2 text-sm border-b border-border/50">
            <div className="flex items-center gap-6">
              <a 
                href={`tel:${storeInfo.contact}`} 
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>{storeInfo.contact}</span>
              </a>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{storeInfo.address}</span>
              </div>
            </div>
            <p className="text-muted-foreground">
              Owner: <span className="font-medium text-foreground">{storeInfo.owner}</span>
            </p>
          </div>

          {/* Main header */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl hero-gradient flex items-center justify-center text-2xl shadow-md">
                🏪
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-foreground leading-tight">
                  {storeInfo.name}
                </h1>
                <p className="text-xs md:text-sm text-muted-foreground">{storeInfo.address}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile contact */}
              <a 
                href={`tel:${storeInfo.contact}`} 
                className="md:hidden p-2 rounded-lg bg-muted hover:bg-primary/10 transition-colors"
              >
                <Phone className="h-5 w-5 text-primary" />
              </a>

              {/* Favorites button */}
              {user && onFavoritesClick && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hidden sm:flex"
                  onClick={onFavoritesClick}
                >
                  <Heart className="h-5 w-5" />
                  {favoritesCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-xs font-bold flex items-center justify-center">
                      {favoritesCount}
                    </span>
                  )}
                </Button>
              )}

              {/* Cart button */}
              <Button 
                variant="cart" 
                size="default" 
                className="relative"
                onClick={onCartClick}
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="hidden sm:inline ml-2">Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center animate-scale-in">
                    {cartCount}
                  </span>
                )}
              </Button>

              {/* User Account */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{profile?.full_name || "User"}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    {onFavoritesClick && (
                      <DropdownMenuItem onClick={onFavoritesClick}>
                        <Heart className="h-4 w-4 mr-2" />
                        My Favorites
                      </DropdownMenuItem>
                    )}
                    {onOrdersClick && (
                      <DropdownMenuItem onClick={onOrdersClick}>
                        <Package className="h-4 w-4 mr-2" />
                        Order History
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut} className="text-destructive">
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="hidden sm:flex"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
              )}

              {/* Mobile menu */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Mobile dropdown menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-2 animate-slide-up">
              {!user && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    setIsAuthModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Login / Sign Up
                </Button>
              )}
              {user && onFavoritesClick && (
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    onFavoritesClick();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  My Favorites ({favoritesCount})
                </Button>
              )}
              {user && onOrdersClick && (
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    onOrdersClick();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <Package className="h-4 w-4 mr-2" />
                  Order History
                </Button>
              )}
              <a 
                href={`tel:${storeInfo.contact}`} 
                className="flex items-center gap-2 p-3 rounded-lg bg-muted text-foreground"
              >
                <Phone className="h-4 w-4 text-primary" />
                <span>Call: {storeInfo.contact}</span>
              </a>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted text-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Address: {storeInfo.address}</span>
              </div>
            </div>
          )}
        </div>
      </header>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
};

export default Header;
