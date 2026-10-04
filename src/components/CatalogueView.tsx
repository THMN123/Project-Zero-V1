import React, { useState } from 'react';
import { NUL_CATALOGUE } from '../data/nulCatalogue';
import { BookOpen, ChevronRight, GraduationCap, MapPin, User as UserIcon } from 'lucide-react';

export const CatalogueView: React.FC = () => {
  const [selectedProgCode, setSelectedProgCode] = useState<string>('b01');
  const [yearFilter, setYearFilter] = useState<number | 'all'>('all');

  const selectedProgram = NUL_CATALOGUE.find(p => p.code === selectedProgCode) || NUL_CATALOGUE[0];

  const displayedModules = yearFilter === 'all'
    ? selectedProgram.modules
    : selectedProgram.modules.filter(m => m.year === yearFilter);

  return (
    <div className="space-y-5 pb-24 max-w-5xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1d1d1f]">
          Course Catalogue
        </h1>
        <p className="text-xs text-[#86868b] mt-0.5">
          National University of Lesotho (NUL) degree syllabi &amp; curriculum structures
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Programs List */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider block px-1">
            Programmes
          </span>
          <div className="apple-card overflow-hidden divide-y divide-black/[0.06]">
            {NUL_CATALOGUE.map(prog => (
              <button
                key={prog.code}
                onClick={() => {
                  setSelectedProgCode(prog.code);
                  setYearFilter('all');
                }}
                className={`w-full text-left p-3.5 transition-colors flex items-center justify-between ${
                  selectedProgCode === prog.code
                    ? 'bg-[#0071e3]/10 text-[#0071e3] font-semibold'
                    : 'text-[#1d1d1f] hover:bg-black/[0.02]'
                }`}
              >
                <div>
                  <div className="text-xs font-semibold">
                    {prog.name}
                  </div>
                  <div className="text-[11px] text-[#86868b] mt-0.5">
                    {prog.code.toUpperCase()} · {prog.durationYears} Years · {prog.modules.length} modules
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#86868b] shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Modules List */}
        <div className="md:col-span-2 space-y-3">
          <div className="apple-card p-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-bold text-sm text-[#1d1d1f]">{selectedProgram.name}</h2>
              <span className="text-xs text-[#86868b]">{displayedModules.length} curriculum modules</span>
            </div>

            {/* Year selector */}
            <div className="p-1 bg-black/[0.05] rounded-xl flex items-center space-x-1 text-xs">
              <button
                onClick={() => setYearFilter('all')}
                className={`py-1 px-2.5 rounded-lg transition-all ${
                  yearFilter === 'all' ? 'bg-white text-[#1d1d1f] shadow-xs font-semibold' : 'text-[#86868b]'
                }`}
              >
                All
              </button>
              {Array.from({ length: selectedProgram.durationYears }, (_, i) => i + 1).map(y => (
                <button
                  key={y}
                  onClick={() => setYearFilter(y)}
                  className={`py-1 px-2 rounded-lg transition-all ${
                    yearFilter === y ? 'bg-white text-[#1d1d1f] shadow-xs font-semibold' : 'text-[#86868b]'
                  }`}
                >
                  Y{y}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {displayedModules.map(m => (
              <div key={m.code} className="apple-card p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-[#0071e3]">
                    {m.code}
                  </span>
                  <span className="text-[11px] text-[#86868b]">
                    Year {m.year}, Sem {m.semester}
                  </span>
                </div>
                <div className="font-semibold text-xs text-[#1d1d1f] leading-snug">
                  {m.name}
                </div>
                <div className="pt-2 border-t border-black/[0.06] flex items-center justify-between text-[11px] text-[#86868b]">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#0071e3]" />
                    {m.defaultRoom}
                  </span>
                  <span className="font-mono">
                    {m.defaultLecturer}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
