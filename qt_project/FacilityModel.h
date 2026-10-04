#ifndef FACILITYMODEL_H
#define FACILITYMODEL_H

#include <QAbstractListModel>
#include <vector>
#include "Resource.h"
#include "LinkedList.h"
#include "HashTable.h"
#include "Tree.h"
#include "Stack.h"

class FacilityModel : public QAbstractListModel {
    Q_OBJECT

public:
    enum FacilityRoles {
        IdRole = Qt::UserRole + 1,
        NameRole,
        TypeRole,
        LocationRole,
        CapacityRole,
        StatusRole
    };

private:
    std::vector<Resource> facilities;
    LinkedList& linkedList;
    HashTable& hashTable;
    BST& bst;
    UndoStack& undoStack;

public:
    explicit FacilityModel(LinkedList& list, HashTable& table, BST& tree, UndoStack& uStack, QObject* parent = nullptr);

    int rowCount(const QModelIndex& parent = QModelIndex()) const override;
    QVariant data(const QModelIndex& index, int role = Qt::DisplayRole) const override;
    QHash<int, QByteArray> roleNames() const override;

    void refresh();

    Q_INVOKABLE void addFacility(const QString& id, const QString& name, const QString& type,
                                 const QString& location, int capacity, const QString& status);
    Q_INVOKABLE bool deleteFacility(const QString& id);
    Q_INVOKABLE bool undoDelete();
    Q_INVOKABLE void sortQuick();
    Q_INVOKABLE void sortBubble();
    Q_INVOKABLE void sortMerge();
    Q_INVOKABLE QVariantMap benchmarkSearch(const QString& id);

signals:
    void undoStateChanged(bool canUndo, const QString& lastDeletedId);
};

#endif // FACILITYMODEL_H
