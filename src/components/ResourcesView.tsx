import React, { useState, useMemo } from 'react';
import { Resource, ResourceStatus, User } from '../types';
import { Sorter, SortMetrics } from '../algorithms/sorting';
import { ResourceHashTable } from '../algorithms/hashTable';
import { ResourceBST, BSTVisualNode } from '../algorithms/bst';
import { 
  Building2, 
  Search, 
  RotateCcw, 
  Plus, 
  ArrowUpDown, 
  Zap, 
  Binary, 
  Trash2, 
  X,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';

interface ResourcesViewProps {
  resources: Resource[];
  currentUser: User;
  onAddResource: (res: Resource) => void;
  onUpdateStatus: (id: string, status: ResourceStatus) => void;
  onDeleteResource: (id: string) => void;
  onUndoDelete: () => void;
  canUndo: boolean;
  lastDeletedResource?: Resource;
  onBookResource?: (resource: Resource) => void;
}

export const ResourcesView: React.FC<ResourcesViewProps> = ({
  resources,
  currentUser,
  onAddResource,
  onUpdateStatus,
  onDeleteResource,
  onUndoDelete,
  canUndo,
  lastDeletedResource,
  onBookResource
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [sortMetrics, setSortMetrics] = useState<SortMetrics | null>(null);
  const [subTab, setSubTab] = useState<'list' | 'battle' | 'sorting' | 'bst'>('list');

  // New resource form state
  const [newID, setNewID] = useState('');
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState('Laboratory');
  const [newLocation, setNewLocation] = useState('Science Block');
  const [newCapacity, setNewCapacity] = useState(40);
  const [newStatus, setNewStatus] = useState<ResourceStatus>('Available');

  // Algorithm comparison states
  const [searchTargetID, setSearchTargetID] = useState('LAB101');
  const [battleResult, setBattleResult] = useState<{
    llSteps: number;
    llFound: boolean;
    llTimeMs: number;
    htSteps: number;
    htFound: boolean;
    htTimeMs: number;
    bucketIndex: number;
  } | null>(null);

  // BST state
  const [bstTraversalMode, setBstTraversalMode] = useState<'inorder' | 'preorder' | 'postorder'>('inorder');

  // Hash Table instance
  const hashTable = useMemo(() => {
    const ht = new ResourceHashTable(31);
    resources.forEach(r => ht.insert(r.resourceID, r));
    return ht;
  }, [resources]);

  // BST instance
  const bst = useMemo(() => {
    const tree = new ResourceBST();
    resources.forEach(r => tree.insert(r));
    return tree;
  }, [resources]);

  const uniqueTypes = useMemo(() => {
    return Array.from(new Set(resources.map(r => r.type)));
  }, [resources]);

  const displayedResources = useMemo(() => {
    if (sortMetrics) return sortMetrics.result;

    return resources.filter(res => {
      const matchSearch =
        res.resourceID.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'All' || res.status === statusFilter;
      const matchType = typeFilter === 'All' || res.type === typeFilter;
      return matchSearch && matchStatus && matchType;
    });
  }, [resources, searchTerm, statusFilter, typeFilter, sortMetrics]);

  const metrics = useMemo(() => {
    const total = resources.length;
    const available = resources.filter(r => r.status === 'Available').length;
    const occupied = resources.filter(r => r.status === 'Occupied').length;
    const maintenance = resources.filter(r => r.status === 'Maintenance').length;
    const reserved = resources.filter(r => r.status === 'Reserved').length;
    return { total, available, occupied, maintenance, reserved };
  }, [resources]);

  const handleRunSearchBattle = () => {
    const target = searchTargetID.trim();
    if (!target) return;

    const t0 = performance.now();
    let llSteps = 0;
    let llFound = false;
    for (let i = 0; i < resources.length; i++) {
      llSteps++;
      if (resources[i].resourceID.toLowerCase() === target.toLowerCase()) {
        llFound = true;
        break;
      }
    }
    const t1 = performance.now();
    const llTimeMs = Number((t1 - t0).toFixed(4));

    const t2 = performance.now();
    const htResult = hashTable.search(target.toUpperCase());
    const t3 = performance.now();
    const htTimeMs = Number((t3 - t2).toFixed(4));

    setBattleResult({
      llSteps,
      llFound,
      llTimeMs,
      htSteps: htResult.steps,
      htFound: !!htResult.found,
      htTimeMs,
      bucketIndex: htResult.bucketIndex
    });
  };

  const handleRunSort = (type: 'quick' | 'bubble' | 'merge') => {
    if (type === 'quick') {
      const res = Sorter.quickSort(resources);
      setSortMetrics(res);
    } else if (type === 'bubble') {
      const res = Sorter.bubbleSort(resources);
      setSortMetrics(res);
    } else {
      const res = Sorter.mergeSort(resources);
      setSortMetrics(res);
    }
  };

  const handleResetSort = () => {
    setSortMetrics(null);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newID.trim() || !newName.trim()) return;

    onAddResource({
      resourceID: newID.trim().toUpperCase(),
      name: newName.trim(),
      type: newType,
      location: newLocation.trim(),
      capacity: Number(newCapacity),
      status: newStatus
    });

    setNewID('');
    setNewName('');
    setIsAddModalOpen(false);
  };

  const bstNodes: BSTVisualNode[] = useMemo(() => {
    if (bstTraversalMode === 'inorder') return bst.inorder();
    if (bstTraversalMode === 'preorder') return bst.preorder();
    return bst.postorder();
  }, [bst, bstTraversalMode]);

  const getStatusDot = (status: ResourceStatus) => {
    switch (status) {
      case 'Available':
        return <span className="w-2 h-2 rounded-full bg-[#34c759] shrink-0" />;
      case 'Occupied':
        return <span className="w-2 h-2 rounded-full bg-[#0071e3] shrink-0" />;
      case 'Reserved':
        return <span className="w-2 h-2 rounded-full bg-[#ff9500] shrink-0" />;
      case 'Maintenance':
      default:
        return <span className="w-2 h-2 rounded-full bg-[#ff3b30] shrink-0" />;
    }
  };

  return (
    <div className="space-y-5 pb-24 max-w-5xl mx-auto">
      {/* Undo Stack Alert Banner (Apple Floating Toast) */}
      {canUndo && (
        <div className="bg-[#fff9e6] border border-[#ffe58f] rounded-2xl p-3.5 flex items-center justify-between shadow-xs transition-all">
          <div className="flex items-center space-x-3">
            <div className="w-7 h-7 rounded-full bg-[#faad14]/20 text-[#d48806] flex items-center justify-center font-bold text-xs">
              ↺
            </div>
            <div>
              <p className="text-xs font-semibold text-[#874d00]">
                {lastDeletedResource ? `Deleted ${lastDeletedResource.resourceID} · ${lastDeletedResource.name}` : 'Item deleted from facility registry'}
              </p>
              <p className="text-[11px] text-[#ad6800]">
                Managed on the LIFO deletion stack.
              </p>
            </div>
          </div>
          <button
            onClick={onUndoDelete}
            className="px-3 py-1.5 bg-[#faad14] hover:bg-[#d48806] text-white text-xs font-medium rounded-full shadow-xs transition-all active:scale-95"
          >
            Undo
          </button>
        </div>
      )}

      {/* Top Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1d1d1f]">
            Campus Facilities
          </h1>
          <p className="text-xs text-[#86868b] mt-0.5">
            {metrics.total} tracked spaces · {metrics.available} available for immediate booking
          </p>
        </div>

        {currentUser.role === 'ADMIN' && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-1.5 px-4 py-2 bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold rounded-full shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Facility</span>
          </button>
        )}
      </div>

      {/* Overview Stat Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="apple-card p-3.5">
          <div className="text-[11px] text-[#86868b] font-medium">Available Spaces</div>
          <div className="text-xl font-bold text-[#34c759] mt-0.5">{metrics.available}</div>
        </div>
        <div className="apple-card p-3.5">
          <div className="text-[11px] text-[#86868b] font-medium">Occupied in Classes</div>
          <div className="text-xl font-bold text-[#0071e3] mt-0.5">{metrics.occupied}</div>
        </div>
        <div className="apple-card p-3.5">
          <div className="text-[11px] text-[#86868b] font-medium">Reserved Slots</div>
          <div className="text-xl font-bold text-[#ff9500] mt-0.5">{metrics.reserved}</div>
        </div>
        <div className="apple-card p-3.5">
          <div className="text-[11px] text-[#86868b] font-medium">Under Maintenance</div>
          <div className="text-xl font-bold text-[#ff3b30] mt-0.5">{metrics.maintenance}</div>
        </div>
      </div>

      {/* iOS Segmented Control Bar */}
      <div className="p-1 bg-black/[0.05] rounded-xl flex items-center space-x-1 text-xs font-medium">
        <button
          onClick={() => setSubTab('list')}
          className={`flex-1 py-1.5 px-3 rounded-lg transition-all text-center ${
            subTab === 'list'
              ? 'bg-white text-[#1d1d1f] shadow-xs font-semibold'
              : 'text-[#86868b] hover:text-[#1d1d1f]'
          }`}
        >
          All Facilities
        </button>
        <button
          onClick={() => setSubTab('battle')}
          className={`flex-1 py-1.5 px-3 rounded-lg transition-all text-center ${
            subTab === 'battle'
              ? 'bg-white text-[#1d1d1f] shadow-xs font-semibold'
              : 'text-[#86868b] hover:text-[#1d1d1f]'
          }`}
        >
          Search Benchmark
        </button>
        <button
          onClick={() => setSubTab('sorting')}
          className={`flex-1 py-1.5 px-3 rounded-lg transition-all text-center ${
            subTab === 'sorting'
              ? 'bg-white text-[#1d1d1f] shadow-xs font-semibold'
              : 'text-[#86868b] hover:text-[#1d1d1f]'
          }`}
        >
          Sort Engine
        </button>
        <button
          onClick={() => setSubTab('bst')}
          className={`flex-1 py-1.5 px-3 rounded-lg transition-all text-center ${
            subTab === 'bst'
              ? 'bg-white text-[#1d1d1f] shadow-xs font-semibold'
              : 'text-[#86868b] hover:text-[#1d1d1f]'
          }`}
        >
          BST Hierarchy
        </button>
      </div>

      {/* SUBTAB 1: ALL FACILITIES */}
      {subTab === 'list' && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#86868b]" />
              <input
                type="text"
                placeholder="Search facility name, ID or location..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-black/[0.08] rounded-xl pl-9 pr-8 py-2 text-xs text-[#1d1d1f] placeholder-[#86868b] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 focus:border-[#0071e3]"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#86868b] hover:text-[#1d1d1f]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="bg-white border border-black/[0.08] rounded-xl px-3 py-2 text-xs text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20"
              >
                <option value="All">All Statuses</option>
                <option value="Available">Available</option>
                <option value="Occupied">Occupied</option>
                <option value="Reserved">Reserved</option>
                <option value="Maintenance">Maintenance</option>
              </select>

              <select
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
                className="bg-white border border-black/[0.08] rounded-xl px-3 py-2 text-xs text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20"
              >
                <option value="All">All Types</option>
                {uniqueTypes.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Sort Banner */}
          {sortMetrics && (
            <div className="bg-[#f0f7ff] border border-[#bae0ff] rounded-xl px-4 py-2.5 flex items-center justify-between text-xs text-[#0050b3]">
              <div className="flex items-center space-x-2">
                <span className="font-semibold">{sortMetrics.algorithm}</span>
                <span className="text-[#86868b]">·</span>
                <span className="font-mono text-[11px] text-[#003a8c]">
                  {sortMetrics.comparisons} comparisons · {sortMetrics.swaps} swaps · {sortMetrics.timeMs}ms
                </span>
              </div>
              <button
                onClick={handleResetSort}
                className="text-xs font-semibold text-[#0071e3] hover:underline"
              >
                Reset Order
              </button>
            </div>
          )}

          {/* iOS Card List View */}
          <div className="apple-card overflow-hidden divide-y divide-black/[0.06]">
            {displayedResources.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#86868b]">
                No facilities match your search criteria.
              </div>
            ) : (
              displayedResources.map(res => (
                <div
                  key={res.resourceID}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-black/[0.01] transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">
                      {getStatusDot(res.status)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-sm text-[#1d1d1f]">
                          {res.name}
                        </span>
                        <span className="text-xs font-mono text-[#86868b]">
                          {res.resourceID}
                        </span>
                      </div>
                      <div className="text-xs text-[#86868b] mt-0.5 flex items-center space-x-2">
                        <span>{res.location}</span>
                        <span>·</span>
                        <span>{res.type}</span>
                        <span>·</span>
                        <span>{res.capacity} seats</span>
                        <span>·</span>
                        <span className="font-medium text-[#1d1d1f]">{res.status}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end space-x-2 pt-1 sm:pt-0">
                    {currentUser.role === 'ADMIN' ? (
                      <div className="flex items-center space-x-2">
                        <select
                          value={res.status}
                          onChange={e => onUpdateStatus(res.resourceID, e.target.value as ResourceStatus)}
                          className="bg-black/[0.04] hover:bg-black/[0.06] border-none text-[#1d1d1f] rounded-lg px-2.5 py-1 text-xs font-medium focus:outline-none"
                        >
                          <option value="Available">Available</option>
                          <option value="Occupied">Occupied</option>
                          <option value="Reserved">Reserved</option>
                          <option value="Maintenance">Maintenance</option>
                        </select>
                        <button
                          onClick={() => onDeleteResource(res.resourceID)}
                          title="Delete facility (Pushes to undo stack)"
                          className="p-1.5 text-[#86868b] hover:text-[#ff3b30] hover:bg-[#ff3b30]/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => onBookResource && onBookResource(res)}
                        disabled={res.status !== 'Available'}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                          res.status === 'Available'
                            ? 'bg-[#0071e3] hover:bg-[#0077ed] text-white active:scale-95 shadow-xs'
                            : 'bg-black/[0.04] text-[#86868b] cursor-not-allowed'
                        }`}
                      >
                        Request Booking
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 2: SEARCH BENCHMARK */}
      {subTab === 'battle' && (
        <div className="space-y-4">
          <div className="apple-card p-5 space-y-4">
            <div>
              <h2 className="text-base font-bold text-[#1d1d1f]">
                Algorithmic Search Benchmark
              </h2>
              <p className="text-xs text-[#86868b] mt-0.5">
                Comparing sequential Linear Traversal (Linked List) against direct Horner-rule Hash Bucket Indexing (Hash Table).
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                value={searchTargetID}
                onChange={e => setSearchTargetID(e.target.value)}
                placeholder="Facility Code (e.g. LAB101)"
                className="bg-white border border-black/[0.08] rounded-xl px-3.5 py-2 text-xs font-mono uppercase text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 w-52"
              />
              <button
                onClick={handleRunSearchBattle}
                className="px-4 py-2 bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold rounded-full shadow-xs transition-all active:scale-95"
              >
                Run Search Benchmark
              </button>
            </div>

            {battleResult && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-black/[0.06]">
                <div className="p-4 bg-zinc-50 rounded-xl space-y-2 border border-black/[0.04]">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-[#1d1d1f]">Linked List (Linear)</span>
                    <span className="text-[10px] font-mono text-[#86868b]">O(N)</span>
                  </div>
                  <div className="text-2xl font-bold text-[#1d1d1f]">
                    {battleResult.llSteps} <span className="text-xs font-normal text-[#86868b]">nodes visited</span>
                  </div>
                  <div className="text-xs text-[#86868b]">
                    Status: {battleResult.llFound ? 'Found' : 'Not found'} ({battleResult.llTimeMs}ms)
                  </div>
                </div>

                <div className="p-4 bg-zinc-50 rounded-xl space-y-2 border border-black/[0.04]">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-[#1d1d1f]">Hash Table (Direct Bucket)</span>
                    <span className="text-[10px] font-mono text-[#0071e3] font-bold">O(1)</span>
                  </div>
                  <div className="text-2xl font-bold text-[#0071e3]">
                    {battleResult.htSteps} <span className="text-xs font-normal text-[#86868b]">bucket step(s)</span>
                  </div>
                  <div className="text-xs text-[#86868b]">
                    Status: {battleResult.htFound ? 'Found in Bucket #' + battleResult.bucketIndex : 'Not found'} ({battleResult.htTimeMs}ms)
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 3: SORTING ENGINE */}
      {subTab === 'sorting' && (
        <div className="space-y-4">
          <div className="apple-card p-5 space-y-4">
            <div>
              <h2 className="text-base font-bold text-[#1d1d1f]">
                Sorting Algorithms
              </h2>
              <p className="text-xs text-[#86868b] mt-0.5">
                Benchmark QuickSort, BubbleSort, and MergeSort on active facility records.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleRunSort('quick')}
                className="px-4 py-2 bg-white border border-black/[0.08] hover:bg-zinc-50 text-xs font-semibold text-[#1d1d1f] rounded-full shadow-xs transition-all active:scale-95"
              >
                QuickSort (by ID) · O(n log n)
              </button>
              <button
                onClick={() => handleRunSort('bubble')}
                className="px-4 py-2 bg-white border border-black/[0.08] hover:bg-zinc-50 text-xs font-semibold text-[#1d1d1f] rounded-full shadow-xs transition-all active:scale-95"
              >
                BubbleSort (by Capacity) · O(n²)
              </button>
              <button
                onClick={() => handleRunSort('merge')}
                className="px-4 py-2 bg-white border border-black/[0.08] hover:bg-zinc-50 text-xs font-semibold text-[#1d1d1f] rounded-full shadow-xs transition-all active:scale-95"
              >
                MergeSort (by Name) · O(n log n)
              </button>
              {sortMetrics && (
                <button
                  onClick={handleResetSort}
                  className="px-3 py-2 text-xs text-[#0071e3] hover:underline"
                >
                  Reset
                </button>
              )}
            </div>

            {sortMetrics && (
              <div className="p-4 bg-zinc-50 rounded-xl grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border border-black/[0.04]">
                <div>
                  <span className="text-[#86868b] block text-[10px] uppercase font-semibold">Algorithm</span>
                  <span className="font-semibold text-[#1d1d1f]">{sortMetrics.algorithm}</span>
                </div>
                <div>
                  <span className="text-[#86868b] block text-[10px] uppercase font-semibold">Comparisons</span>
                  <span className="font-bold text-[#1d1d1f] font-mono">{sortMetrics.comparisons}</span>
                </div>
                <div>
                  <span className="text-[#86868b] block text-[10px] uppercase font-semibold">Swaps</span>
                  <span className="font-bold text-[#1d1d1f] font-mono">{sortMetrics.swaps}</span>
                </div>
                <div>
                  <span className="text-[#86868b] block text-[10px] uppercase font-semibold">Execution</span>
                  <span className="font-bold text-[#34c759] font-mono">{sortMetrics.timeMs}ms</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 4: BST HIERARCHY */}
      {subTab === 'bst' && (
        <div className="space-y-4">
          <div className="apple-card p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-[#1d1d1f]">
                  Binary Search Tree
                </h2>
                <p className="text-xs text-[#86868b] mt-0.5">
                  Ordered by facility code for logarithmic search and ordered traversals.
                </p>
              </div>

              <div className="p-1 bg-black/[0.05] rounded-xl flex items-center space-x-1 text-xs">
                <button
                  onClick={() => setBstTraversalMode('inorder')}
                  className={`py-1 px-3 rounded-lg transition-all ${
                    bstTraversalMode === 'inorder' ? 'bg-white text-[#1d1d1f] shadow-xs font-semibold' : 'text-[#86868b]'
                  }`}
                >
                  In-Order
                </button>
                <button
                  onClick={() => setBstTraversalMode('preorder')}
                  className={`py-1 px-3 rounded-lg transition-all ${
                    bstTraversalMode === 'preorder' ? 'bg-white text-[#1d1d1f] shadow-xs font-semibold' : 'text-[#86868b]'
                  }`}
                >
                  Pre-Order
                </button>
                <button
                  onClick={() => setBstTraversalMode('postorder')}
                  className={`py-1 px-3 rounded-lg transition-all ${
                    bstTraversalMode === 'postorder' ? 'bg-white text-[#1d1d1f] shadow-xs font-semibold' : 'text-[#86868b]'
                  }`}
                >
                  Post-Order
                </button>
              </div>
            </div>

            {/* Traversal sequence */}
            <div className="p-3.5 bg-zinc-50 rounded-xl border border-black/[0.04]">
              <span className="text-[10px] font-semibold text-[#86868b] uppercase tracking-wider block mb-2">
                Traversal Path:
              </span>
              <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
                {bstNodes.map((n, i) => (
                  <React.Fragment key={n.id}>
                    <span className="px-2 py-1 bg-white border border-black/[0.06] rounded-md font-semibold text-[#1d1d1f]">
                      {n.id}
                    </span>
                    {i < bstNodes.length - 1 && (
                      <span className="text-[#86868b]">→</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Resource Modal / Sheet */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-black/[0.08]">
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
              <h3 className="font-bold text-base text-[#1d1d1f]">Add Facility</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-[#86868b] hover:text-[#1d1d1f]">✕</button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#86868b] mb-1 font-medium">Facility ID (e.g. LAB105)</label>
                <input
                  type="text"
                  required
                  value={newID}
                  onChange={e => setNewID(e.target.value)}
                  placeholder="LAB105"
                  className="w-full bg-zinc-50 border border-black/[0.08] rounded-xl px-3 py-2 text-[#1d1d1f] uppercase font-mono focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20"
                />
              </div>

              <div>
                <label className="block text-[#86868b] mb-1 font-medium">Facility Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="Networking & Hardware Lab"
                  className="w-full bg-zinc-50 border border-black/[0.08] rounded-xl px-3 py-2 text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#86868b] mb-1 font-medium">Type</label>
                  <select
                    value={newType}
                    onChange={e => setNewType(e.target.value)}
                    className="w-full bg-zinc-50 border border-black/[0.08] rounded-xl px-3 py-2 text-[#1d1d1f] focus:outline-none"
                  >
                    <option value="Laboratory">Laboratory</option>
                    <option value="Lecture Room">Lecture Room</option>
                    <option value="Equipment">Equipment</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Seminar Room">Seminar Room</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#86868b] mb-1 font-medium">Capacity</label>
                  <input
                    type="number"
                    min="1"
                    value={newCapacity}
                    onChange={e => setNewCapacity(Number(e.target.value))}
                    className="w-full bg-zinc-50 border border-black/[0.08] rounded-xl px-3 py-2 text-[#1d1d1f] font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#86868b] mb-1 font-medium">Location</label>
                <input
                  type="text"
                  required
                  value={newLocation}
                  onChange={e => setNewLocation(e.target.value)}
                  placeholder="Science Block"
                  className="w-full bg-zinc-50 border border-black/[0.08] rounded-xl px-3 py-2 text-[#1d1d1f] focus:outline-none"
                />
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
                  Save Facility
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
