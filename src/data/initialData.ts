import { Resource, User, CampusLocation, CampusConnection, RequestItem } from '../types';

export const INITIAL_RESOURCES: Resource[] = [
  { resourceID: 'LAB101', name: 'ICT Lab 101', type: 'Laboratory', location: 'Science Block', capacity: 40, status: 'Available' },
  { resourceID: 'LEC201', name: 'Main Lecture Hall', type: 'Lecture Room', location: 'Main Hall', capacity: 150, status: 'Occupied' },
  { resourceID: 'PRJ001', name: 'Optoma 4K Projector A', type: 'Equipment', location: 'Store Room', capacity: 1, status: 'Available' },
  { resourceID: 'LAB102', name: 'Software Engineering Lab', type: 'Laboratory', location: 'ICTLAB Block', capacity: 35, status: 'Available' },
  { resourceID: 'AUD301', name: 'Faculty Auditorium', type: 'Lecture Room', location: 'Admin Block', capacity: 250, status: 'Reserved' },
  { resourceID: 'BIO205', name: 'Molecular Biology Research Lab', type: 'Laboratory', location: 'Science Block', capacity: 25, status: 'Maintenance' },
  { resourceID: 'ENG101', name: 'Circuit & Robotics Workshop', type: 'Workshop', location: 'Engineering Block', capacity: 30, status: 'Available' },
  { resourceID: 'SEM402', name: 'Postgraduate Seminar Room', type: 'Seminar Room', location: 'Library Building', capacity: 20, status: 'Available' },
  { resourceID: 'MIC005', name: 'Wireless PA Audio System', type: 'Equipment', location: 'Store Room', capacity: 4, status: 'Available' },
  { resourceID: 'SOC105', name: 'Economics Lecture Theatre', type: 'Lecture Room', location: 'Social Sciences', capacity: 120, status: 'Available' }
];

export const INITIAL_USERS: User[] = [
  { userID: 'admin', password: 'admin123', role: 'ADMIN', fullName: 'System Administrator', program: 'Campus Administration' },
  { userID: 'LEC_CS01', password: 'pass123', role: 'LECTURER', fullName: 'Dr. Thabo Moletsane', program: 'BSc Computer Science,BSc Information Systems' },
  { userID: 'LEC_IS01', password: 'pass123', role: 'LECTURER', fullName: 'Prof. N. Kabi', program: 'BSc Information Systems' },
  { userID: 'LEC_MATH1', password: 'pass123', role: 'LECTURER', fullName: 'Dr. M. Ralebese', program: 'Department of Mathematics' },
  { userID: 'STU101', password: 'pass123', role: 'STUDENT', fullName: 'Alice Nthabiseng', program: 'BSc Information Systems' },
  { userID: 'STU102', password: 'pass123', role: 'STUDENT', fullName: 'Kabelo Lerotholi', program: 'BSc Computer Science' },
  { userID: 'STU103', password: 'pass123', role: 'STUDENT', fullName: 'Puleng Mokhethi', program: 'BEng Electronics Engineering' }
];

export const INITIAL_LOCATIONS: CampusLocation[] = [
  { id: 'loc-1', name: 'Library', code: 'LIB', x: 260, y: 140, type: 'Facility', description: 'Thomas Mofolo Main University Library' },
  { id: 'loc-2', name: 'ICTLAB', code: 'ICT', x: 480, y: 120, type: 'Lab', description: 'Faculty of Science & Computing Laboratories' },
  { id: 'loc-3', name: 'Main Hall', code: 'MH', x: 210, y: 310, type: 'Facility', description: 'Central Convocation & Examination Hall' },
  { id: 'loc-4', name: 'Admin Block', code: 'ADM', x: 420, y: 280, type: 'Administration', description: 'Registrar, Bursary & Vice-Chancellor Complex' },
  { id: 'loc-5', name: 'Science Block', code: 'SCI', x: 670, y: 220, type: 'Academic', description: 'Department of Physics, Chemistry & Biology' },
  { id: 'loc-6', name: 'Engineering Block', code: 'ENG', x: 620, y: 400, type: 'Academic', description: 'Faculty of Engineering & Technology' },
  { id: 'loc-7', name: 'Student Centre', code: 'SC', x: 330, y: 450, type: 'Recreation', description: 'Student Union, Cafeteria & Campus Bookshop' },
  { id: 'loc-8', name: 'Sports Pavilion', code: 'SPT', x: 120, y: 490, type: 'Recreation', description: 'Athletics Ground & Indoor Gymnasium' }
];

export const INITIAL_CONNECTIONS: CampusConnection[] = [
  { from: 'Library', to: 'ICTLAB', weight: 3 },
  { from: 'Library', to: 'Main Hall', weight: 5 },
  { from: 'Main Hall', to: 'Admin Block', weight: 2 },
  { from: 'Admin Block', to: 'Science Block', weight: 4 },
  { from: 'ICTLAB', to: 'Science Block', weight: 6 },
  { from: 'Admin Block', to: 'Student Centre', weight: 3 },
  { from: 'Main Hall', to: 'Student Centre', weight: 4 },
  { from: 'Student Centre', to: 'Sports Pavilion', weight: 5 },
  { from: 'Science Block', to: 'Engineering Block', weight: 3 },
  { from: 'Student Centre', to: 'Engineering Block', weight: 6 }
];

export const INITIAL_REQUESTS: RequestItem[] = [
  {
    requestID: 'REQ-101',
    userID: 'STU101',
    userName: 'Alice Nthabiseng',
    resourceID: 'LAB101',
    resourceName: 'ICT Lab 101',
    requestTime: '10:00 - 12:00',
    status: 'Pending',
    priority: 2,
    type: 'standard',
    createdAt: Date.now() - 3600000
  },
  {
    requestID: 'REQ-102',
    userID: 'LEC_CS01',
    userName: 'Dr. Thabo Moletsane',
    resourceID: 'PRJ001',
    resourceName: 'Optoma 4K Projector A',
    requestTime: '14:00 - 16:00',
    status: 'Pending',
    priority: 3,
    type: 'priority',
    createdAt: Date.now() - 2500000
  },
  {
    requestID: 'REQ-103',
    userID: 'STU102',
    userName: 'Kabelo Lerotholi',
    resourceID: 'LAB102',
    resourceName: 'Software Engineering Lab',
    requestTime: '16:00 - 18:00',
    status: 'Pending',
    priority: 1,
    type: 'standard',
    createdAt: Date.now() - 1200000
  },
  {
    requestID: 'REQ-104',
    userID: 'LEC_IS01',
    userName: 'Prof. N. Kabi',
    resourceID: 'AUD301',
    resourceName: 'Faculty Auditorium',
    requestTime: '08:00 - 10:00',
    status: 'Pending',
    priority: 4,
    type: 'priority',
    createdAt: Date.now() - 600000
  }
];
