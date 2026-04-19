import React, { useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import { MapPin, Loader2 } from "lucide-react";

// Fix for default marker icons
const icon = new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href;
const iconShadow = new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href;

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface LocationPickerProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
  defaultLocation?: { lat: number; lng: number };
}

function LocationMarker({ position }: { position: L.LatLng | null }) {
  // Removed click-to-set functionality to enforce strict GPS tracking
  return position === null ? null : (
    <Marker position={position} />
  );
}

// Component to handle geolocation and setting initial center
function MapController({ center }: { center: L.LatLngExpression }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export function LocationPickerMap({ onLocationSelect, defaultLocation }: LocationPickerProps) {
  // Default to Kharghar, Navi Mumbai if no default provided
  const initialCenter = defaultLocation 
    ? new L.LatLng(defaultLocation.lat, defaultLocation.lng) 
    : new L.LatLng(19.0330, 73.0297);

  const [position, setPosition] = useState<L.LatLng | null>(defaultLocation ? initialCenter : null);
  const [center, setCenter] = useState<L.LatLng>(initialCenter);
  const [address, setAddress] = useState<string>("");
  const [isGeocoding, setIsGeocoding] = useState(false);

  const [isLocating, setIsLocating] = useState(false);

  const fetchExactLocation = useCallback(() => {
    if (!navigator.geolocation) {
      console.warn("Geolocation is not supported by this browser.");
      return;
    }
    
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newCenter = new L.LatLng(pos.coords.latitude, pos.coords.longitude);
        setCenter(newCenter);
        setPosition(newCenter);
        setIsLocating(false);
      },
      (err) => {
        console.warn("Geolocation failed or denied", err);
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }, []);

  // Try to get user's current location on mount
  useEffect(() => {
    if (!defaultLocation) {
      fetchExactLocation();
    }
  }, [defaultLocation, fetchExactLocation]);

  // Reverse geocode when position changes
  useEffect(() => {
    if (!position) return;

    const fetchAddress = async () => {
      setIsGeocoding(true);
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}&zoom=18&addressdetails=1`);
        const data = await res.json();
        const fullAddress = data.display_name || `${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}`;
        
        // Make it a bit cleaner
        const cleanAddress = data.address 
          ? [data.address.road, data.address.suburb, data.address.city].filter(Boolean).join(", ") || fullAddress
          : fullAddress;

        setAddress(cleanAddress);
        onLocationSelect({
          lat: position.lat,
          lng: position.lng,
          address: cleanAddress,
        });
      } catch (error) {
        console.error("Geocoding error:", error);
        const fallbackAddress = `${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}`;
        setAddress(fallbackAddress);
        onLocationSelect({
          lat: position.lat,
          lng: position.lng,
          address: fallbackAddress,
        });
      } finally {
        setIsGeocoding(false);
      }
    };

    // Debounce to prevent API spam while dragging/clicking rapidly
    const timeoutId = setTimeout(fetchAddress, 500);
    return () => clearTimeout(timeoutId);
  }, [position, onLocationSelect]);

  return (
    <div className="space-y-3">
      <div className="h-64 w-full rounded-2xl border border-card-border overflow-hidden relative z-0 shadow-inner">
        <MapContainer 
          center={center} 
          zoom={15} 
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
          dragging={false} // Disable dragging to emphasize it's a fixed location
          scrollWheelZoom={false}
        >
          <MapController center={center} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker position={position} />
        </MapContainer>
        
        {/* Loading Overlay */}
        {isLocating && (
          <div className="absolute inset-0 z-[400] flex flex-col items-center justify-center bg-black/40 backdrop-blur-md">
            <Loader2 className="h-10 w-10 text-white animate-spin mb-3" />
            <p className="text-white font-black tracking-widest text-sm uppercase shadow-sm">Tracking Signal...</p>
          </div>
        )}

        {/* Floating Action Button for Location */}
        <button
          type="button"
          onClick={fetchExactLocation}
          className="absolute bottom-4 right-4 z-[400] bg-white text-accent shadow-xl px-4 py-2 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-accent/10 transition-colors border border-accent/20 active:scale-95"
        >
          <MapPin className="h-4 w-4" />
          {position ? "Update Fix" : "Establish Link"}
        </button>
      </div>

      <div className="bg-card-bg/50 backdrop-blur-sm rounded-2xl p-4 border border-card-border text-sm flex items-start gap-3 shadow-sm">
        <MapPin className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <div className="font-black text-text-primary text-[10px] uppercase tracking-widest">Geolocation Lock</div>
          {isGeocoding ? (
            <div className="flex items-center gap-2 text-text-secondary mt-1 font-medium text-sm">
              <Loader2 className="h-3 w-3 animate-spin" /> Resolving Coordinates...
            </div>
          ) : (
            <div className="text-text-secondary mt-1 font-medium text-sm">
              {address || "Awaiting GPS Signal..."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
