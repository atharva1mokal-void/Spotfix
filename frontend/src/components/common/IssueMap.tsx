import React, { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { type Issue, User as UserType } from "../../types";
import { Link } from "react-router";
import { categoryConfig, statusConfig } from "../../lib/constants";
import { api } from "../../services/api";
import { toast } from "sonner";
import { Heart, Flame, Layers, Loader2 } from "lucide-react";
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
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

// Helper component to auto-center the map around all markers or user location
function MapBoundsUpdater({ issues, userLocation }: { issues: Issue[], userLocation: [number, number] | null }) {
  const map = useMap();
  const userInitRef = React.useRef(false);
  const issuesInitRef = React.useRef(false);

  useEffect(() => {
    if (userLocation && !userInitRef.current) {
      map.setView(userLocation, 14, { animate: true });
      userInitRef.current = true;
      return;
    }

    if (!userLocation && issues.length > 0 && !issuesInitRef.current && !userInitRef.current) {
      const validIssues = issues.filter(i => i.location?.lat && i.location?.lng);
      if (validIssues.length === 0) return;

      if (validIssues.length === 1) {
        map.setView([validIssues[0].location.lat, validIssues[0].location.lng], 15);
      } else {
        const bounds = L.latLngBounds(
          validIssues.map(i => [i.location.lat, i.location.lng])
        );
        map.fitBounds(bounds, { padding: [50, 50] });
      }
      issuesInitRef.current = true;
    }
  }, [issues, map, userLocation]);

  return null;
}

interface IssueMapProps {
  issues: Issue[];
  className?: string;
  defaultCenter?: [number, number];
  currentUserId?: string;
  onMarkerClick?: (issue: Issue) => void;
}

// Internal helper to handle map size invalidation on mount/resize
function MapInvalidator() {
  const map = useMap();
  useEffect(() => {
    // Small timeout to ensure the DOM has settled
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 100);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

// Internal helper for Heatmap
function HeatLayer({ issues }: { issues: Issue[] }) {
  const map = useMap();

  useEffect(() => {
    // @ts-ignore - L.heatLayer comes from CDN
    if (!L.heatLayer) return;

    const points = issues
      .filter(i => i.location && i.location.lat)
      .map(i => [i.location.lat, i.location.lng, 0.5]); // lat, lng, intensity

    // @ts-ignore
    const heat = L.heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
      gradient: { 0.4: 'blue', 0.6: 'cyan', 0.7: 'lime', 0.8: 'yellow', 1: 'red' }
    }).addTo(map);

    return () => {
      map.removeLayer(heat);
    };
  }, [map, issues]);

  return null;
}

export const IssueMap = React.memo(function IssueMap({ issues, className = "h-64 w-full rounded-lg z-0", defaultCenter = [19.0330, 73.0297], currentUserId, onMarkerClick }: IssueMapProps) {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [localIssues, setLocalIssues] = useState<Issue[]>(issues);
  const [upvotingId, setUpvotingId] = useState<string | null>(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAuthority = user.userType === 'authority' || user.userType === 'admin';

  useEffect(() => {
    setLocalIssues(issues);
  }, [issues]);

  const handleUpvote = async (e: React.MouseEvent, issueId: string) => {
    e.stopPropagation();
    if (upvotingId) return;
    setUpvotingId(issueId);
    try {
      const updated = await api.upvoteIssue(issueId);
      setLocalIssues(prev => prev.map(i => i.id === updated.id ? updated : i));
      toast.success("Issue supported!", { description: "Authorities have been notified." });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUpvotingId(null);
    }
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error("Error getting location:", error);
        },
        { maximumAge: 60000 } // cache location for 1 min — avoids repeated OS prompts
      );
    }
  }, []); // empty dep array is correct: only fetch once

  // Memoize the user location icon so it’s not re-created on every render
  const userLocationIcon = useMemo(() => L.divIcon({
    className: "user-location-marker",
    html: `<div style="background-color: #2563eb; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(37,99,235,0.5);"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  }), []);

  // Memoize all per-issue icons keyed to stable fields — avoids new object refs on every render
  const issueIcons = useMemo(() => {
    const map: Record<string, L.DivIcon> = {};
    issues.forEach(issue => {
      if (!issue.location?.lat || !issue.location?.lng) return;
      const catConfig = categoryConfig[issue.category as keyof typeof categoryConfig] as any;
      const isMine = currentUserId && (typeof issue.reportedBy === 'string' ? issue.reportedBy === currentUserId : (issue as any).reportedBy?._id === currentUserId || (issue as any).reportedBy?.id === currentUserId);
      const opacity = isMine ? "1" : "0.6";
      const borderStyle = isMine ? "border: 2px solid white;" : "border: 2px dashed white;";
      const size = isMine ? '34px' : '28px';
      const fontSize = isMine ? '18px' : '14px';
      map[issue.id] = L.divIcon({
        className: "custom-issue-marker",
        html: `
          <div style="
            background-color: ${catConfig?.color || '#3b82f6'};
            opacity: ${opacity};
            width: ${size};
            height: ${size};
            border-radius: 50%;
            ${borderStyle}
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: ${fontSize};
            position: relative;
            top: -15px;
            left: -15px;
          ">
            ${catConfig?.emoji || '\uD83D\uDCCD'}
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [0, 0],
      });
    });
    return map;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [issues, currentUserId]);

  const center = userLocation || (issues.length === 1 && issues[0].location?.lat 
    ? [issues[0].location.lat, issues[0].location.lng] as [number, number]
    : defaultCenter);

  return (
    <div className={className} style={{ position: "relative", zIndex: 0 }}>
      <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%", borderRadius: "inherit" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapInvalidator />
        <MapBoundsUpdater issues={localIssues} userLocation={userLocation} />
        {showHeatmap && <HeatLayer issues={localIssues} />}
        
        {/* User Location Marker */}
        {userLocation && (
          <Marker 
            position={userLocation} 
            icon={userLocationIcon}
          >
            <Popup>You are here</Popup>
          </Marker>
        )}

        {localIssues.map(issue => {
          if (!issue.location?.lat || !issue.location?.lng) return null;
          
          const statConfig = (statusConfig as any)[issue.status] as { label: string; color: string } | undefined;
          const catConfig = categoryConfig[issue.category as keyof typeof categoryConfig] as any;
          const customIcon = issueIcons[issue.id];
          if (!customIcon) return null;
          
          const hasUpvoted = issue.upvotedBy?.includes(user.id || user._id);
          
          return (
            <Marker 
              key={issue.id} 
              position={[issue.location.lat, issue.location.lng]} 
              icon={customIcon}
              eventHandlers={{
                click: () => {
                  if (onMarkerClick) onMarkerClick(issue);
                }
              }}
            >
              <Popup className="custom-popup">
                <div className="p-1 min-w-[200px]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-accent bg-accent/5 px-2 py-0.5 rounded border border-accent/10">
                      {catConfig?.label}
                    </span>
                    <span className="text-[9px] font-bold text-text-secondary">
                      {new Date(issue.reportedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-text-primary uppercase mb-1 leading-tight truncate">{issue.title}</h3>
                  <p className="text-[11px] text-text-secondary line-clamp-2 mb-3 leading-relaxed">{issue.description}</p>
                  
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-card-border/50">
                    <button 
                      onClick={(e) => handleUpvote(e, issue.id)}
                      disabled={!!upvotingId}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                        hasUpvoted ? "bg-red-500 text-white" : "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                      }`}
                    >
                      {upvotingId === issue.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Heart className={`w-3 h-3 ${hasUpvoted ? "fill-current" : ""}`} />}
                      {issue.upvotedBy?.length || 0}
                    </button>
                    <Link 
                      to={`/issues/${issue.id}`}
                      className="flex-[1.5] text-center py-1.5 bg-black text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-black/80 transition-all"
                    >
                      View Logs
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        {isAuthority && (
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`p-3 rounded-2xl border backdrop-blur-md shadow-lg transition-all ${
              showHeatmap ? "bg-accent text-white border-accent" : "bg-white/90 text-text-primary border-card-border hover:bg-white"
            }`}
            title="Toggle Issue Heatmap"
          >
            <Layers className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
});
