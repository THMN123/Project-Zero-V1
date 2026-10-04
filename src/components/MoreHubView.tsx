import React from 'react';
import { 
  BookOpen, 
  ListFilter, 
  Users, 
  ChevronRight, 
  ShieldCheck, 
  Code2, 
  GraduationCap,
  Sparkles
} from 'lucide-react';

interface MoreHubViewProps {
  onSelectSubView: (view: 'catalogue' | 'datastructures' | 'users') => void;
  userCount: number;
}

export const MoreHubView: React.FC<MoreHubViewProps> = ({
  onSelectSubView,
  userCount
}) => {
  const sections = [
    {
      id: 'catalogue' as const,
      title: 'NUL Course Catalogue',
      description: 'Faculties, degrees, syllabus structures & module codes',
      icon: BookOpen,
      iconColor: 'bg-blue-500/10 text-blue-600',
      badge: '5 Programs'
    },
    {
      id: 'datastructures' as const,
      title: 'CS3400 Algorithms Lab',
      description: 'Educational reference for BST, Heaps, Hash Tables & Graphs',
      icon: ListFilter,
      iconColor: 'bg-indigo-500/10 text-indigo-600',
      badge: '6 Data Structures'
    },
    {
      id: 'users' as const,
      title: 'User Directory & Roles',
      description: 'UserHashTable accounts, permissions and role registry',
      icon: Users,
      iconColor: 'bg-emerald-500/10 text-emerald-600',
      badge: `${userCount} Users`
    }
  ];

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-24">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[#1d1d1f]">More Features</h2>
        <p className="text-xs text-[#86868b] mt-0.5">
          Curriculum reference, university catalogue, and algorithmic models.
        </p>
      </div>

      {/* iOS List Group */}
      <div className="apple-card overflow-hidden divide-y divide-black/[0.06]">
        {sections.map(section => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => onSelectSubView(section.id)}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-black/[0.02] transition-colors active:bg-black/[0.04]"
            >
              <div className="flex items-center space-x-3.5">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${section.iconColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-sm text-[#1d1d1f] flex items-center gap-2">
                    {section.title}
                  </div>
                  <div className="text-xs text-[#86868b] mt-0.5">
                    {section.description}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-medium text-[#86868b]">
                  {section.badge}
                </span>
                <ChevronRight className="w-4 h-4 text-[#86868b]" />
              </div>
            </button>
          );
        })}
      </div>

      {/* University & System Information Card */}
      <div className="apple-card p-5 space-y-3">
        <h3 className="font-semibold text-xs text-[#86868b] uppercase tracking-wider">
          About Project Zero
        </h3>
        <p className="text-xs text-[#1d1d1f] leading-relaxed">
          Project Zero is designed for the National University of Lesotho (NUL) Faculty of Science and Technology. Built according to clean software engineering and Human Interface Guidelines, it combines real-time facility resource tracking, automated conflict-free timetable scheduling, and graph-based navigation.
        </p>
        <div className="pt-2 border-t border-black/[0.06] flex items-center justify-between text-[11px] text-[#86868b]">
          <span>CS3400 Data Structures &amp; Algorithms</span>
          <span>Version 2.0 (iPhone 18 Edition)</span>
        </div>
      </div>
    </div>
  );
};
