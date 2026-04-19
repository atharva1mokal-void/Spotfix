import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Issue } from '../../types';

interface AdminLeafletMapProps {
  issues: Issue[];
}

export function AdminLeafletMap({ issues }: AdminLeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const center: [number, number] = [19.0760, 73.0200];

    const map = L.map(mapContainerRef.current, {
      center: center,
      zoom: 12,
      zoomControl: false, 
      scrollWheelZoom: true,
      fadeAnimation: true,
    });

    mapInstanceRef.current = map;

    // Light tiles for Ethnic White theme
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
    }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    issues.forEach(issue => {
      if (issue.location && issue.location.lat && issue.location.lng) {
        const priorityColor = 
          issue.priority === 'high' ? 'var(--saffron)' : 
          issue.priority === 'medium' ? 'var(--turmeric)' : 
          'var(--green)';

        const customIcon = L.divIcon({
          className: 'ethnic-pin-container',
          html: `
            <div class="relative flex items-center justify-center">
              <div class="ethnic-pin" style="background: ${priorityColor}; border: 2px solid white; box-shadow: 0 4px 10px ${priorityColor}40;"></div>
            </div>
          `,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });

        const marker = L.marker([issue.location.lat, issue.location.lng], { icon: customIcon })
          .bindPopup(`
            <div class="ethnic-popup p-3">
              <h4 class="font-bold text-gray-900 border-b border-gray-100 pb-1 mb-2">${issue.title}</h4>
              <p class="text-xs text-gray-600 mb-2 leading-relaxed">${issue.description}</p>
              <div class="flex items-center gap-2">
                <span class="text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter" style="background: ${priorityColor}15; color: ${priorityColor}">${issue.priority}</span>
                <span class="text-[9px] text-gray-400 font-bold uppercase tracking-widest">${issue.category}</span>
              </div>
            </div>
          `);
        
        markersLayerRef.current!.addLayer(marker);
      }
    });

    if (issues.length > 0) {
      const group = new L.FeatureGroup(markersLayerRef.current.getLayers());
      if (group.getLayers().length > 0) {
        mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
      }
    }
  }, [issues]);

  return (
    <div className="w-full h-full relative group shadow-sm bg-white">
      <div ref={mapContainerRef} className="w-full h-full z-0 border border-gray-100 rounded-2xl" />
      
      <div className="absolute top-4 left-4 z-[400] flex flex-col gap-2 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-md px-4 py-2 flex items-center gap-2 border border-gray-100 rounded-xl shadow-sm">
          <div className="w-2 h-2 rounded-full bg-saffron animate-pulse" />
          <span className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-600">Dynamic Asset Map</span>
        </div>
      </div>

      <style>{`
        .leaflet-container {
          background: #fdfcfb !important;
        }
        .leaflet-popup-content-wrapper {
          background: white;
          border-radius: 16px;
          border: 1px solid rgba(255,153,51,0.1);
          padding: 0;
          box-shadow: 0 10px 30px -10px rgba(0,0,0,0.15);
        }
        .leaflet-popup-tip {
          background: white;
        }
        .ethnic-pin {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .ethnic-pin-container:hover .ethnic-pin {
          transform: scale(1.4);
        }
      `}</style>
    </div>
  );
}
