#ifndef CAMPUSMAPWIDGET_H
#define CAMPUSMAPWIDGET_H

#include <QWidget>
#include <QComboBox>
#include <QLabel>
#include "Graph.h"
#include "User.h"

struct MapNodePoint {
    std::string name;
    std::string code;
    int x;
    int y;
};

class CampusMapWidget : public QWidget {
    Q_OBJECT

private:
    Graph& campusGraph;
    User& currentUser;

    std::vector<MapNodePoint> nodePoints;
    std::string startLocation;
    std::string destLocation;
    DijkstraResult currentRoute;

    QComboBox* startCombo;
    QComboBox* destCombo;
    QLabel* routeInfoLabel;

public:
    CampusMapWidget(Graph& graph, User& user, QWidget* parent = nullptr);

    void calculateRoute();

protected:
    void paintEvent(QPaintEvent* event) override;

private slots:
    void handleStartChanged(int idx);
    void handleDestChanged(int idx);
};

#endif // CAMPUSMAPWIDGET_H
