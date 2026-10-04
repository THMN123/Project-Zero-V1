import React from 'react';
import { 
  Building2, 
  Calendar, 
  Compass, 
  Layers, 
  MoreHorizontal,
  LucideIcon
} from 'lucide-react';

interface BottomPillNavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pendingRequestsCount: number;
  undoCount: number;
}

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: number | string;
}

export const BottomPillNavbar: React.FC<BottomPillNavbarProps> = ({
  activeTab,
  setActiveTab,
  pendingRequestsCount,
  undoCount
}) => {
  const items: NavItem[] = [
    { 
      id: 'resources', 
      label: 'Facilities', 
      icon: Building2,
      badge: undoCount > 0 ? '↺' : undefined
    },
    { 
      id: 'timetable', 
      label: 'Schedule', 
      icon: Calendar 
    },
    { 
      id: 'navigation', 
      label: 'Campus Map', 
      icon: Compass 
    },
    { 
      id: 'requests', 
      label: 'Requests', 
      icon: Layers,
      badge: pendingRequestsCount > 0 ? pendingRequestsCount : undefined
    },
    { 
      id: 'more', 
      label: 'More', 
      icon: MoreHorizontal 
    }
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 pointer-events-none">
      <nav 
        aria-label="Bottom navigation"
        className="pointer-events-auto apple-glass rounded-full px-2 py-1.5 shadow-[0_12px_36px_rgba(0,0,0,0.12)] border border-black/10 flex items-center justify-between transition-all duration-200"
      >
        {items.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id || (item.id === 'more' && ['catalogue', 'datastructures', 'users'].includes(activeTab));

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id === 'more' && ['catalogue', 'datastructures', 'users'].includes(activeTab) ? activeTab : item.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-3 sm:px-4 rounded-full transition-all duration-200 min-w-[58px] min-h-[44px] ${
                isActive
                  ? 'bg-[#0071e3] text-white shadow-sm font-semibold'
                  : 'text-[#86868b] hover:text-[#1d1d1f] hover:bg-black/5 active:scale-95'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-white stroke-[2.2]' : 'text-[#6e6e73] stroke-[1.8]'}`} />
                {item.badge !== undefined && (
                  <span className={`absolute -top-1.5 -right-2.5 px-1.5 min-w-[16px] h-4 rounded-full text-[10px] font-bold flex items-center justify-center font-mono ${
                    isActive ? 'bg-white text-[#0071e3]' : 'bg-[#ff3b30] text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] tracking-tight mt-0.5 leading-none ${isActive ? 'text-white font-medium' : 'text-[#86868b]'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
