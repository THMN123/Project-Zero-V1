#include "FacilityModel.h"
#include "Sorting.h"

FacilityModel::FacilityModel(LinkedList& list, HashTable& table, BST& tree, UndoStack& uStack, QObject* parent)
    : QAbstractListModel(parent), linkedList(list), hashTable(table), bst(tree), undoStack(uStack) {
    refresh();
}

int FacilityModel::rowCount(const QModelIndex& parent) const {
    if (parent.isValid()) return 0;
    return static_cast<int>(facilities.size());
}

QVariant FacilityModel::data(const QModelIndex& index, int role) const {
    if (!index.isValid() || index.row() < 0 || index.row() >= static_cast<int>(facilities.size()))
        return QVariant();

    const Resource& res = facilities[index.row()];
    switch (role) {
        case IdRole: return QString::fromStdString(res.getResourceID());
        case NameRole: return QString::fromStdString(res.getName());
        case TypeRole: return QString::fromStdString(res.getType());
        case LocationRole: return QString::fromStdString(res.getLocation());
        case CapacityRole: return res.getCapacity();
        case StatusRole: return QString::fromStdString(res.getStatus());
        default: return QVariant();
    }
}

QHash<int, QByteArray> FacilityModel::roleNames() const {
    QHash<int, QByteArray> roles;
    roles[IdRole] = "facilityId";
    roles[NameRole] = "name";
    roles[TypeRole] = "type";
    roles[LocationRole] = "location";
    roles[CapacityRole] = "capacity";
    roles[StatusRole] = "status";
    return roles;
}

void FacilityModel::refresh() {
    beginResetModel();
    facilities = linkedList.toVector();
    endResetModel();

    Resource top;
    bool hasUndo = undoStack.peek(top);
    emit undoStateChanged(hasUndo, hasUndo ? QString::fromStdString(top.getResourceID()) : "");
}

void FacilityModel::addFacility(const QString& id, const QString& name, const QString& type,
                                const QString& location, int capacity, const QString& status) {
    Resource res(id.toStdString(), name.toStdString(), type.toStdString(),
                 location.toStdString(), capacity, status.toStdString());
    linkedList.insertAtEnd(res);
    hashTable.insert(res.getResourceID(), res);
    bst.insert(res);
    refresh();
}

bool FacilityModel::deleteFacility(const QString& id) {
    std::string stdId = id.toStdString();
    Resource* res = linkedList.searchResource(stdId);
    if (!res) return false;

    undoStack.push(*res);
    linkedList.deleteResource(stdId);
    hashTable.remove(stdId);
    refresh();
    return true;
}

bool FacilityModel::undoDelete() {
    Resource restored;
    if (undoStack.pop(restored)) {
        linkedList.insertAtEnd(restored);
        hashTable.insert(restored.getResourceID(), restored);
        bst.insert(restored);
        refresh();
        return true;
    }
    return false;
}

void FacilityModel::sortQuick() {
    SortReport report = Sorter::quickSort(facilities);
    beginResetModel();
    facilities = report.sortedList;
    endResetModel();
}

void FacilityModel::sortBubble() {
    SortReport report = Sorter::bubbleSort(facilities);
    beginResetModel();
    facilities = report.sortedList;
    endResetModel();
}

void FacilityModel::sortMerge() {
    SortReport report = Sorter::mergeSort(facilities);
    beginResetModel();
    facilities = report.sortedList;
    endResetModel();
}

QVariantMap FacilityModel::benchmarkSearch(const QString& id) {
    std::string key = id.trimmed().toStdString();
    int llSteps = 0;
    Resource* r1 = linkedList.searchResource(key, llSteps);

    int htSteps = 0, bucket = 0;
    Resource* r2 = hashTable.search(key, htSteps, bucket);

    QVariantMap map;
    map["target"] = id;
    map["found"] = (r2 != nullptr);
    map["linkedListSteps"] = llSteps;
    map["hashTableSteps"] = htSteps;
    map["bucketIndex"] = bucket;
    return map;
}
