#include "LoginDialog.h"
#include <QVBoxLayout>
#include <QHBoxLayout>
#include <QPushButton>
#include <QFrame>

LoginDialog::LoginDialog(UserHashTable& table, QWidget* parent)
    : QDialog(parent), userTable(table) {
    setWindowTitle("Project Zero - Campus Access");
    setFixedSize(380, 480);
    setStyleSheet("background-color: #f5f5f7;");

    QVBoxLayout* mainLayout = new QVBoxLayout(this);
    mainLayout->setContentsMargins(24, 24, 24, 24);
    mainLayout->setSpacing(16);

    // Title
    QLabel* title = new QLabel("Sign In", this);
    title->setStyleSheet("font-size: 22px; font-weight: 700; color: #1d1d1f;");
    QLabel* subtitle = new QLabel("Select a demo profile or sign in with your credentials.", this);
    subtitle->setStyleSheet("font-size: 12px; color: #86868b;");
    mainLayout->addWidget(title);
    mainLayout->addWidget(subtitle);

    // Quick Profiles Card
    QFrame* quickCard = new QFrame(this);
    quickCard->setStyleSheet("background-color: #ffffff; border: 1px solid #e5e5ea; border-radius: 14px;");
    QVBoxLayout* cardLayout = new QVBoxLayout(quickCard);
    cardLayout->setContentsMargins(12, 12, 12, 12);
    cardLayout->setSpacing(8);

    QLabel* quickLabel = new QLabel("DEMO PERSONAS", quickCard);
    quickLabel->setStyleSheet("font-size: 10px; font-weight: 700; color: #86868b;");
    cardLayout->addWidget(quickLabel);

    auto addPersonaBtn = [&](const QString& name, const QString& role, const QString& uid, const QString& pass) {
        QPushButton* btn = new QPushButton(name + " (" + role + ")", quickCard);
        btn->setStyleSheet(
            "QPushButton {"
            "   background-color: #f5f5f7;"
            "   border: 1px solid #e5e5ea;"
            "   border-radius: 10px;"
            "   padding: 8px 12px;"
            "   text-align: left;"
            "   font-size: 12px;"
            "   font-weight: 600;"
            "   color: #1d1d1f;"
            "}"
            "QPushButton:hover { background-color: #e5e5ea; }"
        );
        connect(btn, &QPushButton::clicked, [this, uid, pass]() {
            selectQuickPersona(uid, pass);
        });
        cardLayout->addWidget(btn);
    };

    addPersonaBtn("System Administrator", "ADMIN", "admin", "admin123");
    addPersonaBtn("Dr. Thabo Moletsane", "LECTURER", "LEC_CS01", "pass123");
    addPersonaBtn("Alice Nthabiseng", "STUDENT", "STU101", "pass123");

    mainLayout->addWidget(quickCard);

    // Manual Login Form
    QLabel* manualLabel = new QLabel("OR MANUAL LOGIN", this);
    manualLabel->setStyleSheet("font-size: 10px; font-weight: 700; color: #86868b; margin-top: 8px;");
    mainLayout->addWidget(manualLabel);

    idInput = new QLineEdit(this);
    idInput->setPlaceholderText("User ID (e.g. admin, STU101)");
    idInput->setStyleSheet("background: #ffffff; border: 1px solid #e5e5ea; border-radius: 10px; padding: 8px; font-size: 12px;");

    passInput = new QLineEdit(this);
    passInput->setPlaceholderText("Password");
    passInput->setEchoMode(QLineEdit::Password);
    passInput->setStyleSheet("background: #ffffff; border: 1px solid #e5e5ea; border-radius: 10px; padding: 8px; font-size: 12px;");

    mainLayout->addWidget(idInput);
    mainLayout->addWidget(passInput);

    errorLabel = new QLabel("", this);
    errorLabel->setStyleSheet("color: #ff3b30; font-size: 11px;");
    mainLayout->addWidget(errorLabel);

    QPushButton* loginBtn = new QPushButton("Sign In", this);
    loginBtn->setStyleSheet(
        "QPushButton {"
        "   background-color: #0071e3;"
        "   color: #ffffff;"
        "   border: none;"
        "   border-radius: 18px;"
        "   padding: 10px;"
        "   font-weight: 600;"
        "   font-size: 13px;"
        "}"
        "QPushButton:hover { background-color: #0077ed; }"
    );
    connect(loginBtn, &QPushButton::clicked, this, &LoginDialog::handleManualLogin);
    mainLayout->addWidget(loginBtn);
}

void LoginDialog::selectQuickPersona(const QString& uid, const QString& pass) {
    idInput->setText(uid);
    passInput->setText(pass);
    handleManualLogin();
}

void LoginDialog::handleManualLogin() {
    std::string id = idInput->text().trimmed().toStdString();
    std::string pass = passInput->text().toStdString();

    User user;
    if (userTable.authenticate(id, pass, user)) {
        loggedInUser = user;
        accept();
    } else {
        errorLabel->setText("Invalid credentials. Please verify your User ID and password.");
    }
}

User LoginDialog::getLoggedInUser() const {
    return loggedInUser;
}
