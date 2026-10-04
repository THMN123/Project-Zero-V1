#include "AppController.h"

AppController::AppController(UserHashTable& table, QObject* parent)
    : QObject(parent), userTable(table), m_activeTabIndex(0) {
    currentUser = User("admin", "admin123", "ADMIN", "System Administrator", "Central Admin");
}

void AppController::setActiveTabIndex(int index) {
    if (m_activeTabIndex != index) {
        m_activeTabIndex = index;
        emit tabChanged();
    }
}

bool AppController::login(const QString& id, const QString& password) {
    User u;
    if (userTable.authenticate(id.trimmed().toStdString(), password.toStdString(), u)) {
        currentUser = u;
        emit userChanged();
        return true;
    }
    emit loginFailed("Invalid credentials. Please verify your User ID and password.");
    return false;
}

void AppController::switchPersona(const QString& role) {
    auto users = userTable.getAll();
    for (const auto& u : users) {
        if (QString::fromStdString(u.getRole()).compare(role, Qt::CaseInsensitive) == 0) {
            currentUser = u;
            emit userChanged();
            return;
        }
    }
}

QVariantList AppController::getDemoUsers() const {
    auto users = userTable.getAll();
    QVariantList list;
    for (const auto& u : users) {
        QVariantMap map;
        map["userId"] = QString::fromStdString(u.getUserID());
        map["fullName"] = QString::fromStdString(u.getFullName());
        map["role"] = QString::fromStdString(u.getRole());
        map["program"] = QString::fromStdString(u.getProgram());
        list.append(map);
    }
    return list;
}
