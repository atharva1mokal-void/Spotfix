import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Issue } from '../../../types';

interface LeafletMapProps {
  issues?: Issue[];
}

export function LeafletMap({ issues = [] }: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const center: [number, number] = [19.0760, 73.0200];

    const map = L.map(mapRef.current, {
      center: center,
      zoom: 11,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
    }).addTo(map);

    const bounds = L.latLngBounds(
      [18.8920, 72.7757], // Southwest (Mumbai)
      [19.2700, 73.1500]  // Northeast (Navi Mumbai)
    );
    map.fitBounds(bounds);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !issues.length) return;
    
    // Clear existing markers approach omitted for simplicity,
    // assuming they just render once. For production, keep a ref array.
    issues.forEach(issue => {
      if (issue.location && issue.location.lat && issue.location.lng) {
        L.marker([issue.location.lat, issue.location.lng])
          .addTo(mapInstanceRef.current!)
          .bindPopup(`<b>${issue.title}</b><br>${issue.category}`);
      }
    });
  }, [issues]);

  return (
    <div className="w-full h-full rounded-3xl overflow-hidden relative shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] hover:shadow-[0_45px_70px_-10px_rgba(0,0,0,0.12)] transition-all duration-700 ease-in-out transform hover:-translate-y-2 border border-black/5">
      <div ref={mapRef} className="w-full h-full z-0 relative" />
      <div className="absolute bottom-4 right-4 text-[#1D1D1F] text-2xl font-bold opacity-10 pointer-events-none z-[400]">
        Mumbai & Navi Mumbai
      </div>
    </div>

  );
}
