import { useEffect, useState } from "react";
import { Trophy, Medal, Star, Flame, Loader2 } from "lucide-react";
import { api } from "../../../services/api";

interface LeaderboardUser {
  _id: string;
  name: string;
  karma: number;
}

export function Leaderboard() {
  const [topUsers, setTopUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await api.getLeaderboard();
        setTopUsers(data);
      } catch (err) {
        console.error("Leaderboard fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <h3 className="text-sm font-black uppercase tracking-widest text-text-primary">Civic Champions</h3>
        </div>
        <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest bg-black/5 px-2 py-1 rounded-md">Top 10</span>
      </div>

      <div className="space-y-2">
        {topUsers.map((user, index) => (
          <div 
            key={user._id}
            className={`flex items-center justify-between p-3 rounded-2xl border transition-all hover:scale-[1.02] ${
              index === 0 ? "bg-yellow-500/10 border-yellow-500/20 shadow-sm" : 
              index === 1 ? "bg-slate-400/10 border-slate-400/20" :
              index === 2 ? "bg-amber-600/10 border-amber-600/20" :
              "bg-black/5 border-transparent"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 flex items-center justify-center">
                {index === 0 ? <Medal className="w-6 h-6 text-yellow-500" /> :
                 index === 1 ? <Medal className="w-6 h-6 text-slate-400" /> :
                 index === 2 ? <Medal className="w-6 h-6 text-amber-600" /> :
                 <span className="text-xs font-black text-text-secondary">#{index + 1}</span>}
              </div>
              <div>
                <p className="text-sm font-black text-text-primary capitalize">{user.name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                   <Star className="w-3 h-3 text-accent fill-current" />
                   <span className="text-[10px] font-bold text-text-secondary uppercase tracking-tighter">Verified Citizen</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/50 backdrop-blur-sm rounded-lg border border-white/80 shadow-sm">
                <Flame className="w-3.5 h-3.5 text-orange-500 fill-current" />
                <span className="text-sm font-black text-text-primary">{user.karma}</span>
              </div>
              <span className="text-[8px] font-black uppercase tracking-widest text-text-secondary/50 mt-1">Karma Points</span>
            </div>
          </div>
        ))}

        {topUsers.length === 0 && (
          <div className="py-8 text-center bg-black/5 rounded-3xl border border-dashed border-card-border">
            <p className="text-xs text-text-secondary font-bold">No active champions yet.</p>
            <p className="text-[10px] text-text-secondary/60 mt-1">Be the first to report and lead!</p>
          </div>
        )}
      </div>
    </div>
  );
}
