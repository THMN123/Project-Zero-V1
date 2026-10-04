#include "BottomNavBar.h"
#include <QPainter>
#include <QPainterPath>

BottomNavBar::BottomNavBar(QWidget* parent) : QWidget(parent), currentIndex(0) {
    setFixedHeight(56);
    setAttribute(Qt::WA_TranslucentBackground);

    QHBoxLayout* layout = new QHBoxLayout(this);
    layout->setContentsMargins(8, 6, 8, 6);
    layout->setSpacing(6);

    QStringList labels = {"Facilities", "Schedule", "Campus Map", "Requests", "More"};

    for (int i = 0; i < labels.size(); i++) {
        QPushButton* btn = new QPushButton(labels[i], this);
        btn->setCursor(Qt::PointingHandCursor);
        btn->setSizePolicy(QSizePolicy::Expanding, QSizePolicy::Expanding);
        connect(btn, &QPushButton::clicked, [this, i]() {
            handleButtonClicked(i);
        });
        buttons.push_back(btn);
        layout->addWidget(btn);
    }

    setCurrentIndex(0);
}

void BottomNavBar::handleButtonClicked(int index) {
    setCurrentIndex(index);
    emit tabChanged(index);
}

void BottomNavBar::setCurrentIndex(int index) {
    currentIndex = index;
    for (int i = 0; i < static_cast<int>(buttons.size()); i++) {
        if (i == index) {
            buttons[i]->setStyleSheet(
                "QPushButton {"
                "   background-color: #0071e3;"
                "   color: #ffffff;"
                "   border: none;"
                "   border-radius: 18px;"
                "   font-weight: 600;"
                "   font-size: 12px;"
                "}"
            );
        } else {
            buttons[i]->setStyleSheet(
                "QPushButton {"
                "   background-color: transparent;"
                "   color: #86868b;"
                "   border: none;"
                "   border-radius: 18px;"
                "   font-weight: 500;"
                "   font-size: 12px;"
                "}"
                "QPushButton:hover {"
                "   background-color: rgba(0, 0, 0, 0.04);"
                "   color: #1d1d1f;"
                "}"
            );
        }
    }
    update();
}

int BottomNavBar::getCurrentIndex() const {
    return currentIndex;
}

void BottomNavBar::paintEvent(QPaintEvent* /*event*/) {
    QPainter painter(this);
    painter.setRenderHint(QPainter::Antialiasing);

    // Draw frosted Apple glass pill
    QPainterPath path;
    path.addRoundedRect(rect().adjusted(1, 1, -1, -1), 24, 24);

    painter.fillPath(path, QColor(255, 255, 255, 235));
    painter.setPen(QPen(QColor(0, 0, 0, 25), 1));
    painter.drawPath(path);
}
