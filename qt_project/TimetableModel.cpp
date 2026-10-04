#include "TimetableModel.h"

TimetableModel::TimetableModel(TimetableBST& tree, QObject* parent)
    : QAbstractListModel(parent), timetableTree(tree), m_filterDay("Monday"),
      m_filterProgram("BSc Information Systems"), m_filterLecturer("LEC_CS01"), m_filterMode(0) {
    refresh();
}

int TimetableModel::rowCount(const QModelIndex& parent) const {
    if (parent.isValid()) return 0;
    return static_cast<int>(displayedEntries.size());
}

QVariant TimetableModel::data(const QModelIndex& index, int role) const {
    if (!index.isValid() || index.row() < 0 || index.row() >= static_cast<int>(displayedEntries.size()))
        return QVariant();

    const auto& e = displayedEntries[index.row()];
    switch (role) {
        case CourseIdRole: return QString::fromStdString(e.getCourseID());
        case CourseNameRole: return QString::fromStdString(e.getCourseName());
        case ProgramRole: return QString::fromStdString(e.getProgram());
        case DayRole: return QString::fromStdString(e.getDayOfWeek());
        case TimeRole: return QString::fromStdString(e.getStartTime() + " - " + e.getEndTime());
        case RoomRole: return QString::fromStdString(e.getRoom());
        case LecturerIdRole: return QString::fromStdString(e.getLecturerID());
        default: return QVariant();
    }
}

QHash<int, QByteArray> TimetableModel::roleNames() const {
    QHash<int, QByteArray> roles;
    roles[CourseIdRole] = "courseId";
    roles[CourseNameRole] = "courseName";
    roles[ProgramRole] = "program";
    roles[DayRole] = "day";
    roles[TimeRole] = "time";
    roles[RoomRole] = "room";
    roles[LecturerIdRole] = "lecturerId";
    return roles;
}

void TimetableModel::setFilterDay(const QString& day) {
    if (m_filterDay != day) {
        m_filterDay = day;
        refresh();
        emit filterChanged();
    }
}

void TimetableModel::setFilterProgram(const QString& prog) {
    if (m_filterProgram != prog) {
        m_filterProgram = prog;
        refresh();
        emit filterChanged();
    }
}

void TimetableModel::setFilterLecturer(const QString& lec) {
    if (m_filterLecturer != lec) {
        m_filterLecturer = lec;
        refresh();
        emit filterChanged();
    }
}

void TimetableModel::setFilterMode(int mode) {
    if (m_filterMode != mode) {
        m_filterMode = mode;
        refresh();
        emit filterChanged();
    }
}

void TimetableModel::refresh() {
    beginResetModel();
    std::vector<TimetableEntry> entries;

    if (m_filterMode == 0) { // Student personal
        auto mods = getModulesForStudent(m_filterProgram.toStdString(), 1, 1);
        std::vector<std::string> codes;
        for (const auto& m : mods) codes.push_back(m.code);
        entries = timetableTree.filterByStudentModules(m_filterProgram.toStdString(), codes);
    } else if (m_filterMode == 1) { // Master
        entries = timetableTree.getAll();
    } else { // Lecturer
        entries = timetableTree.filterByLecturer(m_filterLecturer.toStdString());
    }

    if (m_filterDay != "All" && !m_filterDay.isEmpty()) {
        std::vector<TimetableEntry> filtered;
        for (const auto& e : entries) {
            if (e.getDayOfWeek() == m_filterDay.toStdString()) {
                filtered.push_back(e);
            }
        }
        entries = filtered;
    }

    displayedEntries = entries;
    endResetModel();
}

int TimetableModel::autoGenerateSchedule() {
    int count = generateMasterTimetable(timetableTree);
    refresh();
    return count;
}

QVariantMap TimetableModel::addSession(const QString& cid, const QString& cname, const QString& prog,
                                      const QString& day, const QString& start, const QString& end,
                                      const QString& room, const QString& lecId) {
    QVariantMap res;
    bool conflict = timetableTree.isConflict(day.toStdString(), start.toStdString(),
                                             room.toStdString(), lecId.toStdString(), prog.toStdString());
    if (conflict) {
        res["success"] = false;
        res["message"] = "Scheduling conflict detected (venue, lecturer or student cohort clash).";
        return res;
    }

    TimetableEntry entry(cid.toStdString(), cname.toStdString(), prog.toStdString(),
                         day.toStdString(), start.toStdString(), end.toStdString(),
                         room.toStdString(), lecId.toStdString());
    timetableTree.insert(entry);
    refresh();
    res["success"] = true;
    res["message"] = "Session successfully scheduled.";
    return res;
}
