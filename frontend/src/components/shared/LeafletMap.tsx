import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Issue } from '../../types';

interface LeafletMapProps {
  issues?: Issue[];
  center?: [number, number];
  zoom?: number;
  singleIssueMode?: boolean;
}

export function LeafletMap({ issues = [], center, zoom, singleIssueMode = false }: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Default center for Mumbai/Navi Mumbai
    const defaultCenter: [number, number] = [19.0760, 73.0200];
    const initialCenter = center || defaultCenter;
    const initialZoom = zoom || (singleIssueMode ? 16 : 11);

    const map = L.map(mapRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
    }).addTo(map);

    if (!singleIssueMode && !center) {
      const bounds = L.latLngBounds(
        [18.8920, 72.7757], // Southwest (Mumbai)
        [19.2700, 73.1500]  // Northeast (Navi Mumbai)
      );
      map.fitBounds(bounds);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [center, zoom, singleIssueMode]);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    
    issues.forEach(issue => {
      if (issue.location && issue.location.lat && issue.location.lng) {
        const marker = L.marker([issue.location.lat, issue.location.lng])
          .addTo(mapInstanceRef.current!)
          .bindPopup(`
            <div class="p-2 min-w-[150px]">
              <h4 class="font-black uppercase text-xs tracking-tight mb-1">${issue.title}</h4>
              <p class="text-[10px] text-gray-500 uppercase tracking-widest mb-2">${issue.category}</p>
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter text-white" style="background-color: ${
                  issue.status === 'resolved' ? '#138808' : issue.status === 'in_progress' ? '#FF9933' : '#333'
                }">
                  ${issue.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          `);
        markersRef.current.push(marker);
      }
    });

    // If single issue mode and we have issues, pan to the first one
    if (singleIssueMode && issues.length > 0) {
      const issue = issues[0];
      if (issue.location) {
        mapInstanceRef.current.setView([issue.location.lat, issue.location.lng], zoom || 16);
      }
    }
  }, [issues, singleIssueMode, zoom]);

  return (
    <div className="w-full h-full rounded-3xl overflow-hidden relative shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] hover:shadow-[0_45px_70px_-10px_rgba(0,0,0,0.12)] transition-all duration-700 ease-in-out border border-black/5">
      <div ref={mapRef} className="w-full h-full z-0 relative" />
      {!singleIssueMode && (
        <div className="absolute bottom-4 right-4 text-[#1D1D1F] text-2xl font-bold opacity-10 pointer-events-none z-[400]">
          Precision Map Node
        </div>
      )}
    </div>
  );
}
