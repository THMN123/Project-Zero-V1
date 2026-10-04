#ifndef APPCONTROLLER_H
#define APPCONTROLLER_H

#include <QObject>
#include <QString>
#include <QVariantList>
#include "User.h"
#include "UserHashTable.h"

class AppController : public QObject {
    Q_OBJECT
    Q_PROPERTY(QString currentUserId READ currentUserId NOTIFY userChanged)
    Q_PROPERTY(QString currentUserName READ currentUserName NOTIFY userChanged)
    Q_PROPERTY(QString currentUserRole READ currentUserRole NOTIFY userChanged)
    Q_PROPERTY(QString currentUserProgram READ currentUserProgram NOTIFY userChanged)
    Q_PROPERTY(int activeTabIndex READ activeTabIndex WRITE setActiveTabIndex NOTIFY tabChanged)

private:
    UserHashTable& userTable;
    User currentUser;
    int m_activeTabIndex;

public:
    explicit AppController(UserHashTable& table, QObject* parent = nullptr);

    QString currentUserId() const { return QString::fromStdString(currentUser.getUserID()); }
    QString currentUserName() const { return QString::fromStdString(currentUser.getFullName()); }
    QString currentUserRole() const { return QString::fromStdString(currentUser.getRole()); }
    QString currentUserProgram() const { return QString::fromStdString(currentUser.getProgram()); }
    int activeTabIndex() const { return m_activeTabIndex; }

    void setActiveTabIndex(int index);

    Q_INVOKABLE bool login(const QString& id, const QString& password);
    Q_INVOKABLE void switchPersona(const QString& role);
    Q_INVOKABLE QVariantList getDemoUsers() const;

signals:
    void userChanged();
    void tabChanged();
    void loginFailed(const QString& message);
};

#endif // APPCONTROLLER_H
