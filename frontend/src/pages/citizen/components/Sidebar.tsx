import { LayoutGrid, FileText, Map, Settings, HelpCircle, LogOut, Users } from 'lucide-react';
import { api } from '../../../services/api';
import { useNavigate } from 'react-router';

interface SidebarProps {
  activeItem?: string;
  setActiveItem: (item: string) => void;
}

export function Sidebar({ activeItem = 'Dashboard', setActiveItem }: SidebarProps) {
  const navigate = useNavigate();
  const menuItems = [
    { icon: LayoutGrid, label: 'Dashboard' },
    { icon: Users, label: 'Community Reports' },
    { icon: FileText, label: 'Report Feed' },
    { icon: Map, label: 'Map View' },
    { icon: Settings, label: 'Settings' },
    { icon: HelpCircle, label: 'Support' },
  ];

  const handleLogout = () => {
    api.logout();
    navigate("/");
  };

  return (
    <div className="w-64 h-full bg-white/60 backdrop-blur-[20px] rounded-3xl p-6 border border-black/5 transform transition-all duration-700 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.08)] z-20 flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10 px-2 cursor-pointer transition-transform hover:scale-105" onClick={() => navigate('/')}>
        <div className="w-10 h-10 bg-gradient-to-br from-[#FF9933] to-[#E67E22] rounded-xl flex items-center justify-center shadow-[0_5px_15px_rgba(255,153,51,0.3)] relative group">
          <div className="absolute inset-0 bg-white/20 rounded-xl" style={{ backdropFilter: 'blur(5px)'}}></div>
          <svg className="w-6 h-6 text-white relative z-10" viewBox="0 0 24 24" fill="none">
            <path d="M9 11L12 14L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 12V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="text-[#1D1D1F] font-bold text-2xl tracking-wide bg-clip-text">SpotFix</span>
      </div>

      {/* Menu Items */}
      <nav className="space-y-3 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.label === activeItem;
          return (
            <button
              key={item.label}
              onClick={() => setActiveItem(item.label)}
              className={`
                w-full flex items-center gap-4 px-4 py-3.5 rounded-xl
                transition-all duration-300 relative overflow-hidden group
                ${isActive 
                  ? 'bg-[#FF9933]/10 text-[#FF9933] font-semibold border-l-4 border-[#FF9933]' 
                  : 'text-[#424245] hover:bg-black/5 hover:text-[#1D1D1F] border-l-4 border-transparent'
                }
              `}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'drop-shadow-[0_0_8px_rgba(255,153,51,0.4)]' : 'group-hover:text-[#FF9933]'} transition-all`} />
              <span className="text-[15px] whitespace-nowrap text-left">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Action */}
      <div className="mt-auto pt-6 border-t border-black/5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-300 border-l-4 border-transparent hover:border-red-500"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-[15px] font-medium">Logout</span>
        </button>
      </div>
    </div>

  );
}
