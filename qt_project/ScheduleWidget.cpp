#include "ScheduleWidget.h"
#include <QVBoxLayout>
#include <QHBoxLayout>
#include <QHeaderView>
#include <QMessageBox>

ScheduleWidget::ScheduleWidget(TimetableBST& tt, User& user, QWidget* parent)
    : QWidget(parent), timetable(tt), currentUser(user) {

    QVBoxLayout* mainLayout = new QVBoxLayout(this);
    mainLayout->setContentsMargins(20, 20, 20, 80);
    mainLayout->setSpacing(12);

    QLabel* title = new QLabel("Academic Timetable & BST Engine", this);
    title->setStyleSheet("font-size: 20px; font-weight: 700; color: #1d1d1f;");
    mainLayout->addWidget(title);

    // Controls Row
    QHBoxLayout* controlsRow = new QHBoxLayout();

    QLabel* modeLabel = new QLabel("View Mode:", this);
    modeLabel->setStyleSheet("font-size: 12px; font-weight: 600; color: #86868b;");
    controlsRow->addWidget(modeLabel);

    viewModeCombo = new QComboBox(this);
    viewModeCombo->addItem("My Personal Syllabus (Student)");
    viewModeCombo->addItem("Master Timetable (All Faculties)");
    viewModeCombo->addItem("Lecturer Schedule");
    controlsRow->addWidget(viewModeCombo);

    QLabel* dayLabel = new QLabel("Day:", this);
    dayLabel->setStyleSheet("font-size: 12px; font-weight: 600; color: #86868b;");
    controlsRow->addWidget(dayLabel);

    dayCombo = new QComboBox(this);
    dayCombo->addItem("All Days");
    dayCombo->addItem("Monday");
    dayCombo->addItem("Tuesday");
    dayCombo->addItem("Wednesday");
    dayCombo->addItem("Thursday");
    dayCombo->addItem("Friday");
    controlsRow->addWidget(dayCombo);

    if (currentUser.getRole() == "ADMIN") {
        QPushButton* engineBtn = new QPushButton("Auto-Generate Engine", this);
        engineBtn->setStyleSheet("background: #0071e3; color: white; border: none; border-radius: 14px; padding: 6px 14px; font-size: 11px; font-weight: 600;");
        connect(engineBtn, &QPushButton::clicked, this, &ScheduleWidget::handleGenerateEngine);
        controlsRow->addWidget(engineBtn);
    }

    controlsRow->addStretch();
    mainLayout->addLayout(controlsRow);

    infoLabel = new QLabel(this);
    infoLabel->setStyleSheet("color: #86868b; font-size: 12px;");
    mainLayout->addWidget(infoLabel);

    // Schedule Table
    table = new QTableWidget(this);
    table->setColumnCount(7);
    table->setHorizontalHeaderLabels({"Course Code", "Course Title", "Degree Program", "Day", "Time", "Venue", "Lecturer"});
    table->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    table->setSelectionBehavior(QAbstractItemView::SelectRows);
    table->setEditTriggers(QAbstractItemView::NoEditTriggers);
    table->setStyleSheet("background: #ffffff; border: 1px solid #e5e5ea; border-radius: 14px;");
    mainLayout->addWidget(table);

    connect(viewModeCombo, QOverload<int>::of(&QComboBox::currentIndexChanged), this, &ScheduleWidget::handleViewModeChanged);
    connect(dayCombo, QOverload<int>::of(&QComboBox::currentIndexChanged), this, &ScheduleWidget::handleDayChanged);

    refreshSchedule();
}

void ScheduleWidget::handleViewModeChanged(int /*idx*/) {
    refreshSchedule();
}

void ScheduleWidget::handleDayChanged(int /*idx*/) {
    refreshSchedule();
}

void ScheduleWidget::handleGenerateEngine() {
    int count = generateMasterTimetable(timetable);
    refreshSchedule();
    QMessageBox::information(this, "Master Engine", QString("Successfully scheduled %1 conflict-free entries across all faculties.").arg(count));
}

void ScheduleWidget::refreshSchedule() {
    std::vector<TimetableEntry> entries;
    int mode = viewModeCombo->currentIndex();

    if (mode == 0) { // Student personal
        std::string prog = currentUser.getProgram();
        if (prog.empty()) prog = "BSc Information Systems";
        auto mods = getModulesForStudent(prog, 1, 1);
        std::vector<std::string> codes;
        for (const auto& m : mods) codes.push_back(m.code);
        entries = timetable.filterByStudentModules(prog, codes);
        infoLabel->setText(QString("Displaying prescribed syllabus modules for %1 (Year 1, Semester 1)").arg(QString::fromStdString(prog)));
    } else if (mode == 1) { // Master
        entries = timetable.getAll();
        infoLabel->setText("Displaying master schedule across all NUL departments");
    } else { // Lecturer
        std::string lec = currentUser.getUserID();
        if (currentUser.getRole() != "LECTURER") lec = "LEC_CS01";
        entries = timetable.filterByLecturer(lec);
        infoLabel->setText(QString("Displaying teaching schedule for %1").arg(QString::fromStdString(lec)));
    }

    std::string dayFilter = dayCombo->currentText().toStdString();
    if (dayFilter != "All Days") {
        std::vector<TimetableEntry> filtered;
        for (const auto& e : entries) {
            if (e.getDayOfWeek() == dayFilter) filtered.push_back(e);
        }
        entries = filtered;
    }

    table->setRowCount(static_cast<int>(entries.size()));
    for (int i = 0; i < static_cast<int>(entries.size()); i++) {
        table->setItem(i, 0, new QTableWidgetItem(QString::fromStdString(entries[i].getCourseID())));
        table->setItem(i, 1, new QTableWidgetItem(QString::fromStdString(entries[i].getCourseName())));
        table->setItem(i, 2, new QTableWidgetItem(QString::fromStdString(entries[i].getProgram())));
        table->setItem(i, 3, new QTableWidgetItem(QString::fromStdString(entries[i].getDayOfWeek())));
        table->setItem(i, 4, new QTableWidgetItem(QString::fromStdString(entries[i].getStartTime() + " - " + entries[i].getEndTime())));
        table->setItem(i, 5, new QTableWidgetItem(QString::fromStdString(entries[i].getRoom())));
        table->setItem(i, 6, new QTableWidgetItem(QString::fromStdString(entries[i].getLecturerID())));
    }
}
