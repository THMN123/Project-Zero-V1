#include "CampusMapWidget.h"
#include <QVBoxLayout>
#include <QHBoxLayout>
#include <QPainter>
#include <QPainterPath>
#include <QPushButton>

CampusMapWidget::CampusMapWidget(Graph& graph, User& user, QWidget* parent)
    : QWidget(parent), campusGraph(graph), currentUser(user), startLocation("Library"), destLocation("Science Block") {

    QVBoxLayout* mainLayout = new QVBoxLayout(this);
    mainLayout->setContentsMargins(20, 20, 20, 80);
    mainLayout->setSpacing(12);

    QLabel* title = new QLabel("Campus Navigation & Dijkstra Engine", this);
    title->setStyleSheet("font-size: 20px; font-weight: 700; color: #1d1d1f;");
    mainLayout->addWidget(title);

    // Controls Row
    QHBoxLayout* controlsRow = new QHBoxLayout();

    QLabel* fromLabel = new QLabel("Start:", this);
    fromLabel->setStyleSheet("font-size: 12px; font-weight: 600; color: #86868b;");
    controlsRow->addWidget(fromLabel);

    startCombo = new QComboBox(this);
    controlsRow->addWidget(startCombo);

    QLabel* toLabel = new QLabel("Destination:", this);
    toLabel->setStyleSheet("font-size: 12px; font-weight: 600; color: #86868b;");
    controlsRow->addWidget(toLabel);

    destCombo = new QComboBox(this);
    controlsRow->addWidget(destCombo);

    controlsRow->addStretch();
    mainLayout->addLayout(controlsRow);

    routeInfoLabel = new QLabel(this);
    routeInfoLabel->setStyleSheet("background: #ffffff; border: 1px solid #e5e5ea; border-radius: 12px; padding: 10px 14px; font-size: 12px; color: #0071e3; font-weight: 600;");
    mainLayout->addWidget(routeInfoLabel);

    // Initial Coordinates for Campus Map Canvas
    nodePoints = {
        {"Library", "LIB", 160, 90},
        {"ICTLAB", "ICT", 360, 80},
        {"Main Hall", "MH", 130, 220},
        {"Admin Block", "ADM", 310, 200},
        {"Science Block", "SCI", 510, 160},
        {"Engineering Block", "ENG", 470, 280},
        {"Student Centre", "SC", 240, 310},
        {"Sports Pavilion", "SPT", 90, 340}
    };

    auto locs = campusGraph.getLocations();
    for (const auto& l : locs) {
        startCombo->addItem(QString::fromStdString(l));
        destCombo->addItem(QString::fromStdString(l));
    }

    startCombo->setCurrentText("Library");
    destCombo->setCurrentText("Science Block");

    connect(startCombo, QOverload<int>::of(&QComboBox::currentIndexChanged), this, &CampusMapWidget::handleStartChanged);
    connect(destCombo, QOverload<int>::of(&QComboBox::currentIndexChanged), this, &CampusMapWidget::handleDestChanged);

    calculateRoute();
}

void CampusMapWidget::handleStartChanged(int /*idx*/) {
    startLocation = startCombo->currentText().toStdString();
    calculateRoute();
    update();
}

void CampusMapWidget::handleDestChanged(int /*idx*/) {
    destLocation = destCombo->currentText().toStdString();
    calculateRoute();
    update();
}

void CampusMapWidget::calculateRoute() {
    currentRoute = campusGraph.dijkstra(startLocation, destLocation);
    if (currentRoute.reachable) {
        QString pathStr;
        for (size_t i = 0; i < currentRoute.path.size(); i++) {
            pathStr += QString::fromStdString(currentRoute.path[i]);
            if (i < currentRoute.path.size() - 1) pathStr += " → ";
        }
        routeInfoLabel->setText(QString("Dijkstra Shortest Route: %1 (%2 distance units)").arg(pathStr).arg(currentRoute.distance));
    } else {
        routeInfoLabel->setText("No connecting pathway found between selected venues.");
    }
}

void CampusMapWidget::paintEvent(QPaintEvent* /*event*/) {
    QPainter painter(this);
    painter.setRenderHint(QPainter::Antialiasing);

    // Draw canvas card box
    QRect canvasRect(20, 140, width() - 40, height() - 230);
    painter.setPen(QPen(QColor("#e5e5ea"), 1));
    painter.setBrush(QColor("#ffffff"));
    painter.drawRoundedRect(canvasRect, 16, 16);

    auto matrix = campusGraph.getMatrix();
    auto locs = campusGraph.getLocations();

    auto findPoint = [&](const std::string& name) -> QPoint {
        for (const auto& pt : nodePoints) {
            if (pt.name == name) {
                // scale according to canvas rect
                int x = canvasRect.left() + pt.x * (canvasRect.width() - 80) / 600 + 40;
                int y = canvasRect.top() + pt.y * (canvasRect.height() - 80) / 400 + 40;
                return QPoint(x, y);
            }
        }
        return QPoint(canvasRect.center());
    };

    auto isInPath = [&](const std::string& a, const std::string& b) -> bool {
        if (!currentRoute.reachable) return false;
        for (size_t i = 0; i < currentRoute.path.size() - 1; i++) {
            if ((currentRoute.path[i] == a && currentRoute.path[i + 1] == b) ||
                (currentRoute.path[i] == b && currentRoute.path[i + 1] == a)) {
                return true;
            }
        }
        return false;
    };

    // Draw pathways
    for (size_t i = 0; i < locs.size(); i++) {
        for (size_t j = i + 1; j < locs.size(); j++) {
            if (matrix[i][j] > 0) {
                QPoint p1 = findPoint(locs[i]);
                QPoint p2 = findPoint(locs[j]);

                bool active = isInPath(locs[i], locs[j]);
                painter.setPen(QPen(active ? QColor("#0071e3") : QColor("#d2d2d7"), active ? 3.5 : 1.5));
                painter.drawLine(p1, p2);

                // Weight badge
                QPoint mid = (p1 + p2) / 2;
                painter.setBrush(active ? QColor("#0071e3") : QColor("#ffffff"));
                painter.setPen(QPen(active ? QColor("#0071e3") : QColor("#d2d2d7"), 1));
                painter.drawRoundedRect(QRect(mid.x() - 12, mid.y() - 8, 24, 16), 4, 4);

                painter.setPen(active ? QColor("#ffffff") : QColor("#86868b"));
                painter.setFont(QFont("-apple-system", 8, QFont::Bold));
                painter.drawText(QRect(mid.x() - 12, mid.y() - 8, 24, 16), Qt::AlignCenter, QString::number(matrix[i][j]));
            }
        }
    }

    // Draw Venue Nodes
    for (const auto& pt : nodePoints) {
        QPoint p = findPoint(pt.name);
        bool isStart = pt.name == startLocation;
        bool isDest = pt.name == destLocation;

        painter.setBrush(isStart ? QColor("#34c759") : isDest ? QColor("#0071e3") : QColor("#f5f5f7"));
        painter.setPen(QPen(isStart ? QColor("#2fb34f") : isDest ? QColor("#0071e3") : QColor("#d2d2d7"), 2));
        painter.drawEllipse(p, 16, 16);

        painter.setPen(isStart || isDest ? QColor("#ffffff") : QColor("#1d1d1f"));
        painter.setFont(QFont("-apple-system", 8, QFont::Bold));
        painter.drawText(QRect(p.x() - 16, p.y() - 16, 32, 32), Qt::AlignCenter, QString::fromStdString(pt.code));

        painter.setPen(isStart ? QColor("#2fb34f") : isDest ? QColor("#0071e3") : QColor("#1d1d1f"));
        painter.setFont(QFont("-apple-system", 9, QFont::DemiBold));
        painter.drawText(QRect(p.x() - 60, p.y() + 18, 120, 20), Qt::AlignCenter, QString::fromStdString(pt.name));
    }
}
