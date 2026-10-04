import React from 'react';
import { 
  ListFilter, 
  Binary, 
  Layers, 
  GitFork, 
  RotateCcw, 
  Hash, 
  Flame 
} from 'lucide-react';

export const DataStructuresLab: React.FC = () => {
  const dsList = [
    {
      id: 'linkedlist',
      name: 'Singly Linked List',
      courseCode: 'CS3400 · Module 2',
      primaryRole: 'Facility registry node sequence',
      timeComplexity: { search: 'O(n)', insert: 'O(1) end', delete: 'O(n)' },
      icon: ListFilter,
      details: 'Nodes linked sequentially by reference pointers. Used for ordered iteration, sequential record maintenance, and file export serialization.'
    },
    {
      id: 'hashtable',
      name: 'Direct Hash Table',
      courseCode: 'CS3400 · Module 5',
      primaryRole: 'Immediate facility lookup & credentials',
      timeComplexity: { search: 'O(1) avg', insert: 'O(1)', delete: 'O(1)' },
      icon: Hash,
      details: 'Polynomial Horner rolling hash with chaining collision buckets. Reduces worst-case linear traversal to constant single-step access.'
    },
    {
      id: 'bst',
      name: 'Binary Search Tree',
      courseCode: 'CS3400 · Module 4',
      primaryRole: 'Timetable indexing & sorted retrieval',
      timeComplexity: { search: 'O(log n)', insert: 'O(log n)', delete: 'O(log n)' },
      icon: Binary,
      details: 'Ordered binary tree ensuring left subtree < root < right subtree. Supports in-order alphabetical retrieval and fast conflict checking.'
    },
    {
      id: 'priorityqueue',
      name: 'Binary Max-Heap',
      courseCode: 'CS3400 · Module 3',
      primaryRole: 'Urgent booking queue priority',
      timeComplexity: { search: 'O(n)', insert: 'O(log n)', delete: 'O(log n) dequeue' },
      icon: Flame,
      details: 'Array-indexed complete binary tree. Guarantees root is always the highest priority item (Emergency Level 4 > Low Level 1).'
    },
    {
      id: 'stack',
      name: 'LIFO Undo Stack',
      courseCode: 'CS3400 · Module 3',
      primaryRole: 'Reversible deletion history',
      timeComplexity: { search: 'O(n)', insert: 'O(1) push', delete: 'O(1) pop' },
      icon: RotateCcw,
      details: 'Last-In First-Out structure. Pushes deleted facilities to memory and pops them sequentially on undo commands.'
    },
    {
      id: 'graph',
      name: 'Weighted Graph & Dijkstra',
      courseCode: 'CS3400 · Module 6',
      primaryRole: 'Campus map navigation & routing',
      timeComplexity: { search: 'O(V + E)', insert: 'O(1)', delete: 'O(V²) Dijkstra' },
      icon: GitFork,
      details: 'Adjacency Matrix vertex-edge layout. Dijkstra calculates the guaranteed minimum walking distance and optimal path sequence.'
    }
  ];

  return (
    <div className="space-y-5 pb-24 max-w-5xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1d1d1f]">
          Algorithms &amp; Data Structures
        </h1>
        <p className="text-xs text-[#86868b] mt-0.5">
          CS3400 curriculum reference implemented within the Project Zero architecture
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dsList.map(ds => {
          const Icon = ds.icon;
          return (
            <div key={ds.id} className="apple-card p-5 space-y-3.5">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-[#1d1d1f]">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-sm text-[#1d1d1f]">{ds.name}</h2>
                  <span className="text-[11px] text-[#86868b] font-medium">{ds.courseCode}</span>
                </div>
              </div>

              <div className="text-xs space-y-0.5">
                <span className="text-[#86868b] font-medium text-[11px]">Primary Role:</span>
                <p className="text-[#1d1d1f] font-medium">{ds.primaryRole}</p>
              </div>

              {/* Time complexities */}
              <div className="p-3 bg-zinc-50 rounded-xl grid grid-cols-3 gap-1 text-center font-mono text-xs border border-black/[0.04]">
                <div>
                  <span className="text-[9px] uppercase text-[#86868b] block font-sans">Search</span>
                  <span className="font-semibold text-[#0071e3]">{ds.timeComplexity.search}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase text-[#86868b] block font-sans">Insert</span>
                  <span className="font-semibold text-[#1d1d1f]">{ds.timeComplexity.insert}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase text-[#86868b] block font-sans">Delete</span>
                  <span className="font-semibold text-[#1d1d1f]">{ds.timeComplexity.delete}</span>
                </div>
              </div>

              <p className="text-xs text-[#86868b] leading-relaxed">
                {ds.details}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
