#include "RequestModel.h"

RequestModel::RequestModel(PriorityQueue& pq, QObject* parent)
    : QAbstractListModel(parent), priorityQueue(pq) {
    refresh();
}

int RequestModel::rowCount(const QModelIndex& parent) const {
    if (parent.isValid()) return 0;
    return static_cast<int>(currentRequests.size());
}

QVariant RequestModel::data(const QModelIndex& index, int role) const {
    if (!index.isValid() || index.row() < 0 || index.row() >= static_cast<int>(currentRequests.size()))
        return QVariant();

    const auto& r = currentRequests[index.row()];
    switch (role) {
        case RequestIdRole: return QString::fromStdString(r.getRequestID());
        case UserIdRole: return QString::fromStdString(r.getUserID());
        case ResourceIdRole: return QString::fromStdString(r.getResourceID());
        case TimeRole: return QString::fromStdString(r.getRequestTime());
        case PriorityRole: return r.getPriority();
        case StatusRole: return QString::fromStdString(r.getStatus());
        case UrgencyRole: {
            int p = r.getPriority();
            if (p == 4) return "Emergency (Level 4)";
            if (p == 3) return "High Priority (Level 3)";
            if (p == 2) return "Standard (Level 2)";
            return "Low (Level 1)";
        }
        default: return QVariant();
    }
}

QHash<int, QByteArray> RequestModel::roleNames() const {
    QHash<int, QByteArray> roles;
    roles[RequestIdRole] = "requestId";
    roles[UserIdRole] = "userId";
    roles[ResourceIdRole] = "resourceId";
    roles[TimeRole] = "time";
    roles[PriorityRole] = "priority";
    roles[StatusRole] = "status";
    roles[UrgencyRole] = "urgency";
    return roles;
}

int RequestModel::pendingCount() const {
    return static_cast<int>(currentRequests.size());
}

void RequestModel::refresh() {
    beginResetModel();
    currentRequests = priorityQueue.toVector();
    endResetModel();
    emit countChanged();
}

void RequestModel::submitRequest(const QString& userId, const QString& resId, const QString& time, int priority) {
    static int counter = 100;
    std::string reqId = "REQ-" + std::to_string(counter++);
    Request r(reqId, userId.toStdString(), resId.toStdString(), time.toStdString(), "Pending", priority);
    priorityQueue.enqueue(r);
    refresh();
}

bool RequestModel::approveRoot() {
    Request r;
    if (priorityQueue.dequeue(r)) {
        refresh();
        return true;
    }
    return false;
}

bool RequestModel::rejectRoot() {
    Request r;
    if (priorityQueue.dequeue(r)) {
        refresh();
        return true;
    }
    return false;
}
