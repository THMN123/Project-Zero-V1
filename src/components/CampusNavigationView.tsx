import React, { useState, useMemo } from 'react';
import { CampusLocation, CampusConnection, User } from '../types';
import { CampusGraph, DijkstraResult } from '../algorithms/graph';
import { 
  Compass, 
  MapPin, 
  Navigation, 
  ArrowRight, 
  Grid, 
  Plus, 
  Footprints
} from 'lucide-react';

interface CampusNavigationViewProps {
  locations: CampusLocation[];
  connections: CampusConnection[];
  currentUser: User;
  onAddLocation: (loc: CampusLocation) => void;
  onAddConnection: (conn: CampusConnection) => void;
}

export const CampusNavigationView: React.FC<CampusNavigationViewProps> = ({
  locations,
  connections,
  currentUser,
  onAddLocation,
  onAddConnection
}) => {
  const [startVenue, setStartVenue] = useState<string>('Library');
  const [destVenue, setDestVenue] = useState<string>('Science Block');
  const [activeSubTab, setActiveSubTab] = useState<'dijkstra' | 'traversal' | 'matrix'>('dijkstra');
  const [traversalType, setTraversalType] = useState<'bfs' | 'dfs'>('bfs');
  const [traversalStart, setTraversalStart] = useState<string>('Library');
  const [isAddLocationOpen, setIsAddLocationOpen] = useState(false);
  const [isAddConnectionOpen, setIsAddConnectionOpen] = useState(false);

  // New location form
  const [newLocName, setNewLocName] = useState('');
  const [newLocType, setNewLocType] = useState<'Academic' | 'Lab' | 'Administration' | 'Facility' | 'Recreation'>('Academic');

  // New connection form
  const [connFrom, setConnFrom] = useState(locations[0]?.name || 'Library');
  const [connTo, setConnTo] = useState(locations[1]?.name || 'ICTLAB');
  const [connWeight, setConnWeight] = useState(3);

  const graph = useMemo(() => {
    const locNames = locations.map(l => l.name);
    return new CampusGraph(locNames, connections);
  }, [locations, connections]);

  const dijkstraResult: DijkstraResult = useMemo(() => {
    return graph.dijkstra(startVenue);
  }, [graph, startVenue]);

  const destinationPath = useMemo(() => {
    return dijkstraResult.paths[destVenue] || { path: [], distance: Infinity };
  }, [dijkstraResult, destVenue]);

  const traversalResult = useMemo(() => {
    if (traversalType === 'bfs') {
      return graph.bfs(traversalStart);
    }
    return graph.dfs(traversalStart);
  }, [graph, traversalType, traversalStart]);

  const highlightedEdges = useMemo(() => {
    const set = new Set<string>();
    const path = destinationPath.path;
    for (let i = 0; i < path.length - 1; i++) {
      const u = path[i];
      const v = path[i + 1];
      set.add(`${u}__${v}`);
      set.add(`${v}__${u}`);
    }
    return set;
  }, [destinationPath]);

  const handleAddLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocName.trim()) return;

    const x = Math.floor(Math.random() * 400) + 200;
    const y = Math.floor(Math.random() * 300) + 150;

    onAddLocation({
      id: `loc-${Date.now()}`,
      name: newLocName.trim(),
      code: newLocName.trim().slice(0, 3).toUpperCase(),
      x,
      y,
      type: newLocType,
      description: `${newLocType} Building`
    });

    setNewLocName('');
    setIsAddLocationOpen(false);
  };

  const handleAddConnectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (connFrom === connTo) return;

    onAddConnection({
      from: connFrom,
      to: connTo,
      weight: Number(connWeight)
    });

    setIsAddConnectionOpen(false);
  };

  return (
    <div className="space-y-5 pb-24 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1d1d1f]">
            Campus Navigation
          </h1>
          <p className="text-xs text-[#86868b] mt-0.5">
            Dijkstra shortest pathway routing &amp; interactive campus layout
          </p>
        </div>

        {currentUser.role === 'ADMIN' && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsAddLocationOpen(true)}
              className="px-3 py-1.5 bg-white border border-black/[0.08] hover:bg-zinc-50 text-xs font-semibold text-[#1d1d1f] rounded-full shadow-xs"
            >
              + Venue
            </button>
            <button
              onClick={() => setIsAddConnectionOpen(true)}
              className="px-3 py-1.5 bg-[#0071e3] hover:bg-[#0077ed] text-xs font-semibold text-white rounded-full shadow-xs"
            >
              + Pathway
            </button>
          </div>
        )}
      </div>

      {/* Segmented Control */}
      <div className="p-1 bg-black/[0.05] rounded-xl flex items-center space-x-1 text-xs font-medium">
        <button
          onClick={() => setActiveSubTab('dijkstra')}
          className={`flex-1 py-1.5 px-3 rounded-lg transition-all text-center ${
            activeSubTab === 'dijkstra' ? 'bg-white text-[#1d1d1f] shadow-xs font-semibold' : 'text-[#86868b]'
          }`}
        >
          Shortest Route (Dijkstra)
        </button>
        <button
          onClick={() => setActiveSubTab('traversal')}
          className={`flex-1 py-1.5 px-3 rounded-lg transition-all text-center ${
            activeSubTab === 'traversal' ? 'bg-white text-[#1d1d1f] shadow-xs font-semibold' : 'text-[#86868b]'
          }`}
        >
          BFS &amp; DFS Traversal
        </button>
        <button
          onClick={() => setActiveSubTab('matrix')}
          className={`flex-1 py-1.5 px-3 rounded-lg transition-all text-center ${
            activeSubTab === 'matrix' ? 'bg-white text-[#1d1d1f] shadow-xs font-semibold' : 'text-[#86868b]'
          }`}
        >
          Adjacency Matrix
        </button>
      </div>

      {/* Apple-Clean SVG Vector Campus Map */}
      <div className="apple-card p-4 space-y-3 overflow-hidden">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-xs text-[#1d1d1f] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#34c759]" />
            National University of Lesotho Campus Grounds
          </span>
          <span className="text-[11px] text-[#86868b]">
            Tap any venue to set destination
          </span>
        </div>

        <div className="bg-[#fbfbfd] rounded-2xl border border-black/[0.06] p-2 overflow-x-auto">
          <svg className="w-full min-w-[650px] h-[320px]" viewBox="0 0 800 550">
            {/* Soft grid lines */}
            <defs>
              <pattern id="lightgrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f0f0f2" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="800" height="550" fill="url(#lightgrid)" />

            {/* Connecting Pathways */}
            {connections.map(conn => {
              const fromLoc = locations.find(l => l.name === conn.from);
              const toLoc = locations.find(l => l.name === conn.to);
              if (!fromLoc || !toLoc) return null;

              const isHighlighted = highlightedEdges.has(`${conn.from}__${conn.to}`);
              const midX = (fromLoc.x + toLoc.x) / 2;
              const midY = (fromLoc.y + toLoc.y) / 2;

              return (
                <g key={`${conn.from}-${conn.to}`}>
                  <line
                    x1={fromLoc.x}
                    y1={fromLoc.y}
                    x2={toLoc.x}
                    y2={toLoc.y}
                    stroke={isHighlighted ? '#0071e3' : '#d2d2d7'}
                    strokeWidth={isHighlighted ? 4 : 2}
                    className="transition-all duration-300"
                  />
                  <rect
                    x={midX - 12}
                    y={midY - 9}
                    width={24}
                    height={18}
                    rx={6}
                    fill={isHighlighted ? '#0071e3' : '#ffffff'}
                    stroke={isHighlighted ? '#0071e3' : '#d2d2d7'}
                    strokeWidth={1}
                  />
                  <text
                    x={midX}
                    y={midY + 4}
                    textAnchor="middle"
                    fill={isHighlighted ? '#ffffff' : '#86868b'}
                    fontSize={10}
                    fontFamily="-apple-system, sans-serif"
                    fontWeight="600"
                  >
                    {conn.weight}
                  </text>
                </g>
              );
            })}

            {/* Venues Nodes */}
            {locations.map(loc => {
              const isStart = loc.name === startVenue;
              const isDest = loc.name === destVenue;
              const isInPath = destinationPath.path.includes(loc.name);

              return (
                <g
                  key={loc.id}
                  className="cursor-pointer transition-transform hover:scale-105 active:scale-95"
                  onClick={() => {
                    if (startVenue !== loc.name) {
                      setDestVenue(loc.name);
                    }
                  }}
                >
                  {(isStart || isDest) && (
                    <circle
                      cx={loc.x}
                      cy={loc.y}
                      r={24}
                      fill={isStart ? '#34c759' : '#0071e3'}
                      opacity={0.15}
                    />
                  )}

                  <circle
                    cx={loc.x}
                    cy={loc.y}
                    r={18}
                    fill={
                      isStart ? '#34c759' :
                      isDest ? '#0071e3' :
                      isInPath ? '#e8f2ff' : '#ffffff'
                    }
                    stroke={
                      isStart ? '#2fb34f' :
                      isDest ? '#0071e3' :
                      isInPath ? '#0071e3' : '#d2d2d7'
                    }
                    strokeWidth={2}
                  />

                  <text
                    x={loc.x}
                    y={loc.y + 4}
                    textAnchor="middle"
                    fill={isStart || isDest ? '#ffffff' : '#1d1d1f'}
                    fontSize={10}
                    fontWeight="700"
                    fontFamily="monospace"
                  >
                    {loc.code}
                  </text>

                  <text
                    x={loc.x}
                    y={loc.y + 32}
                    textAnchor="middle"
                    fill={isStart ? '#2fb34f' : isDest ? '#0071e3' : '#1d1d1f'}
                    fontSize={11}
                    fontWeight="600"
                  >
                    {loc.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* DIJKSTRA CONTROLS & ROUTE CARD */}
      {activeSubTab === 'dijkstra' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Destination picker */}
          <div className="apple-card p-4 space-y-3.5">
            <h2 className="font-semibold text-xs text-[#86868b] uppercase tracking-wider">
              Route Parameters
            </h2>

            <div>
              <label className="block text-[#86868b] text-[11px] mb-1 font-medium">Starting Venue</label>
              <select
                value={startVenue}
                onChange={e => setStartVenue(e.target.value)}
                className="w-full bg-zinc-50 border border-black/[0.08] rounded-xl px-3 py-2 text-xs text-[#1d1d1f] font-semibold focus:outline-none"
              >
                {locations.map(l => (
                  <option key={l.id} value={l.name}>{l.name} ({l.code})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#86868b] text-[11px] mb-1 font-medium">Target Destination</label>
              <select
                value={destVenue}
                onChange={e => setDestVenue(e.target.value)}
                className="w-full bg-zinc-50 border border-black/[0.08] rounded-xl px-3 py-2 text-xs text-[#1d1d1f] font-semibold focus:outline-none"
              >
                {locations.map(l => (
                  <option key={l.id} value={l.name}>{l.name} ({l.code})</option>
                ))}
              </select>
            </div>

            <div className="p-4 bg-zinc-50 rounded-xl space-y-2 border border-black/[0.04]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#1d1d1f]">Total Distance</span>
                <span className="text-sm font-bold text-[#0071e3] font-mono">
                  {destinationPath.distance === Infinity ? 'Unreachable' : `${destinationPath.distance} walking units`}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {destinationPath.path.map((node, i) => (
                  <React.Fragment key={node}>
                    <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                      i === 0 ? 'bg-[#34c759]/10 text-[#28a745] font-semibold' :
                      i === destinationPath.path.length - 1 ? 'bg-[#0071e3]/10 text-[#0071e3] font-semibold' :
                      'bg-white text-[#1d1d1f] border border-black/[0.06]'
                    }`}>
                      {node}
                    </span>
                    {i < destinationPath.path.length - 1 && (
                      <ArrowRight className="w-3 h-3 text-[#86868b]" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Table of shortest distances to all venues */}
          <div className="md:col-span-2 apple-card p-4 space-y-3">
            <h2 className="font-semibold text-xs text-[#86868b] uppercase tracking-wider">
              Shortest Pathways from {startVenue}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-black/[0.06] text-[#86868b] font-medium">
                  <tr>
                    <th className="py-2 px-3">Destination</th>
                    <th className="py-2 px-3">Distance</th>
                    <th className="py-2 px-3">Pathway Sequence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.04]">
                  {locations.filter(l => l.name !== startVenue).map(l => {
                    const info = dijkstraResult.paths[l.name] || { path: [], distance: Infinity };
                    return (
                      <tr key={l.id} className="hover:bg-black/[0.01]">
                        <td className="py-2.5 px-3 font-semibold text-[#1d1d1f]">
                          {l.name}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-[#0071e3]">
                          {info.distance} units
                        </td>
                        <td className="py-2.5 px-3 text-[#86868b]">
                          {info.path.join(' → ')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TRAVERSAL TAB */}
      {activeSubTab === 'traversal' && (
        <div className="apple-card p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-base text-[#1d1d1f]">Graph Traversals</h2>
              <p className="text-xs text-[#86868b] mt-0.5">Explore breadth-first vs depth-first visiting sequence</p>
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={traversalType}
                onChange={e => setTraversalType(e.target.value as any)}
                className="bg-zinc-50 border border-black/[0.08] rounded-xl px-3 py-1.5 text-xs text-[#1d1d1f] focus:outline-none"
              >
                <option value="bfs">BFS (Queue exploration)</option>
                <option value="dfs">DFS (Stack recursion)</option>
              </select>
              <select
                value={traversalStart}
                onChange={e => setTraversalStart(e.target.value)}
                className="bg-zinc-50 border border-black/[0.08] rounded-xl px-3 py-1.5 text-xs text-[#1d1d1f] focus:outline-none"
              >
                {locations.map(l => (
                  <option key={l.id} value={l.name}>{l.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-4 bg-zinc-50 rounded-xl space-y-2 border border-black/[0.04]">
            <span className="text-[10px] font-semibold text-[#86868b] uppercase tracking-wider block">
              Node Visit Sequence:
            </span>
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {traversalResult.traversal.map((loc, i) => (
                <React.Fragment key={loc}>
                  <span className="px-2.5 py-1 bg-white border border-black/[0.06] rounded-md font-medium text-[#1d1d1f]">
                    {i + 1}. {loc}
                  </span>
                  {i < traversalResult.traversal.length - 1 && (
                    <span className="text-[#86868b]">→</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MATRIX TAB */}
      {activeSubTab === 'matrix' && (
        <div className="apple-card p-5 space-y-4">
          <div>
            <h2 className="font-bold text-base text-[#1d1d1f]">Adjacency Matrix</h2>
            <p className="text-xs text-[#86868b] mt-0.5">Symmetric numerical weight representation</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-center text-xs border border-black/[0.06]">
              <thead className="bg-zinc-50 font-mono text-[#86868b]">
                <tr>
                  <th className="p-2 border border-black/[0.06] text-left">Venue</th>
                  {locations.map(l => (
                    <th key={l.id} className="p-2 border border-black/[0.06]">{l.code}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.06]">
                {locations.map((rowLoc, rIdx) => {
                  const matrix = graph.getMatrix();
                  return (
                    <tr key={rowLoc.id}>
                      <td className="p-2 border border-black/[0.06] font-semibold text-[#1d1d1f] text-left">
                        {rowLoc.code}
                      </td>
                      {locations.map((colLoc, cIdx) => {
                        const val = matrix[rIdx]?.[cIdx] ?? 0;
                        return (
                          <td key={colLoc.id} className={`p-2 border border-black/[0.06] font-mono ${val > 0 ? 'font-bold text-[#0071e3] bg-blue-50/50' : 'text-[#86868b]'}`}>
                            {val}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      {isAddLocationOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl border border-black/[0.08]">
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
              <h3 className="font-bold text-sm text-[#1d1d1f]">Add Venue</h3>
              <button onClick={() => setIsAddLocationOpen(false)} className="text-[#86868b]">✕</button>
            </div>
            <form onSubmit={handleAddLocationSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#86868b] mb-1 font-medium">Venue Name</label>
                <input
                  type="text"
                  required
                  value={newLocName}
                  onChange={e => setNewLocName(e.target.value)}
                  placeholder="Student Center"
                  className="w-full bg-zinc-50 border border-black/[0.08] rounded-xl px-3 py-2 text-[#1d1d1f] focus:outline-none"
                />
              </div>
              <div className="pt-2 flex justify-end space-x-2">
                <button type="button" onClick={() => setIsAddLocationOpen(false)} className="px-3 py-1.5 bg-zinc-100 rounded-full font-medium">Cancel</button>
                <button type="submit" className="px-3 py-1.5 bg-[#0071e3] text-white rounded-full font-semibold">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAddConnectionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl border border-black/[0.08]">
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
              <h3 className="font-bold text-sm text-[#1d1d1f]">Add Pathway</h3>
              <button onClick={() => setIsAddConnectionOpen(false)} className="text-[#86868b]">✕</button>
            </div>
            <form onSubmit={handleAddConnectionSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#86868b] mb-1 font-medium">From</label>
                <select value={connFrom} onChange={e => setConnFrom(e.target.value)} className="w-full bg-zinc-50 border border-black/[0.08] rounded-xl px-3 py-2 text-[#1d1d1f] focus:outline-none">
                  {locations.map(l => <option key={l.id} value={l.name}>{l.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[#86868b] mb-1 font-medium">To</label>
                <select value={connTo} onChange={e => setConnTo(e.target.value)} className="w-full bg-zinc-50 border border-black/[0.08] rounded-xl px-3 py-2 text-[#1d1d1f] focus:outline-none">
                  {locations.map(l => <option key={l.id} value={l.name}>{l.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[#86868b] mb-1 font-medium">Weight / Distance</label>
                <input type="number" min="1" value={connWeight} onChange={e => setConnWeight(Number(e.target.value))} className="w-full bg-zinc-50 border border-black/[0.08] rounded-xl px-3 py-2 text-[#1d1d1f] font-mono focus:outline-none" />
              </div>
              <div className="pt-2 flex justify-end space-x-2">
                <button type="button" onClick={() => setIsAddConnectionOpen(false)} className="px-3 py-1.5 bg-zinc-100 rounded-full font-medium">Cancel</button>
                <button type="submit" className="px-3 py-1.5 bg-[#0071e3] text-white rounded-full font-semibold">Connect</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
