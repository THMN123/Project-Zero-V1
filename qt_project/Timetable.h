#ifndef TIMETABLE_H
#define TIMETABLE_H

#include <string>
#include <vector>

struct ModuleInfo {
    std::string code;
    std::string name;
    int year;
    int semester;
    std::string defaultRoom;
    std::string defaultLecturer;
};

struct ProgramInfo {
    std::string code;
    std::string name;
    int durationYears;
    std::vector<ModuleInfo> modules;
};

class TimetableEntry {
private:
    std::string courseID;
    std::string courseName;
    std::string program;
    std::string dayOfWeek;
    std::string startTime;
    std::string endTime;
    std::string room;
    std::string lecturerID;

public:
    TimetableEntry();
    TimetableEntry(std::string cid, std::string cname, std::string prog, std::string day,
                   std::string start, std::string end, std::string rm, std::string lec);

    std::string getCourseID() const;
    std::string getCourseName() const;
    std::string getProgram() const;
    std::string getDayOfWeek() const;
    std::string getStartTime() const;
    std::string getEndTime() const;
    std::string getRoom() const;
    std::string getLecturerID() const;

    void setRoom(const std::string& r);
    void setStartTime(const std::string& s);
    void setEndTime(const std::string& e);
};

struct TimetableNode {
    TimetableEntry data;
    TimetableNode* left;
    TimetableNode* right;
    TimetableNode(TimetableEntry val) : data(val), left(nullptr), right(nullptr) {}
};

class TimetableBST {
private:
    TimetableNode* root;

    TimetableNode* insertRec(TimetableNode* node, const TimetableEntry& t);
    void inorderRec(TimetableNode* node, std::vector<TimetableEntry>& list) const;
    void destroyRec(TimetableNode* node);
    bool checkConflictRec(TimetableNode* node, const std::string& day, const std::string& start,
                           const std::string& room, const std::string& lecID, const std::string& progCohort) const;

public:
    TimetableBST();
    ~TimetableBST();

    void insert(const TimetableEntry& t);
    bool isConflict(const std::string& day, const std::string& start,
                    const std::string& room, const std::string& lecID, const std::string& progCohort) const;
    std::vector<TimetableEntry> getAll() const;
    std::vector<TimetableEntry> filterByDay(const std::string& day) const;
    std::vector<TimetableEntry> filterByLecturer(const std::string& lecID) const;
    std::vector<TimetableEntry> filterByProgram(const std::string& prog) const;
    std::vector<TimetableEntry> filterByStudentModules(const std::string& prog, const std::vector<std::string>& moduleCodes) const;
    void clear();
};

// NUL Catalogue and Master Timetable Generator Helpers
std::vector<ProgramInfo> getNULCatalogue();
std::string getProgramNameByCode(const std::string& code);
std::vector<ModuleInfo> getModulesForStudent(const std::string& progIdentifier, int year, int semester);
int generateMasterTimetable(TimetableBST& bst);

#endif // TIMETABLE_H
