#include "CampusMapController.h"

CampusMapController::CampusMapController(Graph& graph, QObject* parent)
    : QObject(parent), campusGraph(graph), m_startVenue("Library"), m_destVenue("Science Block") {
    calculateRoute();
}

void CampusMapController::setStartVenue(const QString& v) {
    if (m_startVenue != v) {
        m_startVenue = v;
        calculateRoute();
    }
}

void CampusMapController::setDestVenue(const QString& v) {
    if (m_destVenue != v) {
        m_destVenue = v;
        calculateRoute();
    }
}

void CampusMapController::calculateRoute() {
    m_currentRoute = campusGraph.dijkstra(m_startVenue.toStdString(), m_destVenue.toStdString());
    emit routeChanged();
}

QVariantList CampusMapController::routePath() const {
    QVariantList list;
    for (const auto& node : m_currentRoute.path) {
        list.append(QString::fromStdString(node));
    }
    return list;
}

QVariantList CampusMapController::getVenues() const {
    struct VenueData { const char* name; const char* code; int x; int y; const char* type; };
    static const VenueData data[] = {
        {"Library", "LIB", 140, 80, "Academic"},
        {"ICTLAB", "ICT", 360, 70, "Lab"},
        {"Main Hall", "MH", 110, 200, "Administration"},
        {"Admin Block", "ADM", 290, 180, "Administration"},
        {"Science Block", "SCI", 490, 140, "Academic"},
        {"Engineering Block", "ENG", 450, 260, "Academic"},
        {"Student Centre", "SC", 230, 290, "Recreation"},
        {"Sports Pavilion", "SPT", 80, 310, "Recreation"}
    };

    QVariantList list;
    for (const auto& v : data) {
        QVariantMap map;
        map["name"] = QString(v.name);
        map["code"] = QString(v.code);
        map["x"] = v.x;
        map["y"] = v.y;
        map["type"] = QString(v.type);
        list.append(map);
    }
    return list;
}

QVariantList CampusMapController::getConnections() const {
    auto matrix = campusGraph.getMatrix();
    auto locs = campusGraph.getLocations();

    QVariantList list;
    for (size_t i = 0; i < locs.size(); i++) {
        for (size_t j = i + 1; j < locs.size(); j++) {
            if (matrix[i][j] > 0) {
                QVariantMap map;
                map["from"] = QString::fromStdString(locs[i]);
                map["to"] = QString::fromStdString(locs[j]);
                map["weight"] = matrix[i][j];
                list.append(map);
            }
        }
    }
    return list;
}
