#ifndef SCHEDULEWIDGET_H
#define SCHEDULEWIDGET_H

#include <QWidget>
#include <QTableWidget>
#include <QComboBox>
#include <QPushButton>
#include <QLabel>
#include "Timetable.h"
#include "User.h"

class ScheduleWidget : public QWidget {
    Q_OBJECT

private:
    TimetableBST& timetable;
    User& currentUser;

    QComboBox* viewModeCombo;
    QComboBox* dayCombo;
    QTableWidget* table;
    QLabel* infoLabel;

public:
    ScheduleWidget(TimetableBST& tt, User& user, QWidget* parent = nullptr);

    void refreshSchedule();

private slots:
    void handleViewModeChanged(int idx);
    void handleDayChanged(int idx);
    void handleGenerateEngine();
};

#endif // SCHEDULEWIDGET_H
