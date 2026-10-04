#include "MainWindow.h"
#include "Theme.h"
#include "FacilitiesWidget.h"
#include "ScheduleWidget.h"
#include "CampusMapWidget.h"
#include "RequestsWidget.h"
#include "LoginDialog.h"
#include <QVBoxLayout>
#include <QHBoxLayout>
#include <QLabel>
#include <QPushButton>
#include <QFrame>

MainWindow::MainWindow(User user, UserHashTable& uTable, LinkedList& rList, HashTable& rTable,
                       UndoStack& uStack, BST& rTree, Graph& graph, TimetableBST& ttTree,
                       PriorityQueue& pQueue, std::vector<Request>& sQueue, QWidget* parent)
    : QMainWindow(parent), currentUser(user), userTable(uTable), resourcesList(rList), resourcesTable(rTable),
      undoStack(uStack), resourcesTree(rTree), campusGraph(graph), timetableTree(ttTree),
      priorityQueue(pQueue), standardQueue(sQueue) {

    setWindowTitle("Project Zero - NUL Campus Management System");
    resize(960, 680);
    setStyleSheet(AppleTheme::getGlobalStyleSheet());

    QWidget* central = new QWidget(this);
    QVBoxLayout* rootLayout = new QVBoxLayout(central);
    rootLayout->setContentsMargins(0, 0, 0, 0);
    rootLayout->setSpacing(0);

    // Top Header Bar
    QFrame* header = new QFrame(central);
    header->setFixedHeight(54);
    header->setStyleSheet("background-color: #fbfbfd; border-bottom: 1px solid #e5e5ea;");
    QHBoxLayout* headerLayout = new QHBoxLayout(header);
    headerLayout->setContentsMargins(20, 0, 20, 0);

    QLabel* brand = new QLabel("Project Zero · NUL Campus", header);
    brand->setStyleSheet("font-size: 14px; font-weight: 700; color: #1d1d1f;");
    headerLayout->addWidget(brand);
    headerLayout->addStretch();

    userLabel = new QLabel(QString("%1 · %2").arg(QString::fromStdString(currentUser.getFullName()), QString::fromStdString(currentUser.getRole())), header);
    userLabel->setStyleSheet("font-size: 12px; font-weight: 600; color: #86868b;");
    headerLayout->addWidget(userLabel);

    QPushButton* switchBtn = new QPushButton("Switch Persona", header);
    switchBtn->setStyleSheet("background: #ffffff; border: 1px solid #e5e5ea; border-radius: 12px; padding: 4px 10px; font-size: 11px;");
    connect(switchBtn, &QPushButton::clicked, this, &MainWindow::handleSwitchPersona);
    headerLayout->addWidget(switchBtn);

    rootLayout->addWidget(header);

    // Stacked Widget for screens
    stackedWidget = new QStackedWidget(central);
    stackedWidget->addWidget(new FacilitiesWidget(resourcesList, resourcesTable, undoStack, resourcesTree, currentUser, stackedWidget));
    stackedWidget->addWidget(new ScheduleWidget(timetableTree, currentUser, stackedWidget));
    stackedWidget->addWidget(new CampusMapWidget(campusGraph, currentUser, stackedWidget));
    stackedWidget->addWidget(new RequestsWidget(priorityQueue, standardQueue, resourcesList, currentUser, stackedWidget));

    // More Screen Widget
    QWidget* moreWidget = new QWidget(stackedWidget);
    QVBoxLayout* moreLayout = new QVBoxLayout(moreWidget);
    moreLayout->setContentsMargins(20, 20, 20, 80);
    QLabel* moreTitle = new QLabel("NUL Catalogue & System Architecture", moreWidget);
    moreTitle->setStyleSheet("font-size: 20px; font-weight: 700; color: #1d1d1f;");
    moreLayout->addWidget(moreTitle);

    QLabel* moreDesc = new QLabel(
        "Project Zero integrates 6 fundamental data structures for the National University of Lesotho:\n\n"
        "• Singly Linked List: Dynamic facility records maintenance\n"
        "• Direct Hash Table: O(1) Horner polynomial hash function for facility lookup\n"
        "• Binary Search Tree (BST): Alphanumeric ordering & Master Timetable indexing\n"
        "• Binary Max-Heap: Real-time urgency priority queue processing\n"
        "• LIFO Undo Stack: Reversible administrative facility deletion history\n"
        "• Spatial Graph: Adjacency Matrix with Dijkstra shortest path calculation",
        moreWidget
    );
    moreDesc->setStyleSheet("font-size: 13px; color: #1d1d1f; line-height: 1.6;");
    moreLayout->addWidget(moreDesc);
    moreLayout->addStretch();
    stackedWidget->addWidget(moreWidget);

    rootLayout->addWidget(stackedWidget);
    setCentralWidget(central);

    // Floating Bottom Pill Navbar
    bottomNavBar = new BottomNavBar(central);
    connect(bottomNavBar, &BottomNavBar::tabChanged, this, &MainWindow::handleTabChanged);
}

void MainWindow::resizeEvent(QResizeEvent* /*event*/) {
    // Keep bottom navbar centered at bottom
    int navWidth = qMin(480, width() - 40);
    int x = (width() - navWidth) / 2;
    int y = height() - 70;
    bottomNavBar->setGeometry(x, y, navWidth, 54);
    bottomNavBar->raise();
}

void MainWindow::handleTabChanged(int index) {
    stackedWidget->setCurrentIndex(index);
}

void MainWindow::handleSwitchPersona() {
    LoginDialog dlg(userTable, this);
    if (dlg.exec() == QDialog::Accepted) {
        currentUser = dlg.getLoggedInUser();
        userLabel->setText(QString("%1 · %2").arg(QString::fromStdString(currentUser.getFullName()), QString::fromStdString(currentUser.getRole())));
    }
}
