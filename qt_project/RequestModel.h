#ifndef REQUESTMODEL_H
#define REQUESTMODEL_H

#include <QAbstractListModel>
#include <vector>
#include "PriorityQueue.h"

class RequestModel : public QAbstractListModel {
    Q_OBJECT
    Q_PROPERTY(int pendingCount READ pendingCount NOTIFY countChanged)

public:
    enum RequestRoles {
        RequestIdRole = Qt::UserRole + 1,
        UserIdRole,
        ResourceIdRole,
        TimeRole,
        PriorityRole,
        StatusRole,
        UrgencyRole
    };

private:
    PriorityQueue& priorityQueue;
    std::vector<Request> currentRequests;

public:
    explicit RequestModel(PriorityQueue& pq, QObject* parent = nullptr);

    int rowCount(const QModelIndex& parent = QModelIndex()) const override;
    QVariant data(const QModelIndex& index, int role = Qt::DisplayRole) const override;
    QHash<int, QByteArray> roleNames() const override;

    int pendingCount() const;
    void refresh();

    Q_INVOKABLE void submitRequest(const QString& userId, const QString& resId, const QString& time, int priority);
    Q_INVOKABLE bool approveRoot();
    Q_INVOKABLE bool rejectRoot();

signals:
    void countChanged();
};

#endif // REQUESTMODEL_H
