import React, { useState } from 'react';
import { User, Role } from '../types';
import { NUL_CATALOGUE } from '../data/nulCatalogue';
import { Users, UserPlus, ShieldCheck, GraduationCap, Briefcase } from 'lucide-react';

interface UserManagementViewProps {
  users: User[];
  currentUser: User;
  onRegisterUser: (user: User) => void;
  onSwitchUser: (user: User) => void;
}

export const UserManagementView: React.FC<UserManagementViewProps> = ({
  users,
  currentUser,
  onRegisterUser,
  onSwitchUser
}) => {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [newID, setNewID] = useState('');
  const [newPassword, setNewPassword] = useState('pass123');
  const [newRole, setNewRole] = useState<Role>('STUDENT');
  const [newName, setNewName] = useState('');
  const [newProgram, setNewProgram] = useState('BSc Information Systems');

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newID.trim() || !newName.trim()) return;

    onRegisterUser({
      userID: newID.trim(),
      password: newPassword,
      role: newRole,
      fullName: newName.trim(),
      program: newProgram
    });

    setNewID('');
    setNewName('');
    setIsRegisterOpen(false);
  };

  return (
    <div className="space-y-5 pb-24 max-w-5xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1d1d1f]">
            User Accounts
          </h1>
          <p className="text-xs text-[#86868b] mt-0.5">
            Indexed in UserHashTable with role access permissions
          </p>
        </div>

        <button
          onClick={() => setIsRegisterOpen(true)}
          className="flex items-center space-x-1.5 px-4 py-2 bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold rounded-full shadow-xs transition-all active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          <span>New Account</span>
        </button>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
        {users.map(u => {
          const isCurrent = u.userID === currentUser.userID;
          return (
            <div
              key={u.userID}
              className={`apple-card p-4 space-y-3 transition-all ${
                isCurrent ? 'ring-2 ring-[#0071e3] shadow-sm' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-zinc-100 flex items-center justify-center text-[#1d1d1f]">
                    {u.role === 'ADMIN' && <ShieldCheck className="w-5 h-5 text-[#0071e3]" />}
                    {u.role === 'LECTURER' && <Briefcase className="w-5 h-5 text-[#ff9500]" />}
                    {u.role === 'STUDENT' && <GraduationCap className="w-5 h-5 text-[#34c759]" />}
                  </div>
                  <div>
                    <h2 className="font-semibold text-sm text-[#1d1d1f] flex items-center gap-1.5">
                      {u.fullName}
                    </h2>
                    <span className="text-xs text-[#86868b] font-mono">
                      ID: {u.userID}
                    </span>
                  </div>
                </div>

                <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider">
                  {u.role}
                </span>
              </div>

              <div className="text-xs text-[#86868b]">
                <span>Department / Degree: </span>
                <span className="text-[#1d1d1f] font-medium">{u.program || 'Central Administration'}</span>
              </div>

              <div className="pt-2 border-t border-black/[0.06] flex items-center justify-between">
                {isCurrent ? (
                  <span className="text-xs font-semibold text-[#0071e3]">Active Account</span>
                ) : (
                  <button
                    onClick={() => onSwitchUser(u)}
                    className="text-xs text-[#0071e3] hover:underline font-semibold"
                  >
                    Switch to this User
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Registration Modal */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-black/[0.08]">
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
              <h3 className="font-bold text-base text-[#1d1d1f]">Register Account</h3>
              <button onClick={() => setIsRegisterOpen(false)} className="text-[#86868b]">✕</button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#86868b] mb-1 font-medium">Full Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="Mpho Ramatseliso"
                  className="w-full bg-zinc-50 border border-black/[0.08] rounded-xl px-3 py-2 text-[#1d1d1f] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#86868b] mb-1 font-medium">User ID</label>
                  <input
                    type="text"
                    required
                    value={newID}
                    onChange={e => setNewID(e.target.value)}
                    placeholder="STU105"
                    className="w-full bg-zinc-50 border border-black/[0.08] rounded-xl px-3 py-2 text-[#1d1d1f] font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#86868b] mb-1 font-medium">Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full bg-zinc-50 border border-black/[0.08] rounded-xl px-3 py-2 text-[#1d1d1f] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#86868b] mb-1 font-medium">Role</label>
                <select
                  value={newRole}
                  onChange={e => setNewRole(e.target.value as Role)}
                  className="w-full bg-zinc-50 border border-black/[0.08] rounded-xl px-3 py-2 text-[#1d1d1f] focus:outline-none"
                >
                  <option value="STUDENT">Student</option>
                  <option value="LECTURER">Lecturer</option>
                  <option value="ADMIN">Administrator</option>
                </select>
              </div>

              {newRole === 'STUDENT' ? (
                <div>
                  <label className="block text-[#86868b] mb-1 font-medium">Program</label>
                  <select
                    value={newProgram}
                    onChange={e => setNewProgram(e.target.value)}
                    className="w-full bg-zinc-50 border border-black/[0.08] rounded-xl px-3 py-2 text-[#1d1d1f] focus:outline-none"
                  >
                    {NUL_CATALOGUE.map(p => (
                      <option key={p.code} value={p.name}>[{p.code.toUpperCase()}] {p.name}</option>
                    ))}
                  </select>
                </div>
              ) : newRole === 'LECTURER' ? (
                <div>
                  <label className="block text-[#86868b] mb-1 font-medium">Department</label>
                  <input
                    type="text"
                    value={newProgram}
                    onChange={e => setNewProgram(e.target.value)}
                    placeholder="BSc Computer Science"
                    className="w-full bg-zinc-50 border border-black/[0.08] rounded-xl px-3 py-2 text-[#1d1d1f] focus:outline-none"
                  />
                </div>
              ) : null}

              <div className="pt-3 flex justify-end space-x-2 border-t border-black/[0.06]">
                <button type="button" onClick={() => setIsRegisterOpen(false)} className="px-4 py-2 bg-zinc-100 rounded-full font-medium">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#0071e3] text-white rounded-full font-semibold">Create Account</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
