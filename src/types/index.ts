export type Role = 'ADMIN' | 'STUDENT' | 'LECTURER';

export type ResourceStatus = 'Available' | 'Occupied' | 'Maintenance' | 'Reserved';

export interface Resource {
  resourceID: string;
  name: string;
  type: string; // Laboratory, Lecture Room, Equipment, Workshop, Hall
  location: string;
  capacity: number;
  status: ResourceStatus;
}

export interface User {
  userID: string;
  password?: string;
  role: Role;
  fullName: string;
  program: string; // e.g. "BSc Information Systems" or "BSc Computer Science,BSc Information Systems"
}

export type PriorityLevel = 1 | 2 | 3 | 4; // 1: Low, 2: Normal, 3: High, 4: Emergency

export interface RequestItem {
  requestID: string;
  userID: string;
  userName: string;
  resourceID: string;
  resourceName: string;
  requestTime: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  priority: PriorityLevel;
  type: 'standard' | 'priority';
  createdAt: number;
}

export interface TimetableEntry {
  id: string;
  courseID: string;
  courseName: string;
  program: string;
  dayOfWeek: string; // Monday, Tuesday, Wednesday, Thursday, Friday
  startTime: string; // 08:00, 10:00, 12:00, 14:00, 16:00
  endTime: string;   // 10:00, 12:00, 14:00, 16:00, 18:00
  room: string;
  lecturerID: string;
}

export interface ModuleInfo {
  code: string;
  name: string;
  year: number;
  semester: number;
  defaultRoom: string;
  defaultLecturer: string;
}

export interface ProgramInfo {
  code: string;
  name: string;
  durationYears: number;
  modules: ModuleInfo[];
}

export interface CampusLocation {
  id: string;
  name: string;
  code: string;
  x: number;
  y: number;
  type: 'Academic' | 'Lab' | 'Administration' | 'Facility' | 'Recreation';
  description?: string;
}

export interface CampusConnection {
  from: string;
  to: string;
  weight: number; // distance in meters or walking minutes
}
