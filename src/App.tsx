import React, { useState, useMemo } from 'react';
import { 
  Resource, 
  User, 
  RequestItem, 
  CampusLocation, 
  CampusConnection, 
  TimetableEntry, 
  Role,
  ResourceStatus 
} from './types';
import { 
  INITIAL_RESOURCES, 
  INITIAL_USERS, 
  INITIAL_LOCATIONS, 
  INITIAL_CONNECTIONS, 
  INITIAL_REQUESTS 
} from './data/initialData';
import { TimetableEngine } from './algorithms/timetableEngine';
import { Stack } from './algorithms/stack';
import { TopHeader } from './components/TopHeader';
import { BottomPillNavbar } from './components/BottomPillNavbar';
import { MoreHubView } from './components/MoreHubView';
import { ResourcesView } from './components/ResourcesView';
import { RequestsView } from './components/RequestsView';
import { TimetableView } from './components/TimetableView';
import { CampusNavigationView } from './components/CampusNavigationView';
import { CatalogueView } from './components/CatalogueView';
import { DataStructuresLab } from './components/DataStructuresLab';
import { UserManagementView } from './components/UserManagementView';
import { AuthModal } from './components/AuthModal';
import { ChevronLeft } from 'lucide-react';

export const App: React.FC = () => {
  // State
  const [activeTab, setActiveTab] = useState<string>('resources');
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]); // Default Admin
  const [resources, setResources] = useState<Resource[]>(INITIAL_RESOURCES);
  const [requests, setRequests] = useState<RequestItem[]>(INITIAL_REQUESTS);
  const [locations, setLocations] = useState<CampusLocation[]>(INITIAL_LOCATIONS);
  const [connections, setConnections] = useState<CampusConnection[]>(INITIAL_CONNECTIONS);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Undo Stack instance for deleted resources
  const undoStack = useMemo(() => new Stack<Resource>(), []);
  const [undoCount, setUndoCount] = useState<number>(0);
  const [lastDeletedResource, setLastDeletedResource] = useState<Resource | undefined>(undefined);

  // Timetable Engine instance
  const timetableEngine = useMemo(() => {
    const engine = new TimetableEngine();
    engine.generateMasterSchedule();
    return engine;
  }, []);

  const [timetableEntries, setTimetableEntries] = useState<TimetableEntry[]>(() => {
    return timetableEngine.getEntries();
  });

  // Resource handlers
  const handleAddResource = (newRes: Resource) => {
    setResources(prev => [newRes, ...prev]);
  };

  const handleUpdateStatus = (id: string, newStatus: ResourceStatus) => {
    setResources(prev => prev.map(r => r.resourceID === id ? { ...r, status: newStatus } : r));
  };

  const handleDeleteResource = (id: string) => {
    const target = resources.find(r => r.resourceID === id);
    if (!target) return;

    undoStack.push(target);
    setUndoCount(undoStack.size());
    setLastDeletedResource(target);
    setResources(prev => prev.filter(r => r.resourceID !== id));
  };

  const handleUndoDelete = () => {
    const restored = undoStack.pop();
    if (!restored) return;

    setResources(prev => [...prev, restored]);
    setUndoCount(undoStack.size());
    setLastDeletedResource(undoStack.peek());
  };

  // Request handlers
  const handleProcessStandardRequest = (id: string, action: 'Approved' | 'Rejected') => {
    setRequests(prev => prev.map(r => r.requestID === id ? { ...r, status: action } : r));
  };

  const handleProcessPriorityRequest = (id: string, action: 'Approved' | 'Rejected') => {
    setRequests(prev => prev.map(r => r.requestID === id ? { ...r, status: action } : r));
  };

  const handleSubmitRequest = (data: Omit<RequestItem, 'requestID' | 'createdAt' | 'status'>) => {
    const newReq: RequestItem = {
      ...data,
      requestID: `REQ-${Date.now().toString().slice(-4)}`,
      status: 'Pending',
      createdAt: Date.now()
    };
    setRequests(prev => [newReq, ...prev]);
  };

  // Timetable handlers
  const handleGenerateMasterTimetable = () => {
    const res = timetableEngine.generateMasterSchedule();
    setTimetableEntries(res.entries);
  };

  const handleAddManualEntry = (entry: TimetableEntry) => {
    const result = timetableEngine.addEntry(entry);
    if (!result.hasConflict) {
      setTimetableEntries(timetableEngine.getEntries());
    }
    return result;
  };

  const handleDeleteTimetableEntry = (id: string) => {
    timetableEngine.removeEntry(id);
    setTimetableEntries(timetableEngine.getEntries());
  };

  // Graph handlers
  const handleAddLocation = (loc: CampusLocation) => {
    setLocations(prev => [...prev, loc]);
  };

  const handleAddConnection = (conn: CampusConnection) => {
    setConnections(prev => [...prev, conn]);
  };

  // User handlers
  const handleRegisterUser = (newUser: User) => {
    setUsers(prev => [...prev, newUser]);
  };

  const handleQuickSwitchUser = (role: Role) => {
    const match = users.find(u => u.role === role);
    if (match) {
      setCurrentUser(match);
    }
  };

  const pendingCount = requests.filter(r => r.status === 'Pending').length;

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] flex flex-col font-sans selection:bg-[#0071e3] selection:text-white">
      {/* Top Header */}
      <TopHeader
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onQuickSwitchUser={handleQuickSwitchUser}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 pt-5 pb-24">
        {/* Back navigation for subviews under More */}
        {['catalogue', 'datastructures', 'users'].includes(activeTab) && (
          <button
            onClick={() => setActiveTab('more')}
            className="flex items-center space-x-1 text-xs font-semibold text-[#0071e3] hover:underline mb-4 active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>More Features</span>
          </button>
        )}

        {activeTab === 'resources' && (
          <ResourcesView
            resources={resources}
            currentUser={currentUser}
            onAddResource={handleAddResource}
            onUpdateStatus={handleUpdateStatus}
            onDeleteResource={handleDeleteResource}
            onUndoDelete={handleUndoDelete}
            canUndo={undoCount > 0}
            lastDeletedResource={lastDeletedResource}
            onBookResource={() => {
              setActiveTab('requests');
            }}
          />
        )}

        {activeTab === 'requests' && (
          <RequestsView
            requests={requests}
            resources={resources}
            currentUser={currentUser}
            onProcessStandardRequest={handleProcessStandardRequest}
            onProcessPriorityRequest={handleProcessPriorityRequest}
            onSubmitRequest={handleSubmitRequest}
          />
        )}

        {activeTab === 'timetable' && (
          <TimetableView
            entries={timetableEntries}
            currentUser={currentUser}
            onGenerateMasterTimetable={handleGenerateMasterTimetable}
            onAddManualEntry={handleAddManualEntry}
            onDeleteEntry={handleDeleteTimetableEntry}
          />
        )}

        {activeTab === 'navigation' && (
          <CampusNavigationView
            locations={locations}
            connections={connections}
            currentUser={currentUser}
            onAddLocation={handleAddLocation}
            onAddConnection={handleAddConnection}
          />
        )}

        {activeTab === 'more' && (
          <MoreHubView
            onSelectSubView={(subView) => setActiveTab(subView)}
            userCount={users.length}
          />
        )}

        {activeTab === 'catalogue' && (
          <CatalogueView />
        )}

        {activeTab === 'datastructures' && (
          <DataStructuresLab />
        )}

        {activeTab === 'users' && (
          <UserManagementView
            users={users}
            currentUser={currentUser}
            onRegisterUser={handleRegisterUser}
            onSwitchUser={setCurrentUser}
          />
        )}
      </main>

      {/* Floating Bottom Pill Navbar */}
      <BottomPillNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingRequestsCount={pendingCount}
        undoCount={undoCount}
      />

      {/* Auth & Persona Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        users={users}
        onSelectUser={setCurrentUser}
      />
    </div>
  );
};
