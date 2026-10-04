#ifndef REQUESTSWIDGET_H
#define REQUESTSWIDGET_H

#include <QWidget>
#include <QTableWidget>
#include <QPushButton>
#include <QLabel>
#include "PriorityQueue.h"
#include "User.h"
#include "LinkedList.h"

class RequestsWidget : public QWidget {
    Q_OBJECT

private:
    PriorityQueue& priorityQueue;
    std::vector<Request>& standardQueue;
    LinkedList& resourcesList;
    User& currentUser;

    QTableWidget* table;
    QPushButton* approveRootBtn;
    QPushButton* rejectRootBtn;

public:
    RequestsWidget(PriorityQueue& pq, std::vector<Request>& sq, LinkedList& rList, User& user, QWidget* parent = nullptr);

    void refreshTable();

private slots:
    void handleApproveRoot();
    void handleRejectRoot();
    void handleNewRequest();
};

#endif // REQUESTSWIDGET_H
