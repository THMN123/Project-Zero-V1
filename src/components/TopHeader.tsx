import React from 'react';
import { User, Role } from '../types';
import { 
  ShieldCheck, 
  GraduationCap, 
  Briefcase, 
  ChevronDown,
  Sparkles
} from 'lucide-react';

interface TopHeaderProps {
  currentUser: User;
  onOpenAuth: () => void;
  onQuickSwitchUser: (role: Role) => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentUser,
  onOpenAuth,
  onQuickSwitchUser
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#f5f5f7]/85 backdrop-blur-xl border-b border-black/[0.06] transition-all">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#1d1d1f] flex items-center justify-center text-white font-bold text-xs shadow-sm">
            NUL
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-sm tracking-tight text-[#1d1d1f]">Project Zero</span>
              <span className="text-[11px] text-[#86868b] font-normal hidden sm:inline">·</span>
              <span className="text-[11px] text-[#86868b] font-normal hidden sm:inline">Campus OS</span>
            </div>
          </div>
        </div>

        {/* User Capsule & Persona Switcher */}
        <div className="flex items-center space-x-2">
          {/* Quick Persona Pills (Desktop) */}
          <div className="hidden md:flex items-center bg-black/[0.04] p-0.5 rounded-full text-xs">
            <button
              onClick={() => onQuickSwitchUser('ADMIN')}
              className={`px-2.5 py-1 rounded-full transition-all text-[11px] ${
                currentUser.role === 'ADMIN'
                  ? 'bg-white text-[#1d1d1f] font-semibold shadow-xs'
                  : 'text-[#86868b] hover:text-[#1d1d1f]'
              }`}
            >
              Admin
            </button>
            <button
              onClick={() => onQuickSwitchUser('LECTURER')}
              className={`px-2.5 py-1 rounded-full transition-all text-[11px] ${
                currentUser.role === 'LECTURER'
                  ? 'bg-white text-[#1d1d1f] font-semibold shadow-xs'
                  : 'text-[#86868b] hover:text-[#1d1d1f]'
              }`}
            >
              Lecturer
            </button>
            <button
              onClick={() => onQuickSwitchUser('STUDENT')}
              className={`px-2.5 py-1 rounded-full transition-all text-[11px] ${
                currentUser.role === 'STUDENT'
                  ? 'bg-white text-[#1d1d1f] font-semibold shadow-xs'
                  : 'text-[#86868b] hover:text-[#1d1d1f]'
              }`}
            >
              Student
            </button>
          </div>

          {/* User profile button */}
          <button
            onClick={onOpenAuth}
            className="flex items-center space-x-2 bg-white hover:bg-zinc-50 border border-black/[0.08] px-3 py-1.5 rounded-full shadow-xs transition-all active:scale-95"
          >
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold bg-black/[0.05] text-[#1d1d1f]">
              {currentUser.role === 'ADMIN' && <ShieldCheck className="w-3.5 h-3.5 text-[#0071e3]" />}
              {currentUser.role === 'LECTURER' && <Briefcase className="w-3.5 h-3.5 text-[#ff9500]" />}
              {currentUser.role === 'STUDENT' && <GraduationCap className="w-3.5 h-3.5 text-[#34c759]" />}
            </div>
            <div className="text-left hidden xs:block">
              <span className="text-xs font-medium text-[#1d1d1f] block leading-tight max-w-[120px] truncate">
                {currentUser.fullName}
              </span>
            </div>
            <span className="text-[10px] text-[#86868b] uppercase tracking-wider font-semibold">
              {currentUser.role}
            </span>
            <ChevronDown className="w-3 h-3 text-[#86868b]" />
          </button>
        </div>
      </div>
    </header>
  );
};
