import React, { useState } from 'react';
import { User } from '../types';
import { ShieldCheck, GraduationCap, Briefcase, Lock, X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  onSelectUser: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  users,
  onSelectUser
}) => {
  const [loginID, setLoginID] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.userID.toLowerCase() === loginID.trim().toLowerCase());
    if (!user || user.password !== password) {
      setError('Invalid User ID or password.');
      return;
    }
    setError(null);
    onSelectUser(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl border border-black/[0.08]">
        <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
          <div>
            <h3 className="font-bold text-base text-[#1d1d1f]">Switch Persona</h3>
            <p className="text-xs text-[#86868b]">Select a profile or sign in.</p>
          </div>
          <button onClick={onClose} className="text-[#86868b] hover:text-[#1d1d1f]">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Profiles */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-semibold text-[#86868b] uppercase tracking-wider block">
            Demo Profiles:
          </span>
          <div className="space-y-1.5">
            {users.slice(0, 3).map(u => (
              <button
                key={u.userID}
                onClick={() => {
                  onSelectUser(u);
                  onClose();
                }}
                className="w-full p-3 rounded-xl bg-zinc-50 hover:bg-zinc-100 flex items-center justify-between transition-colors text-left"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-xs">
                    {u.role === 'ADMIN' && <ShieldCheck className="w-4 h-4 text-[#0071e3]" />}
                    {u.role === 'LECTURER' && <Briefcase className="w-4 h-4 text-[#ff9500]" />}
                    {u.role === 'STUDENT' && <GraduationCap className="w-4 h-4 text-[#34c759]" />}
                  </div>
                  <div>
                    <div className="font-semibold text-xs text-[#1d1d1f]">{u.fullName}</div>
                    <div className="text-[10px] text-[#86868b] font-mono">{u.userID}</div>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-[#86868b] uppercase">
                  {u.role}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Manual Login */}
        <div className="pt-2 border-t border-black/[0.06] space-y-2.5">
          <span className="text-[10px] font-semibold text-[#86868b] uppercase tracking-wider block">
            Manual Sign In:
          </span>

          {error && (
            <div className="p-2 bg-red-50 text-[#ff3b30] text-xs rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleManualLogin} className="space-y-2.5 text-xs">
            <input
              type="text"
              required
              value={loginID}
              onChange={e => setLoginID(e.target.value)}
              placeholder="User ID (e.g. admin)"
              className="w-full bg-zinc-50 border border-black/[0.08] rounded-xl px-3 py-2 text-[#1d1d1f] focus:outline-none"
            />
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-zinc-50 border border-black/[0.08] rounded-xl px-3 py-2 text-[#1d1d1f] focus:outline-none"
            />
            <button
              type="submit"
              className="w-full py-2 bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold rounded-full shadow-xs transition-all active:scale-95"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
