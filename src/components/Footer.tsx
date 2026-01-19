import { Phone, MapPin, Clock, Heart } from "lucide-react";
import { storeInfo } from "@/data/storeData";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Store Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center text-2xl">
                🏪
              </div>
              <div>
                <h3 className="font-bold text-lg">{storeInfo.name}</h3>
                <p className="text-sm text-background/70">{storeInfo.address}</p>
              </div>
            </div>
            <p className="text-background/80 text-sm">
              Your trusted neighborhood Kirana store, serving quality groceries at affordable prices.
            </p>
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
                <span>{storeInfo.contact}</span>
              </a>
              <div className="flex items-center gap-3 text-background/80">
                <MapPin className="h-5 w-5 text-primary" />
                <span>{storeInfo.address}</span>
              </div>
              <div className="flex items-center gap-3 text-background/80">
                <Clock className="h-5 w-5 text-primary" />
                <span>Open: 7 AM - 10 PM</span>
              </div>
            </div>
          </div>

          {/* Owner */}
          <div>
            <h4 className="font-bold text-lg mb-4">Store Owner</h4>
            <div className="bg-background/10 rounded-xl p-4">
              <p className="font-semibold text-lg">{storeInfo.owner}</p>
              <p className="text-sm text-background/70 mt-1">Proprietor</p>
              <p className="text-sm text-background/80 mt-3">
                "We believe in providing quality products and building lasting relationships with our customers."
              </p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-background/20 pt-6 text-center">
          <p className="text-sm text-background/70 flex items-center justify-center gap-1">
            Made with <Heart className="h-4 w-4 text-accent fill-accent" /> for {storeInfo.name}
          </p>
          <p className="text-xs text-background/50 mt-2">
            © {new Date().getFullYear()} All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
