#include "Timetable.h"
#include <algorithm>

TimetableEntry::TimetableEntry() : courseID(""), courseName(""), program(""), dayOfWeek(""), startTime(""), endTime(""), room(""), lecturerID("") {}

TimetableEntry::TimetableEntry(std::string cid, std::string cname, std::string prog, std::string day,
                               std::string start, std::string end, std::string rm, std::string lec)
    : courseID(cid), courseName(cname), program(prog), dayOfWeek(day), startTime(start), endTime(end), room(rm), lecturerID(lec) {}

std::string TimetableEntry::getCourseID() const { return courseID; }
std::string TimetableEntry::getCourseName() const { return courseName; }
std::string TimetableEntry::getProgram() const { return program; }
std::string TimetableEntry::getDayOfWeek() const { return dayOfWeek; }
std::string TimetableEntry::getStartTime() const { return startTime; }
std::string TimetableEntry::getEndTime() const { return endTime; }
std::string TimetableEntry::getRoom() const { return room; }
std::string TimetableEntry::getLecturerID() const { return lecturerID; }

void TimetableEntry::setRoom(const std::string& r) { room = r; }
void TimetableEntry::setStartTime(const std::string& s) { startTime = s; }
void TimetableEntry::setEndTime(const std::string& e) { endTime = e; }

TimetableBST::TimetableBST() : root(nullptr) {}

TimetableBST::~TimetableBST() {
    clear();
}

void TimetableBST::clear() {
    destroyRec(root);
    root = nullptr;
}

void TimetableBST::destroyRec(TimetableNode* node) {
    if (node) {
        destroyRec(node->left);
        destroyRec(node->right);
        delete node;
    }
}

void TimetableBST::insert(const TimetableEntry& t) {
    root = insertRec(root, t);
}

TimetableNode* TimetableBST::insertRec(TimetableNode* node, const TimetableEntry& t) {
    if (!node) return new TimetableNode(t);
    std::string key = t.getProgram() + "_" + t.getCourseID() + "_" + t.getDayOfWeek() + "_" + t.getStartTime();
    std::string nodeKey = node->data.getProgram() + "_" + node->data.getCourseID() + "_" + node->data.getDayOfWeek() + "_" + node->data.getStartTime();

    if (key < nodeKey) {
        node->left = insertRec(node->left, t);
    } else {
        node->right = insertRec(node->right, t);
    }
    return node;
}

std::vector<TimetableEntry> TimetableBST::getAll() const {
    std::vector<TimetableEntry> list;
    inorderRec(root, list);
    return list;
}

void TimetableBST::inorderRec(TimetableNode* node, std::vector<TimetableEntry>& list) const {
    if (node) {
        inorderRec(node->left, list);
        list.push_back(node->data);
        inorderRec(node->right, list);
    }
}

bool TimetableBST::isConflict(const std::string& day, const std::string& start,
                              const std::string& room, const std::string& lecID, const std::string& progCohort) const {
    return checkConflictRec(root, day, start, room, lecID, progCohort);
}

bool TimetableBST::checkConflictRec(TimetableNode* node, const std::string& day, const std::string& start,
                                    const std::string& room, const std::string& lecID, const std::string& progCohort) const {
    if (!node) return false;
    if (node->data.getDayOfWeek() == day && node->data.getStartTime() == start) {
        if (node->data.getRoom() == room || node->data.getLecturerID() == lecID || node->data.getProgram() == progCohort) {
            return true;
        }
    }
    return checkConflictRec(node->left, day, start, room, lecID, progCohort) ||
           checkConflictRec(node->right, day, start, room, lecID, progCohort);
}

std::vector<TimetableEntry> TimetableBST::filterByDay(const std::string& day) const {
    auto all = getAll();
    std::vector<TimetableEntry> filtered;
    for (const auto& e : all) {
        if (e.getDayOfWeek() == day) filtered.push_back(e);
    }
    return filtered;
}

std::vector<TimetableEntry> TimetableBST::filterByLecturer(const std::string& lecID) const {
    auto all = getAll();
    std::vector<TimetableEntry> filtered;
    for (const auto& e : all) {
        if (e.getLecturerID() == lecID) filtered.push_back(e);
    }
    return filtered;
}

std::vector<TimetableEntry> TimetableBST::filterByProgram(const std::string& prog) const {
    auto all = getAll();
    std::vector<TimetableEntry> filtered;
    for (const auto& e : all) {
        if (e.getProgram() == prog) filtered.push_back(e);
    }
    return filtered;
}

std::vector<TimetableEntry> TimetableBST::filterByStudentModules(const std::string& prog, const std::vector<std::string>& moduleCodes) const {
    auto all = getAll();
    std::vector<TimetableEntry> filtered;
    for (const auto& e : all) {
        if (e.getProgram() == prog) {
            for (const auto& code : moduleCodes) {
                if (e.getCourseID() == code) {
                    filtered.push_back(e);
                    break;
                }
            }
        }
    }
    return filtered;
}

std::vector<ProgramInfo> getNULCatalogue() {
    return {
        {
            "b01", "BSc Information Systems", 4,
            {
                {"IS1501", "Introduction to Information Systems", 1, 1, "SCILT-101", "LEC_IS01"},
                {"CS1401", "Programming Fundamentals Principles", 1, 1, "CMP-LAB1", "LEC_CS01"},
                {"M111",   "Introductory Mathematics I",         1, 1, "SCILT-102", "LEC_MATH1"},
                {"IS1502", "Database Systems & Design",          1, 2, "SCILT-101", "LEC_IS02"},
                {"CS1402", "Object Oriented Programming I",      1, 2, "CMP-LAB1", "LEC_CS02"},
                {"IS2501", "Systems Analysis & Design",          2, 1, "SCILT-201", "LEC_IS01"},
                {"CS2401", "Data Structures & Algorithms",       2, 1, "CMP-LAB2", "LEC_CS01"},
                {"IS2502", "Web Systems & Development",          2, 2, "CMP-LAB2", "LEC_IS02"},
                {"CS2402", "Database Management Systems",        2, 2, "CMP-LAB1", "LEC_CS02"},
                {"IS3501", "IT Project Management",              3, 1, "SCILT-301", "LEC_IS03"},
                {"CS3401", "Operating Systems",                  3, 1, "CMP-LAB3", "LEC_CS03"}
            }
        },
        {
            "b02", "BSc Computer Science", 4,
            {
                {"CS1401", "Programming Fundamentals Principles", 1, 1, "CMP-LAB1", "LEC_CS01"},
                {"M111",   "Introductory Mathematics I",         1, 1, "SCILT-102", "LEC_MATH1"},
                {"P111",   "General Physics I",                  1, 1, "SCIENCE-L1", "LEC_PHYS1"},
                {"CS1402", "Object Oriented Programming I",      1, 2, "CMP-LAB1", "LEC_CS02"},
                {"CS2401", "Data Structures & Algorithms",       2, 1, "CMP-LAB2", "LEC_CS01"},
                {"CS2403", "Computer Architecture & Assembly",   2, 1, "CMP-103", "LEC_CS03"},
                {"CS2402", "Database Management Systems",        2, 2, "CMP-LAB1", "LEC_CS02"},
                {"CS3401", "Operating Systems",                  3, 1, "CMP-LAB3", "LEC_CS03"},
                {"CS3403", "Computer Networks & Protocols",      3, 1, "CMP-LAB2", "LEC_CS02"}
            }
        },
        {
            "b03", "BSc Biotechnology", 4,
            {
                {"B111", "Introductory Biology I", 1, 1, "SCIENCE-L2", "LEC_BIO1"},
                {"C111", "General Chemistry I",    1, 1, "SCIENCE-L1", "LEC_CHEM1"},
                {"B211", "Microbiology Fundamentals", 2, 1, "SCIENCE-L3", "LEC_BIO2"},
                {"C211", "Organic Chemistry I",    2, 1, "SCIENCE-L1", "LEC_CHEM2"}
            }
        },
        {
            "b04", "BBA Business Administration", 4,
            {
                {"BUS111", "Principles of Management", 1, 1, "SOC-101", "LEC_BUS1"},
                {"ACC111", "Financial Accounting I",   1, 1, "SOC-102", "LEC_ACC1"},
                {"ECO111", "Microeconomics I",         1, 1, "SOC-103", "LEC_ECO1"},
                {"BUS211", "Marketing Management",     2, 1, "SOC-201", "LEC_BUS2"}
            }
        },
        {
            "b05", "BEng Electronics Engineering", 5,
            {
                {"EG101", "Engineering Drawing & CAD", 1, 1, "ENG-LAB1", "LEC_ENG1"},
                {"M111",  "Introductory Mathematics I", 1, 1, "SCILT-102", "LEC_MATH1"},
                {"EG201", "Circuit Theory I",          2, 1, "ENG-LAB2", "LEC_ENG1"},
                {"EG301", "Digital Signal Processing", 3, 1, "ENG-LAB3", "LEC_ENG2"}
            }
        }
    };
}

std::string getProgramNameByCode(const std::string& code) {
    auto catalogue = getNULCatalogue();
    for (const auto& p : catalogue) {
        if (p.code == code || p.name == code) return p.name;
    }
    return code;
}

std::vector<ModuleInfo> getModulesForStudent(const std::string& progIdentifier, int year, int semester) {
    auto catalogue = getNULCatalogue();
    std::vector<ModuleInfo> results;
    for (const auto& p : catalogue) {
        if (p.code == progIdentifier || p.name == progIdentifier) {
            for (const auto& m : p.modules) {
                if (m.year == year && m.semester == semester) {
                    results.push_back(m);
                }
            }
            break;
        }
    }
    return results;
}

int generateMasterTimetable(TimetableBST& bst) {
    bst.clear();
    auto catalogue = getNULCatalogue();
    std::string days[] = {"Monday", "Tuesday", "Wednesday", "Thursday", "Friday"};
    std::string timeslots[] = {"08:00", "10:00", "12:00", "14:00", "16:00"};
    std::string endTimes[]  = {"10:00", "12:00", "14:00", "16:00", "18:00"};

    int totalInserted = 0;

    for (const auto& prog : catalogue) {
        for (const auto& mod : prog.modules) {
            bool scheduled = false;
            for (int d = 0; d < 5 && !scheduled; d++) {
                for (int t = 0; t < 5 && !scheduled; t++) {
                    std::string cohort = prog.name + " Yr" + std::to_string(mod.year);
                    if (!bst.isConflict(days[d], timeslots[t], mod.defaultRoom, mod.defaultLecturer, cohort)) {
                        TimetableEntry entry(mod.code, mod.name, prog.name, days[d], timeslots[t], endTimes[t], mod.defaultRoom, mod.defaultLecturer);
                        bst.insert(entry);
                        scheduled = true;
                        totalInserted++;
                    }
                }
            }
        }
    }
    return totalInserted;
}
