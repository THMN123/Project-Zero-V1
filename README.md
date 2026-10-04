# Project-Zero: NUL Campus Resource & Activity Management System
**CS3400 Data Structures & Algorithms Project (National University of Lesotho)**

Project Zero is a web-based campus facility management, automated timetable generation, and spatial navigation system. It was migrated from the original C++ console application to a modern, responsive Vite + React web application.

---

## 🏛️ Core Features

1. **Facilities & Resources Registry**
   - Linked List and Direct Hash Table (O(1)) backing stores.
   - Live Search Battle benchmark comparing $O(N)$ linear traversal vs. $O(1)$ polynomial hash bucket indexing.
   - Resource status lifecycle tracking (`Available`, `Occupied`, `Reserved`, `Maintenance`).
   - Sorter suite (QuickSort by ID, BubbleSort by Capacity, MergeSort by Name) reporting real comparison and swap metrics.
   - LIFO Undo Stack: Allows administrators to instantly undo facility deletions.
   - Binary Search Tree (BST) visualizer for in-order, pre-order, and post-order traversals.

2. **Booking Requests Queues**
   - **FIFO Sequential Queue**: Standard first-come, first-served facility reservations.
   - **Binary Max-Heap Priority Queue**: Priority-based scheduling (Level 4 Emergency > Level 3 High > Level 2 Normal > Level 1 Low).
   - Array-index and root dequeue visualizations.

3. **NUL Academic Timetable Engine (BST)**
   - Conflict-free automated generation engine covering all five National University of Lesotho (NUL) degree faculties:
     - `b01`: BSc Information Systems
     - `b02`: BSc Computer Science
     - `b03`: BSc Biotechnology
     - `b04`: BBA Business Administration
     - `b05`: BEng Electronics Engineering
   - Conflict resolution checking across timeslots, classrooms, lecturer double-booking, and student cohort overlaps.
   - Interactive 5-day weekly matrix (Monday – Friday, 08:00 – 18:00).
   - **Student Personal Portal**: Input academic year and semester to prescribe required syllabus modules and filter schedule.
   - **Lecturer Schedule**: View assigned teaching sessions and venues.

4. **Campus Spatial Graph & Navigation (Dijkstra, BFS, DFS)**
   - Interactive 2D vector campus map showing buildings and pathways.
   - **Dijkstra's Algorithm**: Calculates shortest path, path sequence, and cumulative distance between any campus venues.
   - **BFS & DFS Traversal**: Visual order-of-visit tracking.
   - Campus graph Adjacency Matrix inspector.

5. **User Management & Role-Based Access Control (UserHashTable)**
   - Roles: `ADMIN`, `LECTURER`, and `STUDENT`.
   - Fast demo persona switcher and credential authentication.

---

## 🚀 Running the Applet

```bash
npm install
npm run dev
```

Runs on port 3000 at `0.0.0.0:3000`.

---

## 🖥️ Qt C++ Native Application (`/qt_project`)

The complete native C++ Qt application matching this UI/UX design with the floating bottom pill navbar, login dialog, custom vector 2D campus map with Dijkstra path rendering, and all CS3400 data structures is located in `/qt_project`.

### Build with CMake (Qt 5 or Qt 6)
```bash
cd qt_project
mkdir build && cd build
cmake ..
cmake --build .
./ProjectZero
```

### Build with qmake (Qt Creator)
```bash
cd qt_project
qmake ProjectZero.pro
make
./ProjectZero
```

### Qt Architecture Summary
- **Data Structures**: `LinkedList`, `HashTable` (Horner rolling hash), `Tree` (BST), `PriorityQueue` (Max-Heap), `Stack` (LIFO undo), `Graph` (Dijkstra, BFS, DFS), `TimetableBST`, `UserHashTable`.
- **UI & Views**:
  - `Theme.h`: Apple Human Interface Guidelines palette & QSS styling.
  - `LoginDialog`: Quick persona switcher and `UserHashTable` credential authentication.
  - `BottomNavBar`: Floating frosted-glass pill navbar docked at the bottom center.
  - `CampusMapWidget`: Custom `QPainter` 2D vector canvas rendering campus buildings, pathways, and highlighted Dijkstra routes.
  - `FacilitiesWidget`: Search benchmark ($O(N)$ vs $O(1)$), sorting algorithms, and undo deletion stack.
  - `ScheduleWidget`: Automated timetable engine and 5-day schedule matrix.
  - `RequestsWidget`: Urgency-driven Max-Heap priority queue processor.
  - `MainWindow`: Coordinates stacked widgets and floating bottom pill navigation.
