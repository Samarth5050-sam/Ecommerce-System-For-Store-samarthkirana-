import { useState } from "react";
import { Phone, MapPin, ShoppingCart, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { storeInfo } from "@/data/storeData";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "./AuthModal";
import UserMenu from "./UserMenu";

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
}

const Header = ({ cartCount, onCartClick }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, loading } = useAuth();

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

              {/* Auth button or User Menu */}
              {!loading && (
                user ? (
                  <UserMenu />
                ) : (
                  <Button
                    variant="outline"
                    className="hidden sm:flex items-center gap-2"
                    onClick={() => setIsAuthModalOpen(true)}
                  >
                    <User className="h-4 w-4" />
                    <span>Login</span>
                  </Button>
                )
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
                <button
                  onClick={() => {
                    setIsAuthModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 p-3 rounded-lg bg-primary text-primary-foreground w-full"
                >
                  <User className="h-4 w-4" />
                  <span>Login / Sign Up</span>
                </button>
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

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default Header;
