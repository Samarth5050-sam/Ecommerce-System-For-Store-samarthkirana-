import { MapPin, Navigation, Phone, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { storeInfo } from "@/data/storeData";

const LocationMap = () => {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(storeInfo.fullAddress)}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(storeInfo.fullAddress)}`;
  
  return (
    <section className="py-12 bg-muted/30" id="location">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            📍 Visit Our Store
          </h2>
          <p className="text-muted-foreground">
            Find us easily with Google Maps
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Map Embed */}
          <div className="rounded-2xl overflow-hidden shadow-card h-[300px] md:h-[400px]">
            <iframe
              src={`https://maps.google.com/maps?q=${encodeURIComponent(storeInfo.fullAddress)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Store Location"
              className="grayscale-[20%] hover:grayscale-0 transition-all duration-300"
            />
          </div>

          {/* Store Info Card */}
          <div className="bg-card rounded-2xl p-6 shadow-card space-y-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl hero-gradient flex items-center justify-center flex-shrink-0">
                <MapPin className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground">{storeInfo.name}</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  {storeInfo.fullAddress}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Call us</p>
                  <a 
                    href={`tel:${storeInfo.contact}`} 
                    className="font-semibold text-foreground hover:text-primary transition-colors"
                  >
                    +91 {storeInfo.contact}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Store Hours</p>
                  <p className="font-semibold text-foreground">7:00 AM - 10:00 PM (All Days)</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border space-y-3">
              <Button 
                variant="hero" 
                className="w-full"
                onClick={() => window.open(directionsUrl, "_blank")}
              >
                <Navigation className="h-5 w-5 mr-2" />
                Get Directions
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.open(googleMapsUrl, "_blank")}
              >
                <ExternalLink className="h-5 w-5 mr-2" />
                Open in Google Maps
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationMap;
