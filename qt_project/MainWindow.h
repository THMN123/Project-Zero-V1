#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>
#include <QStackedWidget>
#include "User.h"
#include "UserHashTable.h"
#include "LinkedList.h"
#include "HashTable.h"
#include "Stack.h"
#include "Tree.h"
#include "Graph.h"
#include "Timetable.h"
#include "PriorityQueue.h"
#include "BottomNavBar.h"

class MainWindow : public QMainWindow {
    Q_OBJECT

private:
    User currentUser;
    UserHashTable& userTable;
    LinkedList& resourcesList;
    HashTable& resourcesTable;
    UndoStack& undoStack;
    BST& resourcesTree;
    Graph& campusGraph;
    TimetableBST& timetableTree;
    PriorityQueue& priorityQueue;
    std::vector<Request>& standardQueue;

    QStackedWidget* stackedWidget;
    BottomNavBar* bottomNavBar;
    QLabel* userLabel;

public:
    MainWindow(User user, UserHashTable& uTable, LinkedList& rList, HashTable& rTable,
               UndoStack& uStack, BST& rTree, Graph& graph, TimetableBST& ttTree,
               PriorityQueue& pQueue, std::vector<Request>& sQueue, QWidget* parent = nullptr);

protected:
    void resizeEvent(QResizeEvent* event) override;

private slots:
    void handleSwitchPersona();
    void handleTabChanged(int index);
};

#endif // MAINWINDOW_H
