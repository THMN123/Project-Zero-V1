import React from 'react';
import { User, Role } from '../types';
import { 
  Building2, 
  CalendarClock, 
  GitFork, 
  Layers, 
  ListFilter, 
  Users, 
  BookOpen, 
  LogOut, 
  ShieldCheck, 
  GraduationCap, 
  Briefcase
} from 'lucide-react';

interface NavbarProps {
  currentUser: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuth: () => void;
  onQuickSwitchUser: (role: Role) => void;
  pendingRequestsCount: number;
  undoCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  onOpenAuth,
  onQuickSwitchUser,
  pendingRequestsCount,
  undoCount
}) => {
  const tabs = [
    { id: 'resources', label: 'Facilities & Resources', icon: Building2, badge: undoCount > 0 ? `${undoCount} undo` : undefined },
    { id: 'requests', label: 'Booking Requests', icon: Layers, badge: pendingRequestsCount > 0 ? pendingRequestsCount : undefined },
    { id: 'timetable', label: 'Timetable & Schedule', icon: CalendarClock },
    { id: 'navigation', label: 'Campus Map & Dijkstra', icon: GitFork },
    { id: 'catalogue', label: 'NUL Catalogue', icon: BookOpen },
    { id: 'datastructures', label: 'CS3400 Data Structures', icon: ListFilter },
    { id: 'users', label: 'Users & Roles', icon: Users }
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/60">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-sky-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-black text-lg">
            P0
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-base tracking-tight text-white">PROJECT ZERO</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                NUL CS3400
              </span>
            </div>
            <p className="text-xs text-slate-400">Campus Facilities, Automated Timetabling &amp; Navigation System</p>
          </div>
        </div>

        {/* User Status & Fast Switcher */}
        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-1 bg-slate-950/80 p-1 rounded-lg border border-slate-800 text-xs">
            <span className="text-slate-400 px-2 font-medium">Switch Persona:</span>
            <button
              onClick={() => onQuickSwitchUser('ADMIN')}
              className={`px-2.5 py-1 rounded transition-colors ${currentUser.role === 'ADMIN' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
            >
              Admin
            </button>
            <button
              onClick={() => onQuickSwitchUser('LECTURER')}
              className={`px-2.5 py-1 rounded transition-colors ${currentUser.role === 'LECTURER' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
            >
              Lecturer
            </button>
            <button
              onClick={() => onQuickSwitchUser('STUDENT')}
              className={`px-2.5 py-1 rounded transition-colors ${currentUser.role === 'STUDENT' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
            >
              Student
            </button>
          </div>

          <div className="flex items-center space-x-2 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 px-3 py-1.5 rounded-lg transition-all cursor-pointer" onClick={onOpenAuth}>
            {currentUser.role === 'ADMIN' && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
            {currentUser.role === 'LECTURER' && <Briefcase className="w-4 h-4 text-amber-400" />}
            {currentUser.role === 'STUDENT' && <GraduationCap className="w-4 h-4 text-sky-400" />}
            <div className="text-left">
              <div className="text-xs font-semibold text-slate-100 flex items-center gap-1.5">
                {currentUser.fullName}
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono uppercase ${
                  currentUser.role === 'ADMIN' ? 'bg-emerald-500/20 text-emerald-300' :
                  currentUser.role === 'LECTURER' ? 'bg-amber-500/20 text-amber-300' :
                  'bg-sky-500/20 text-sky-300'
                }`}>
                  {currentUser.role}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 truncate max-w-[130px] sm:max-w-[200px]">
                {currentUser.program || 'NUL Staff'}
              </div>
            </div>
            <LogOut className="w-3.5 h-3.5 text-slate-400 hover:text-rose-400 ml-1" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 overflow-x-auto scrollbar-none py-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className={`ml-1.5 px-1.5 py-0.2 text-[10px] rounded-full font-mono font-bold ${
                  isActive ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-indigo-300 border border-indigo-500/30'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
};
