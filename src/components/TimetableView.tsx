import React, { useState, useMemo } from 'react';
import { TimetableEntry, User, ModuleInfo } from '../types';
import { NUL_CATALOGUE, getModulesForStudent, getProgramNameByCode } from '../data/nulCatalogue';
import { 
  Calendar, 
  Sparkles, 
  Plus, 
  GraduationCap, 
  Briefcase, 
  AlertCircle, 
  MapPin, 
  User as UserIcon,
  Trash2
} from 'lucide-react';

interface TimetableViewProps {
  entries: TimetableEntry[];
  currentUser: User;
  onGenerateMasterTimetable: () => void;
  onAddManualEntry: (entry: TimetableEntry) => { hasConflict: boolean; reason?: string };
  onDeleteEntry: (id: string) => void;
}

export const TimetableView: React.FC<TimetableViewProps> = ({
  entries,
  currentUser,
  onGenerateMasterTimetable,
  onAddManualEntry,
  onDeleteEntry
}) => {
  const [viewMode, setViewMode] = useState<'student' | 'master' | 'lecturer'>('student');
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);

  // Student portal registration states
  const [studentYear, setStudentYear] = useState<number>(1);
  const [studentSemester, setStudentSemester] = useState<number>(1);
  const [studentProgramCode, setStudentProgramCode] = useState<string>(
    currentUser.program || 'BSc Information Systems'
  );

  // Lecturer filter state
  const [lecturerIDFilter, setLecturerIDFilter] = useState<string>(
    currentUser.role === 'LECTURER' ? currentUser.userID : 'LEC_CS01'
  );

  // New manual entry form states
  const [newCID, setNewCID] = useState('');
  const [newCName, setNewCName] = useState('');
  const [newProg, setNewProg] = useState('BSc Computer Science');
  const [newDay, setNewDay] = useState('Monday');
  const [newStart, setNewStart] = useState('08:00');
  const [newRoom, setNewRoom] = useState('CMP-LAB1');
  const [newLecID, setNewLecID] = useState('LEC_CS01');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const dayAbbr: Record<string, string> = {
    'Monday': 'Mon',
    'Tuesday': 'Tue',
    'Wednesday': 'Wed',
    'Thursday': 'Thu',
    'Friday': 'Fri'
  };

  const timeslots = ['08:00', '10:00', '12:00', '14:00', '16:00'];
  const endTimes: Record<string, string> = {
    '08:00': '10:00',
    '10:00': '12:00',
    '12:00': '14:00',
    '14:00': '16:00',
    '16:00': '18:00'
  };

  const studentPrescribedModules: ModuleInfo[] = useMemo(() => {
    return getModulesForStudent(studentProgramCode, studentYear, studentSemester);
  }, [studentProgramCode, studentYear, studentSemester]);

  const studentModuleCodes = useMemo(() => {
    return new Set(studentPrescribedModules.map(m => m.code.toUpperCase()));
  }, [studentPrescribedModules]);

  const activeEntries = useMemo(() => {
    if (viewMode === 'student') {
      const fullProgName = getProgramNameByCode(studentProgramCode);
      return entries.filter(
        e => (e.program.toLowerCase() === fullProgName.toLowerCase() || e.program.toLowerCase() === studentProgramCode.toLowerCase()) &&
             studentModuleCodes.has(e.courseID.toUpperCase())
      );
    }

    if (viewMode === 'lecturer') {
      return entries.filter(e => e.lecturerID.toLowerCase() === lecturerIDFilter.toLowerCase());
    }

    return entries;
  }, [entries, viewMode, studentProgramCode, studentModuleCodes, lecturerIDFilter]);

  const currentDayEntries = useMemo(() => {
    return activeEntries.filter(e => e.dayOfWeek === selectedDay);
  }, [activeEntries, selectedDay]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConflictWarning(null);

    const result = onAddManualEntry({
      id: `TT-${Date.now()}`,
      courseID: newCID.trim().toUpperCase(),
      courseName: newCName.trim(),
      program: newProg,
      dayOfWeek: newDay,
      startTime: newStart,
      endTime: endTimes[newStart] || '10:00',
      room: newRoom.trim().toUpperCase(),
      lecturerID: newLecID.trim()
    });

    if (result.hasConflict) {
      setConflictWarning(result.reason || 'Conflict detected!');
    } else {
      setIsAddModalOpen(false);
      setNewCID('');
      setNewCName('');
    }
  };

  return (
    <div className="space-y-5 pb-24 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1d1d1f]">
            Schedule &amp; Timetable
          </h1>
          <p className="text-xs text-[#86868b] mt-0.5">
            Conflict-free BST scheduler for NUL academic degree programs
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {currentUser.role === 'ADMIN' && (
            <button
              onClick={onGenerateMasterTimetable}
              className="flex items-center space-x-1 px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-[#1d1d1f] text-xs font-semibold rounded-full transition-all active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#0071e3]" />
              <span>Regenerate Engine</span>
            </button>
          )}

          {currentUser.role === 'ADMIN' && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center space-x-1 px-3 py-1.5 bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold rounded-full shadow-xs transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Session</span>
            </button>
          )}
        </div>
      </div>

      {/* Segmented View Mode Picker */}
      <div className="p-1 bg-black/[0.05] rounded-xl flex items-center space-x-1 text-xs font-medium">
        <button
          onClick={() => setViewMode('student')}
          className={`flex-1 py-1.5 px-3 rounded-lg transition-all text-center ${
            viewMode === 'student' ? 'bg-white text-[#1d1d1f] shadow-xs font-semibold' : 'text-[#86868b]'
          }`}
        >
          My Syllabus Portal
        </button>
        <button
          onClick={() => setViewMode('master')}
          className={`flex-1 py-1.5 px-3 rounded-lg transition-all text-center ${
            viewMode === 'master' ? 'bg-white text-[#1d1d1f] shadow-xs font-semibold' : 'text-[#86868b]'
          }`}
        >
          Master Schedule
        </button>
        <button
          onClick={() => setViewMode('lecturer')}
          className={`flex-1 py-1.5 px-3 rounded-lg transition-all text-center ${
            viewMode === 'lecturer' ? 'bg-white text-[#1d1d1f] shadow-xs font-semibold' : 'text-[#86868b]'
          }`}
        >
          Lecturer Schedule
        </button>
      </div>

      {/* Student Enrollment Configuration */}
      {viewMode === 'student' && (
        <div className="apple-card p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-semibold text-xs text-[#1d1d1f] flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-[#0071e3]" />
              Select Degree &amp; Academic Period
            </span>
            <span className="text-[11px] text-[#86868b]">
              {studentPrescribedModules.length} Modules in syllabus
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <select
              value={studentProgramCode}
              onChange={e => setStudentProgramCode(e.target.value)}
              className="bg-zinc-50 border border-black/[0.08] rounded-xl px-3 py-2 text-xs text-[#1d1d1f] focus:outline-none"
            >
              {NUL_CATALOGUE.map(p => (
                <option key={p.code} value={p.name}>[{p.code.toUpperCase()}] {p.name}</option>
              ))}
            </select>

            <select
              value={studentYear}
              onChange={e => setStudentYear(Number(e.target.value))}
              className="bg-zinc-50 border border-black/[0.08] rounded-xl px-3 py-2 text-xs text-[#1d1d1f] focus:outline-none"
            >
              <option value={1}>Year 1</option>
              <option value={2}>Year 2</option>
              <option value={3}>Year 3</option>
              <option value={4}>Year 4</option>
              <option value={5}>Year 5</option>
            </select>

            <select
              value={studentSemester}
              onChange={e => setStudentSemester(Number(e.target.value))}
              className="bg-zinc-50 border border-black/[0.08] rounded-xl px-3 py-2 text-xs text-[#1d1d1f] focus:outline-none"
            >
              <option value={1}>Semester 1 (Aug - Dec)</option>
              <option value={2}>Semester 2 (Jan - May)</option>
            </select>
          </div>
        </div>
      )}

      {/* Lecturer Selector */}
      {viewMode === 'lecturer' && (
        <div className="apple-card p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#1d1d1f]">
            <Briefcase className="w-4 h-4 text-[#ff9500]" />
            <span>Select Lecturer:</span>
          </div>
          <select
            value={lecturerIDFilter}
            onChange={e => setLecturerIDFilter(e.target.value)}
            className="bg-zinc-50 border border-black/[0.08] rounded-xl px-3 py-1.5 text-xs text-[#1d1d1f] font-mono focus:outline-none"
          >
            <option value="LEC_CS01">LEC_CS01 (Dr. T. Moletsane)</option>
            <option value="LEC_CS02">LEC_CS02 (Mr. K. Sekhamane)</option>
            <option value="LEC_CS03">LEC_CS03 (Ms. L. Ramosoeu)</option>
            <option value="LEC_IS01">LEC_IS01 (Prof. N. Kabi)</option>
            <option value="LEC_IS02">LEC_IS02 (Dr. P. Tsikoane)</option>
            <option value="LEC_MATH1">LEC_MATH1 (Dr. M. Ralebese)</option>
            <option value="LEC_BIO1">LEC_BIO1 (Dr. A. Khaketla)</option>
            <option value="LEC_BUS1">LEC_BUS1 (Dr. B. Mphatsoanyane)</option>
            <option value="LEC_ENG1">LEC_ENG1 (Eng. S. Molapo)</option>
          </select>
        </div>
      )}

      {/* Weekday Switcher (Pill style for iPhone) */}
      <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none pb-1">
        {days.map(d => {
          const count = activeEntries.filter(e => e.dayOfWeek === d).length;
          const isSelected = selectedDay === d;

          return (
            <button
              key={d}
              onClick={() => setSelectedDay(d)}
              className={`flex-1 min-w-[70px] py-2 px-3 rounded-2xl transition-all text-center ${
                isSelected
                  ? 'bg-[#1d1d1f] text-white shadow-xs font-semibold'
                  : 'bg-white border border-black/[0.06] text-[#86868b] hover:text-[#1d1d1f]'
              }`}
            >
              <div className="text-[11px] font-medium">{dayAbbr[d]}</div>
              <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-zinc-300' : 'text-[#86868b]'}`}>
                {count} {count === 1 ? 'class' : 'classes'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Day Schedule Sessions List */}
      <div className="space-y-3">
        {currentDayEntries.length === 0 ? (
          <div className="apple-card p-10 text-center text-xs text-[#86868b]">
            No scheduled classes for {selectedDay}.
          </div>
        ) : (
          currentDayEntries.map(session => (
            <div
              key={session.id}
              className="apple-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-black/[0.01] transition-colors"
            >
              <div className="flex items-start space-x-3.5">
                <div className="min-w-[70px] text-center pt-0.5">
                  <div className="font-mono font-bold text-xs text-[#0071e3]">
                    {session.startTime}
                  </div>
                  <div className="font-mono text-[10px] text-[#86868b]">
                    {session.endTime}
                  </div>
                </div>

                <div className="border-l border-black/[0.06] pl-3.5 space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-sm text-[#1d1d1f]">
                      {session.courseName}
                    </span>
                    <span className="font-mono text-xs text-[#86868b]">
                      {session.courseID}
                    </span>
                  </div>
                  <div className="text-xs text-[#86868b] flex flex-wrap items-center gap-1.5">
                    <span className="flex items-center gap-1 text-[#1d1d1f]">
                      <MapPin className="w-3.5 h-3.5 text-[#0071e3]" />
                      {session.room}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <UserIcon className="w-3 h-3 text-[#86868b]" />
                      {session.lecturerID}
                    </span>
                    <span>·</span>
                    <span>{session.program}</span>
                  </div>
                </div>
              </div>

              {currentUser.role === 'ADMIN' && (
                <button
                  onClick={() => onDeleteEntry(session.id)}
                  className="p-1.5 text-[#86868b] hover:text-[#ff3b30] hover:bg-[#ff3b30]/10 rounded-lg self-end sm:self-center transition-colors"
                  title="Remove scheduled session"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Manual Entry Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-black/[0.08]">
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
              <h3 className="font-bold text-base text-[#1d1d1f]">Add Scheduled Session</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-[#86868b] hover:text-[#1d1d1f]">✕</button>
            </div>

            {conflictWarning && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-[#ff3b30] flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-[#ff3b30] shrink-0 mt-0.5" />
                <span>{conflictWarning}</span>
              </div>
            )}

            <form onSubmit={handleManualSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#86868b] mb-1 font-medium">Course Code</label>
                  <input
                    type="text"
                    required
                    value={newCID}
                    onChange={e => setNewCID(e.target.value)}
                    placeholder="CS3400"
                    className="w-full bg-zinc-50 border border-black/[0.08] rounded-xl px-3 py-2 text-[#1d1d1f] uppercase font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#86868b] mb-1 font-medium">Course Name</label>
                  <input
                    type="text"
                    required
                    value={newCName}
                    onChange={e => setNewCName(e.target.value)}
                    placeholder="Advanced Algorithms"
                    className="w-full bg-zinc-50 border border-black/[0.08] rounded-xl px-3 py-2 text-[#1d1d1f] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#86868b] mb-1 font-medium">Degree Program</label>
                <select
                  value={newProg}
                  onChange={e => setNewProg(e.target.value)}
                  className="w-full bg-zinc-50 border border-black/[0.08] rounded-xl px-3 py-2 text-[#1d1d1f] focus:outline-none"
                >
                  {NUL_CATALOGUE.map(p => (
                    <option key={p.code} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#86868b] mb-1 font-medium">Day</label>
                  <select
                    value={newDay}
                    onChange={e => setNewDay(e.target.value)}
                    className="w-full bg-zinc-50 border border-black/[0.08] rounded-xl px-3 py-2 text-[#1d1d1f] focus:outline-none"
                  >
                    {days.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#86868b] mb-1 font-medium">Timeslot</label>
                  <select
                    value={newStart}
                    onChange={e => setNewStart(e.target.value)}
                    className="w-full bg-zinc-50 border border-black/[0.08] rounded-xl px-3 py-2 text-[#1d1d1f] font-mono focus:outline-none"
                  >
                    {timeslots.map(t => (
                      <option key={t} value={t}>{t} - {endTimes[t]}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#86868b] mb-1 font-medium">Venue</label>
                  <input
                    type="text"
                    required
                    value={newRoom}
                    onChange={e => setNewRoom(e.target.value)}
                    placeholder="CMP-LAB1"
                    className="w-full bg-zinc-50 border border-black/[0.08] rounded-xl px-3 py-2 text-[#1d1d1f] font-mono uppercase focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#86868b] mb-1 font-medium">Lecturer ID</label>
                  <input
                    type="text"
                    required
                    value={newLecID}
                    onChange={e => setNewLecID(e.target.value)}
                    placeholder="LEC_CS01"
                    className="w-full bg-zinc-50 border border-black/[0.08] rounded-xl px-3 py-2 text-[#1d1d1f] font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end space-x-2 border-t border-black/[0.06]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-[#1d1d1f] font-medium rounded-full"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold rounded-full"
                >
                  Check &amp; Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
