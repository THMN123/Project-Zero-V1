#include "FacilitiesWidget.h"
#include "Sorting.h"
#include <QVBoxLayout>
#include <QHBoxLayout>
#include <QHeaderView>
#include <QMessageBox>

FacilitiesWidget::FacilitiesWidget(LinkedList& list, HashTable& tableRef, UndoStack& uStack, BST& tree, User& user, QWidget* parent)
    : QWidget(parent), resourcesList(list), resourcesTable(tableRef), undoStack(uStack), resourcesTree(tree), currentUser(user) {

    QVBoxLayout* mainLayout = new QVBoxLayout(this);
    mainLayout->setContentsMargins(20, 20, 20, 80); // bottom margin for bottom pill navbar
    mainLayout->setSpacing(14);

    // Title & description
    QLabel* title = new QLabel("Campus Facilities", this);
    title->setStyleSheet("font-size: 20px; font-weight: 700; color: #1d1d1f;");
    mainLayout->addWidget(title);

    // Undo Banner
    QFrame* undoBanner = new QFrame(this);
    undoBanner->setStyleSheet("background-color: #fff9e6; border: 1px solid #ffe58f; border-radius: 12px;");
    QHBoxLayout* undoLayout = new QHBoxLayout(undoBanner);
    undoLayout->setContentsMargins(12, 8, 12, 8);

    undoStatusLabel = new QLabel("Deletion stack is currently empty.", undoBanner);
    undoStatusLabel->setStyleSheet("color: #874d00; font-size: 12px;");
    undoLayout->addWidget(undoStatusLabel);

    undoButton = new QPushButton("Undo Last Deletion", undoBanner);
    undoButton->setStyleSheet(
        "QPushButton { background: #faad14; color: #ffffff; border: none; border-radius: 14px; padding: 4px 12px; font-size: 11px; font-weight: 600; }"
        "QPushButton:hover { background: #d48806; }"
    );
    undoButton->setEnabled(false);
    connect(undoButton, &QPushButton::clicked, this, &FacilitiesWidget::handleUndo);
    undoLayout->addWidget(undoButton);

    mainLayout->addWidget(undoBanner);

    // Search Benchmark Bar
    QHBoxLayout* searchRow = new QHBoxLayout();
    searchInput = new QLineEdit(this);
    searchInput->setPlaceholderText("Benchmark Lookup: Enter Facility ID (e.g. LAB101)");
    searchInput->setStyleSheet("background: #ffffff; border: 1px solid #e5e5ea; border-radius: 10px; padding: 6px 12px; font-size: 12px;");
    searchRow->addWidget(searchInput);

    QPushButton* benchBtn = new QPushButton("Compare O(n) vs O(1)", this);
    benchBtn->setStyleSheet("background: #0071e3; color: white; border: none; border-radius: 14px; padding: 6px 14px; font-size: 11px; font-weight: 600;");
    connect(benchBtn, &QPushButton::clicked, this, &FacilitiesWidget::handleSearchBenchmark);
    searchRow->addWidget(benchBtn);

    QPushButton* sortQuickBtn = new QPushButton("QuickSort (by ID)", this);
    connect(sortQuickBtn, &QPushButton::clicked, this, &FacilitiesWidget::handleSortQuick);
    searchRow->addWidget(sortQuickBtn);

    QPushButton* sortBubbleBtn = new QPushButton("BubbleSort (by Cap)", this);
    connect(sortBubbleBtn, &QPushButton::clicked, this, &FacilitiesWidget::handleSortBubble);
    searchRow->addWidget(sortBubbleBtn);

    mainLayout->addLayout(searchRow);

    // Benchmark Result Label
    benchmarkLabel = new QLabel("", this);
    benchmarkLabel->setStyleSheet("font-size: 12px; color: #0071e3; font-weight: 500;");
    mainLayout->addWidget(benchmarkLabel);

    // Facilities Table
    table = new QTableWidget(this);
    table->setColumnCount(6);
    table->setHorizontalHeaderLabels({"Facility ID", "Name", "Type", "Location", "Capacity", "Status"});
    table->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    table->setSelectionBehavior(QAbstractItemView::SelectRows);
    table->setEditTriggers(QAbstractItemView::NoEditTriggers);
    table->setStyleSheet("background: #ffffff; border: 1px solid #e5e5ea; border-radius: 14px;");
    mainLayout->addWidget(table);

    // Bottom Action Row
    if (currentUser.getRole() == "ADMIN") {
        QHBoxLayout* adminRow = new QHBoxLayout();
        QPushButton* delBtn = new QPushButton("Delete Selected Facility", this);
        delBtn->setStyleSheet("background: #ffffff; color: #ff3b30; border: 1px solid #ff3b30; border-radius: 14px; padding: 6px 14px;");
        connect(delBtn, &QPushButton::clicked, this, &FacilitiesWidget::handleDeleteSelected);
        adminRow->addWidget(delBtn);
        adminRow->addStretch();
        mainLayout->addLayout(adminRow);
    }

    refreshTable();
    updateUndoState();
}

void FacilitiesWidget::refreshTable() {
    auto items = resourcesList.toVector();
    table->setRowCount(static_cast<int>(items.size()));

    for (int i = 0; i < static_cast<int>(items.size()); i++) {
        table->setItem(i, 0, new QTableWidgetItem(QString::fromStdString(items[i].getResourceID())));
        table->setItem(i, 1, new QTableWidgetItem(QString::fromStdString(items[i].getName())));
        table->setItem(i, 2, new QTableWidgetItem(QString::fromStdString(items[i].getType())));
        table->setItem(i, 3, new QTableWidgetItem(QString::fromStdString(items[i].getLocation())));
        table->setItem(i, 4, new QTableWidgetItem(QString::number(items[i].getCapacity()) + " seats"));
        table->setItem(i, 5, new QTableWidgetItem(QString::fromStdString(items[i].getStatus())));
    }
}

void FacilitiesWidget::updateUndoState() {
    if (undoStack.isEmpty()) {
        undoStatusLabel->setText("Deletion stack is currently empty.");
        undoButton->setEnabled(false);
    } else {
        Resource top;
        undoStack.peek(top);
        undoStatusLabel->setText(QString("Undo available: %1 (%2)").arg(QString::fromStdString(top.getResourceID()), QString::fromStdString(top.getName())));
        undoButton->setEnabled(true);
    }
}

void FacilitiesWidget::handleSearchBenchmark() {
    std::string key = searchInput->text().trimmed().toStdString();
    if (key.empty()) return;

    int llSteps = 0;
    Resource* r1 = resourcesList.searchResource(key, llSteps);

    int htSteps = 0, bucket = 0;
    Resource* r2 = resourcesTable.search(key, htSteps, bucket);

    if (r2) {
        benchmarkLabel->setText(
            QString("Benchmark Result for '%1': Linked List took %2 linear step(s). Hash Table took %3 step(s) (Bucket #%4).")
                .arg(QString::fromStdString(key))
                .arg(llSteps)
                .arg(htSteps)
                .arg(bucket)
        );
    } else {
        benchmarkLabel->setText(QString("Resource '%1' was not found in registry.").arg(QString::fromStdString(key)));
    }
}

void FacilitiesWidget::handleSortQuick() {
    auto items = resourcesList.toVector();
    SortReport report = Sorter::quickSort(items);

    table->setRowCount(static_cast<int>(report.sortedList.size()));
    for (int i = 0; i < static_cast<int>(report.sortedList.size()); i++) {
        table->setItem(i, 0, new QTableWidgetItem(QString::fromStdString(report.sortedList[i].getResourceID())));
        table->setItem(i, 1, new QTableWidgetItem(QString::fromStdString(report.sortedList[i].getName())));
        table->setItem(i, 2, new QTableWidgetItem(QString::fromStdString(report.sortedList[i].getType())));
        table->setItem(i, 3, new QTableWidgetItem(QString::fromStdString(report.sortedList[i].getLocation())));
        table->setItem(i, 4, new QTableWidgetItem(QString::number(report.sortedList[i].getCapacity())));
        table->setItem(i, 5, new QTableWidgetItem(QString::fromStdString(report.sortedList[i].getStatus())));
    }
    benchmarkLabel->setText(QString("QuickSort: %1 comparisons, %2 swaps in %3 ms")
        .arg(report.comparisons).arg(report.swaps).arg(report.durationMs, 0, 'f', 3));
}

void FacilitiesWidget::handleSortBubble() {
    auto items = resourcesList.toVector();
    SortReport report = Sorter::bubbleSort(items);

    table->setRowCount(static_cast<int>(report.sortedList.size()));
    for (int i = 0; i < static_cast<int>(report.sortedList.size()); i++) {
        table->setItem(i, 0, new QTableWidgetItem(QString::fromStdString(report.sortedList[i].getResourceID())));
        table->setItem(i, 1, new QTableWidgetItem(QString::fromStdString(report.sortedList[i].getName())));
        table->setItem(i, 2, new QTableWidgetItem(QString::fromStdString(report.sortedList[i].getType())));
        table->setItem(i, 3, new QTableWidgetItem(QString::fromStdString(report.sortedList[i].getLocation())));
        table->setItem(i, 4, new QTableWidgetItem(QString::number(report.sortedList[i].getCapacity())));
        table->setItem(i, 5, new QTableWidgetItem(QString::fromStdString(report.sortedList[i].getStatus())));
    }
    benchmarkLabel->setText(QString("BubbleSort: %1 comparisons, %2 swaps in %3 ms")
        .arg(report.comparisons).arg(report.swaps).arg(report.durationMs, 0, 'f', 3));
}

void FacilitiesWidget::handleDeleteSelected() {
    int row = table->currentRow();
    if (row < 0) return;

    std::string id = table->item(row, 0)->text().toStdString();
    Resource* target = resourcesList.searchResource(id);
    if (target) {
        undoStack.push(*target);
        resourcesList.deleteResource(id);
        resourcesTable.remove(id);
        refreshTable();
        updateUndoState();
    }
}

void FacilitiesWidget::handleUndo() {
    Resource restored;
    if (undoStack.pop(restored)) {
        resourcesList.insertAtEnd(restored);
        resourcesTable.insert(restored.getResourceID(), restored);
        resourcesTree.insert(restored);
        refreshTable();
        updateUndoState();
    }
}
