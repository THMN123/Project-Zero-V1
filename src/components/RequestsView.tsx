import React, { useState } from 'react';
import { RequestItem, Resource, User, PriorityLevel } from '../types';
import { 
  Layers, 
  Plus, 
  Check, 
  X, 
  Clock, 
  User as UserIcon, 
  Building2, 
  AlertCircle
} from 'lucide-react';

interface RequestsViewProps {
  requests: RequestItem[];
  resources: Resource[];
  currentUser: User;
  onProcessStandardRequest: (id: string, action: 'Approved' | 'Rejected') => void;
  onProcessPriorityRequest: (id: string, action: 'Approved' | 'Rejected') => void;
  onSubmitRequest: (req: Omit<RequestItem, 'requestID' | 'createdAt' | 'status'>) => void;
}

export const RequestsView: React.FC<RequestsViewProps> = ({
  requests,
  resources,
  currentUser,
  onProcessStandardRequest,
  onProcessPriorityRequest,
  onSubmitRequest
}) => {
  const [activeQueueType, setActiveQueueType] = useState<'priority' | 'standard'>('priority');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // Form states
  const [selectedResourceID, setSelectedResourceID] = useState(resources[0]?.resourceID || '');
  const [requestTime, setRequestTime] = useState('10:00 - 12:00');
  const [requestPriority, setRequestPriority] = useState<PriorityLevel>(2);
  const [requestType, setRequestType] = useState<'standard' | 'priority'>('standard');

  const pendingRequests = requests.filter(r => r.status === 'Pending');
  const standardPending = pendingRequests.filter(r => r.type === 'standard');
  const priorityPending = [...pendingRequests.filter(r => r.type === 'priority')].sort((a, b) => {
    if (a.priority !== b.priority) return b.priority - a.priority;
    return a.createdAt - b.createdAt;
  });

  const historyRequests = requests.filter(r => r.status !== 'Pending');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = resources.find(r => r.resourceID === selectedResourceID);
    if (!res) return;

    onSubmitRequest({
      userID: currentUser.userID,
      userName: currentUser.fullName,
      resourceID: res.resourceID,
      resourceName: res.name,
      requestTime,
      priority: requestType === 'priority' ? requestPriority : 1,
      type: requestType
    });

    setIsSubmitModalOpen(false);
  };

  const getPriorityLabel = (prio: PriorityLevel) => {
    switch (prio) {
      case 4:
        return <span className="text-[#ff3b30] font-semibold">Emergency (Level 4)</span>;
      case 3:
        return <span className="text-[#ff9500] font-semibold">High Priority (Level 3)</span>;
      case 2:
        return <span className="text-[#0071e3] font-medium">Standard (Level 2)</span>;
      case 1:
      default:
        return <span className="text-[#86868b]">Low (Level 1)</span>;
    }
  };

  return (
    <div className="space-y-5 pb-24 max-w-5xl mx-auto">
      {/* Top Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1d1d1f]">
            Booking Requests
          </h1>
          <p className="text-xs text-[#86868b] mt-0.5">
            {pendingRequests.length} pending approval · Evaluated via Max-Heap priority and FIFO queuing
          </p>
        </div>

        <button
          onClick={() => setIsSubmitModalOpen(true)}
          className="flex items-center space-x-1.5 px-4 py-2 bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold rounded-full shadow-xs transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Request</span>
        </button>
      </div>

      {/* Segmented Control */}
      <div className="p-1 bg-black/[0.05] rounded-xl flex items-center space-x-1 text-xs font-medium">
        <button
          onClick={() => setActiveQueueType('priority')}
          className={`flex-1 py-1.5 px-3 rounded-lg transition-all text-center flex items-center justify-center space-x-1.5 ${
            activeQueueType === 'priority'
              ? 'bg-white text-[#1d1d1f] shadow-xs font-semibold'
              : 'text-[#86868b] hover:text-[#1d1d1f]'
          }`}
        >
          <span>Priority Queue (Max-Heap)</span>
          <span className="text-[11px] text-[#86868b]">({priorityPending.length})</span>
        </button>
        <button
          onClick={() => setActiveQueueType('standard')}
          className={`flex-1 py-1.5 px-3 rounded-lg transition-all text-center flex items-center justify-center space-x-1.5 ${
            activeQueueType === 'standard'
              ? 'bg-white text-[#1d1d1f] shadow-xs font-semibold'
              : 'text-[#86868b] hover:text-[#1d1d1f]'
          }`}
        >
          <span>Standard FIFO Queue</span>
          <span className="text-[11px] text-[#86868b]">({standardPending.length})</span>
        </button>
      </div>

      {/* PRIORITY QUEUE (MAX-HEAP) */}
      {activeQueueType === 'priority' && (
        <div className="space-y-4">
          {currentUser.role === 'ADMIN' && priorityPending.length > 0 && (
            <div className="apple-card p-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-[#1d1d1f]">Root of Heap Action</span>
                <p className="text-[11px] text-[#86868b]">Process the highest priority request immediately</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onProcessPriorityRequest(priorityPending[0].requestID, 'Approved')}
                  className="px-3 py-1.5 bg-[#34c759] hover:bg-[#2fb34f] text-white text-xs font-semibold rounded-full shadow-xs"
                >
                  Approve Root
                </button>
                <button
                  onClick={() => onProcessPriorityRequest(priorityPending[0].requestID, 'Rejected')}
                  className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-[#ff3b30] text-xs font-semibold rounded-full"
                >
                  Reject Root
                </button>
              </div>
            </div>
          )}

          {/* Cards List */}
          <div className="apple-card overflow-hidden divide-y divide-black/[0.06]">
            {priorityPending.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#86868b]">
                No pending priority requests.
              </div>
            ) : (
              priorityPending.map((req, index) => (
                <div key={req.requestID} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-black/[0.01]">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-sm text-[#1d1d1f]">
                        {req.resourceID} · {req.resourceName}
                      </span>
                      <span className="text-xs font-mono text-[#86868b]">
                        #{req.requestID}
                      </span>
                    </div>
                    <div className="text-xs text-[#86868b] mt-0.5 flex flex-wrap items-center gap-1.5">
                      <span>{req.userName}</span>
                      <span>·</span>
                      <span>{req.requestTime}</span>
                      <span>·</span>
                      {getPriorityLabel(req.priority)}
                    </div>
                  </div>

                  {currentUser.role === 'ADMIN' && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onProcessPriorityRequest(req.requestID, 'Approved')}
                        className="px-3 py-1 bg-[#34c759]/10 text-[#28a745] hover:bg-[#34c759]/20 font-semibold text-xs rounded-full"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => onProcessPriorityRequest(req.requestID, 'Rejected')}
                        className="px-3 py-1 bg-[#ff3b30]/10 text-[#ff3b30] hover:bg-[#ff3b30]/20 font-semibold text-xs rounded-full"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* STANDARD FIFO QUEUE */}
      {activeQueueType === 'standard' && (
        <div className="space-y-4">
          <div className="apple-card overflow-hidden divide-y divide-black/[0.06]">
            {standardPending.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#86868b]">
                No standard booking requests waiting in the queue.
              </div>
            ) : (
              standardPending.map((req, index) => (
                <div key={req.requestID} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-black/[0.01]">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-sm text-[#1d1d1f]">
                        {req.resourceID} · {req.resourceName}
                      </span>
                      <span className="text-xs font-mono text-[#86868b]">
                        Queue #{index + 1}
                      </span>
                    </div>
                    <div className="text-xs text-[#86868b] mt-0.5 flex flex-wrap items-center gap-1.5">
                      <span>{req.userName}</span>
                      <span>·</span>
                      <span>{req.requestTime}</span>
                      <span>·</span>
                      <span>FIFO Standard</span>
                    </div>
                  </div>

                  {currentUser.role === 'ADMIN' && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onProcessStandardRequest(req.requestID, 'Approved')}
                        className="px-3 py-1 bg-[#34c759]/10 text-[#28a745] hover:bg-[#34c759]/20 font-semibold text-xs rounded-full"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => onProcessStandardRequest(req.requestID, 'Rejected')}
                        className="px-3 py-1 bg-[#ff3b30]/10 text-[#ff3b30] hover:bg-[#ff3b30]/20 font-semibold text-xs rounded-full"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Request History Section */}
      {historyRequests.length > 0 && (
        <div className="space-y-2">
          <h2 className="font-semibold text-xs text-[#86868b] uppercase tracking-wider px-1">
            Processed History
          </h2>
          <div className="apple-card overflow-hidden divide-y divide-black/[0.06]">
            {historyRequests.slice(0, 5).map(h => (
              <div key={h.requestID} className="p-3.5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-medium text-[#1d1d1f]">{h.resourceID}</span>
                  <span className="text-[#86868b]"> · {h.userName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[#86868b]">{h.requestTime}</span>
                  <span className={`font-semibold ${h.status === 'Approved' ? 'text-[#34c759]' : 'text-[#ff3b30]'}`}>
                    {h.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submit Request Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-black/[0.08]">
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
              <h3 className="font-bold text-base text-[#1d1d1f]">Submit Booking Request</h3>
              <button onClick={() => setIsSubmitModalOpen(false)} className="text-[#86868b] hover:text-[#1d1d1f]">✕</button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#86868b] mb-1 font-medium">Facility / Space</label>
                <select
                  value={selectedResourceID}
                  onChange={e => setSelectedResourceID(e.target.value)}
                  className="w-full bg-zinc-50 border border-black/[0.08] rounded-xl px-3 py-2 text-[#1d1d1f] focus:outline-none"
                >
                  {resources.map(r => (
                    <option key={r.resourceID} value={r.resourceID}>
                      {r.resourceID} · {r.name} ({r.location}) [{r.status}]
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#86868b] mb-1 font-medium">Timeslot</label>
                <select
                  value={requestTime}
                  onChange={e => setRequestTime(e.target.value)}
                  className="w-full bg-zinc-50 border border-black/[0.08] rounded-xl px-3 py-2 text-[#1d1d1f] focus:outline-none"
                >
                  <option value="08:00 - 10:00">08:00 - 10:00</option>
                  <option value="10:00 - 12:00">10:00 - 12:00</option>
                  <option value="12:00 - 14:00">12:00 - 14:00</option>
                  <option value="14:00 - 16:00">14:00 - 16:00</option>
                  <option value="16:00 - 18:00">16:00 - 18:00</option>
                </select>
              </div>

              <div>
                <label className="block text-[#86868b] mb-1 font-medium">Allocation Priority</label>
                <select
                  value={requestPriority}
                  onChange={e => {
                    const p = Number(e.target.value) as PriorityLevel;
                    setRequestPriority(p);
                    setRequestType(p > 1 ? 'priority' : 'standard');
                  }}
                  className="w-full bg-zinc-50 border border-black/[0.08] rounded-xl px-3 py-2 text-[#1d1d1f] focus:outline-none"
                >
                  <option value={1}>Standard FIFO (Level 1)</option>
                  <option value={2}>Standard Lecture (Level 2)</option>
                  <option value={3}>Departmental Priority (Level 3)</option>
                  <option value={4}>Emergency Allocation (Level 4)</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end space-x-2 border-t border-black/[0.06]">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-[#1d1d1f] font-medium rounded-full"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold rounded-full"
                >
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
