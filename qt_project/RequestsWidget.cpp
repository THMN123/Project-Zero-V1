#include "RequestsWidget.h"
#include <QVBoxLayout>
#include <QHBoxLayout>
#include <QHeaderView>
#include <QDialog>
#include <QLineEdit>
#include <QComboBox>
#include <QMessageBox>

RequestsWidget::RequestsWidget(PriorityQueue& pq, std::vector<Request>& sq, LinkedList& rList, User& user, QWidget* parent)
    : QWidget(parent), priorityQueue(pq), standardQueue(sq), resourcesList(rList), currentUser(user) {

    QVBoxLayout* mainLayout = new QVBoxLayout(this);
    mainLayout->setContentsMargins(20, 20, 20, 80);
    mainLayout->setSpacing(12);

    QLabel* title = new QLabel("Booking Requests & Priority Queue", this);
    title->setStyleSheet("font-size: 20px; font-weight: 700; color: #1d1d1f;");
    mainLayout->addWidget(title);

    // Controls Row
    QHBoxLayout* controlsRow = new QHBoxLayout();

    if (currentUser.getRole() == "ADMIN") {
        approveRootBtn = new QPushButton("Approve Highest Priority (Heap Root)", this);
        approveRootBtn->setStyleSheet("background: #34c759; color: white; border: none; border-radius: 14px; padding: 6px 14px; font-size: 11px; font-weight: 600;");
        connect(approveRootBtn, &QPushButton::clicked, this, &RequestsWidget::handleApproveRoot);
        controlsRow->addWidget(approveRootBtn);

        rejectRootBtn = new QPushButton("Reject Heap Root", this);
        rejectRootBtn->setStyleSheet("background: #ffffff; color: #ff3b30; border: 1px solid #ff3b30; border-radius: 14px; padding: 6px 14px; font-size: 11px; font-weight: 600;");
        connect(rejectRootBtn, &QPushButton::clicked, this, &RequestsWidget::handleRejectRoot);
        controlsRow->addWidget(rejectRootBtn);
    }

    QPushButton* newReqBtn = new QPushButton("+ Submit Request", this);
    newReqBtn->setStyleSheet("background: #0071e3; color: white; border: none; border-radius: 14px; padding: 6px 14px; font-size: 11px; font-weight: 600;");
    connect(newReqBtn, &QPushButton::clicked, this, &RequestsWidget::handleNewRequest);
    controlsRow->addWidget(newReqBtn);

    controlsRow->addStretch();
    mainLayout->addLayout(controlsRow);

    // Table
    table = new QTableWidget(this);
    table->setColumnCount(6);
    table->setHorizontalHeaderLabels({"Request ID", "User ID", "Facility Requested", "Timeslot", "Priority", "Status"});
    table->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    table->setSelectionBehavior(QAbstractItemView::SelectRows);
    table->setEditTriggers(QAbstractItemView::NoEditTriggers);
    table->setStyleSheet("background: #ffffff; border: 1px solid #e5e5ea; border-radius: 14px;");
    mainLayout->addWidget(table);

    refreshTable();
}

void RequestsWidget::refreshTable() {
    auto items = priorityQueue.toVector();
    table->setRowCount(static_cast<int>(items.size()));

    for (int i = 0; i < static_cast<int>(items.size()); i++) {
        table->setItem(i, 0, new QTableWidgetItem(QString::fromStdString(items[i].getRequestID())));
        table->setItem(i, 1, new QTableWidgetItem(QString::fromStdString(items[i].getUserID())));
        table->setItem(i, 2, new QTableWidgetItem(QString::fromStdString(items[i].getResourceID())));
        table->setItem(i, 3, new QTableWidgetItem(QString::fromStdString(items[i].getRequestTime())));

        int p = items[i].getPriority();
        QString pStr = (p == 4) ? "Level 4 (Emergency)" : (p == 3) ? "Level 3 (High)" : (p == 2) ? "Level 2 (Normal)" : "Level 1 (Low)";
        table->setItem(i, 4, new QTableWidgetItem(pStr));
        table->setItem(i, 5, new QTableWidgetItem(QString::fromStdString(items[i].getStatus())));
    }
}

void RequestsWidget::handleApproveRoot() {
    Request req;
    if (priorityQueue.dequeue(req)) {
        req.setStatus("Approved");
        refreshTable();
        QMessageBox::information(this, "Request Processed", QString("Approved request %1 for %2.").arg(QString::fromStdString(req.getRequestID()), QString::fromStdString(req.getResourceID())));
    }
}

void RequestsWidget::handleRejectRoot() {
    Request req;
    if (priorityQueue.dequeue(req)) {
        req.setStatus("Rejected");
        refreshTable();
        QMessageBox::information(this, "Request Processed", QString("Rejected request %1.").arg(QString::fromStdString(req.getRequestID())));
    }
}

void RequestsWidget::handleNewRequest() {
    QDialog dialog(this);
    dialog.setWindowTitle("New Booking Request");
    dialog.setFixedSize(320, 280);

    QVBoxLayout* layout = new QVBoxLayout(&dialog);
    layout->setSpacing(10);

    QComboBox* resCombo = new QComboBox(&dialog);
    auto resList = resourcesList.toVector();
    for (const auto& r : resList) {
        resCombo->addItem(QString::fromStdString(r.getResourceID() + " (" + r.getName() + ")"), QString::fromStdString(r.getResourceID()));
    }
    layout->addWidget(new QLabel("Select Facility:", &dialog));
    layout->addWidget(resCombo);

    QComboBox* timeCombo = new QComboBox(&dialog);
    timeCombo->addItem("08:00 - 10:00");
    timeCombo->addItem("10:00 - 12:00");
    timeCombo->addItem("12:00 - 14:00");
    timeCombo->addItem("14:00 - 16:00");
    timeCombo->addItem("16:00 - 18:00");
    layout->addWidget(new QLabel("Timeslot:", &dialog));
    layout->addWidget(timeCombo);

    QComboBox* prioCombo = new QComboBox(&dialog);
    prioCombo->addItem("Level 1 (Low)", 1);
    prioCombo->addItem("Level 2 (Normal)", 2);
    prioCombo->addItem("Level 3 (High)", 3);
    prioCombo->addItem("Level 4 (Emergency)", 4);
    prioCombo->setCurrentIndex(1);
    layout->addWidget(new QLabel("Urgency Priority:", &dialog));
    layout->addWidget(prioCombo);

    QPushButton* submit = new QPushButton("Submit", &dialog);
    submit->setStyleSheet("background: #0071e3; color: white; border-radius: 12px; padding: 6px;");
    connect(submit, &QPushButton::clicked, [&]() {
        static int counter = 200;
        std::string reqId = "REQ-" + std::to_string(counter++);
        std::string resId = resCombo->currentData().toString().toStdString();
        std::string time = timeCombo->currentText().toStdString();
        int prio = prioCombo->currentData().toInt();

        Request newReq(reqId, currentUser.getUserID(), resId, time, "Pending", prio);
        priorityQueue.enqueue(newReq);
        dialog.accept();
    });
    layout->addWidget(submit);

    if (dialog.exec() == QDialog::Accepted) {
        refreshTable();
    }
}
