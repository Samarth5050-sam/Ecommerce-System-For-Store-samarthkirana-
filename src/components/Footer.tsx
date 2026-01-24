import { Phone, MapPin, Clock, Heart, MessageCircle, Navigation } from "lucide-react";
import { storeInfo } from "@/data/storeData";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const handleWhatsAppContact = () => {
    const message = `Hi! I want to know more about ${storeInfo.name}.`;
    window.open(`https://wa.me/${storeInfo.whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const handleDirections = () => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(storeInfo.fullAddress)}`, "_blank");
  };

  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Store Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-14 w-14 rounded-xl bg-primary flex items-center justify-center text-3xl">
                🏪
              </div>
              <div>
                <h3 className="font-bold text-xl">{storeInfo.name}</h3>
                <p className="text-sm text-background/70">Est. 2014 | {storeInfo.address}</p>
              </div>
            </div>
            <p className="text-background/80 text-sm mb-4 max-w-md">
              Your trusted neighborhood Kirana store, serving quality groceries at affordable prices. 
              We deliver fresh products daily and offer the best rates in the area.
            </p>
            <div className="flex gap-3">
              <Button 
                variant="hero" 
                size="sm"
                onClick={handleWhatsAppContact}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="border-background/30 text-background hover:bg-background/10"
                onClick={handleDirections}
              >
                <Navigation className="h-4 w-4 mr-2" />
                Directions
              </Button>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-4">Contact Us</h4>
            <div className="space-y-3">
              <a 
                href={`tel:${storeInfo.contact}`}
                className="flex items-center gap-3 text-background/80 hover:text-background transition-colors"
              >
                <Phone className="h-5 w-5 text-primary" />
                <span>+91 {storeInfo.contact}</span>
              </a>
              <div className="flex items-start gap-3 text-background/80">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">{storeInfo.fullAddress}</span>
              </div>
              <div className="flex items-center gap-3 text-background/80">
                <Clock className="h-5 w-5 text-primary" />
                <span>Open: 7 AM - 10 PM (All Days)</span>
              </div>
            </div>
          </div>

          {/* Owner */}
          <div>
            <h4 className="font-bold text-lg mb-4">Store Owner</h4>
            <div className="bg-background/10 rounded-xl p-4">
              <p className="font-semibold text-lg">{storeInfo.owner}</p>
              <p className="text-sm text-background/70 mt-1">Proprietor</p>
              <p className="text-sm text-background/80 mt-3 italic">
                "We believe in providing quality products and building lasting relationships with our customers."
              </p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="border-t border-background/20 pt-6 mb-6">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-background/70">
            <a href="#products" className="hover:text-background transition-colors">Products</a>
            <a href="#location" className="hover:text-background transition-colors">Location</a>
            <a href={`tel:${storeInfo.contact}`} className="hover:text-background transition-colors">Call Us</a>
            <span className="cursor-pointer hover:text-background transition-colors" onClick={handleWhatsAppContact}>WhatsApp Order</span>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-background/20 pt-6 text-center">
          <p className="text-sm text-background/70 flex items-center justify-center gap-1">
            Made with <Heart className="h-4 w-4 text-accent fill-accent" /> for {storeInfo.name}
          </p>
          <p className="text-xs text-background/50 mt-2">
            © {new Date().getFullYear()} All rights reserved | Bavachi, Maharashtra
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
