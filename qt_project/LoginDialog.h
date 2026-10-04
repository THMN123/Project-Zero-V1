#ifndef LOGINDIALOG_H
#define LOGINDIALOG_H

#include <QDialog>
#include <QLineEdit>
#include <QLabel>
#include "UserHashTable.h"

class LoginDialog : public QDialog {
    Q_OBJECT

private:
    UserHashTable& userTable;
    QLineEdit* idInput;
    QLineEdit* passInput;
    QLabel* errorLabel;
    User loggedInUser;

public:
    LoginDialog(UserHashTable& table, QWidget* parent = nullptr);

    User getLoggedInUser() const;

private slots:
    void handleManualLogin();
    void selectQuickPersona(const QString& uid, const QString& pass);
};

#endif // LOGINDIALOG_H
