#ifndef FACILITIESWIDGET_H
#define FACILITIESWIDGET_H

#include <QWidget>
#include <QTableWidget>
#include <QLineEdit>
#include <QLabel>
#include <QPushButton>
#include "LinkedList.h"
#include "HashTable.h"
#include "Stack.h"
#include "Tree.h"
#include "User.h"

class FacilitiesWidget : public QWidget {
    Q_OBJECT

private:
    LinkedList& resourcesList;
    HashTable& resourcesTable;
    UndoStack& undoStack;
    BST& resourcesTree;
    User& currentUser;

    QTableWidget* table;
    QLineEdit* searchInput;
    QLabel* benchmarkLabel;
    QLabel* undoStatusLabel;
    QPushButton* undoButton;

public:
    FacilitiesWidget(LinkedList& list, HashTable& table, UndoStack& uStack, BST& tree, User& user, QWidget* parent = nullptr);

    void refreshTable();
    void updateUndoState();

private slots:
    void handleSearchBenchmark();
    void handleSortQuick();
    void handleSortBubble();
    void handleUndo();
    void handleDeleteSelected();
};

#endif // FACILITIESWIDGET_H
