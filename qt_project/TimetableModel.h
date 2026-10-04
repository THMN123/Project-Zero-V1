#ifndef TIMETABLEMODEL_H
#define TIMETABLEMODEL_H

#include <QAbstractListModel>
#include <vector>
#include "Timetable.h"

class TimetableModel : public QAbstractListModel {
    Q_OBJECT
    Q_PROPERTY(QString filterDay READ filterDay WRITE setFilterDay NOTIFY filterChanged)
    Q_PROPERTY(QString filterProgram READ filterProgram WRITE setFilterProgram NOTIFY filterChanged)
    Q_PROPERTY(QString filterLecturer READ filterLecturer WRITE setFilterLecturer NOTIFY filterChanged)
    Q_PROPERTY(int filterMode READ filterMode WRITE setFilterMode NOTIFY filterChanged)

public:
    enum TimetableRoles {
        CourseIdRole = Qt::UserRole + 1,
        CourseNameRole,
        ProgramRole,
        DayRole,
        TimeRole,
        RoomRole,
        LecturerIdRole
    };

private:
    TimetableBST& timetableTree;
    std::vector<TimetableEntry> displayedEntries;
    QString m_filterDay;
    QString m_filterProgram;
    QString m_filterLecturer;
    int m_filterMode; // 0: Student, 1: Master, 2: Lecturer

public:
    explicit TimetableModel(TimetableBST& tree, QObject* parent = nullptr);

    int rowCount(const QModelIndex& parent = QModelIndex()) const override;
    QVariant data(const QModelIndex& index, int role = Qt::DisplayRole) const override;
    QHash<int, QByteArray> roleNames() const override;

    QString filterDay() const { return m_filterDay; }
    QString filterProgram() const { return m_filterProgram; }
    QString filterLecturer() const { return m_filterLecturer; }
    int filterMode() const { return m_filterMode; }

    void setFilterDay(const QString& day);
    void setFilterProgram(const QString& prog);
    void setFilterLecturer(const QString& lec);
    void setFilterMode(int mode);

    void refresh();

    Q_INVOKABLE int autoGenerateSchedule();
    Q_INVOKABLE QVariantMap addSession(const QString& cid, const QString& cname, const QString& prog,
                                       const QString& day, const QString& start, const QString& end,
                                       const QString& room, const QString& lecId);

signals:
    void filterChanged();
};

#endif // TIMETABLEMODEL_H
