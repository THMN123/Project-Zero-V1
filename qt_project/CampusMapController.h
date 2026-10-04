#ifndef CAMPUSMAPCONTROLLER_H
#define CAMPUSMAPCONTROLLER_H

#include <QObject>
#include <QVariantList>
#include <QVariantMap>
#include "Graph.h"

class CampusMapController : public QObject {
    Q_OBJECT
    Q_PROPERTY(QString startVenue READ startVenue WRITE setStartVenue NOTIFY routeChanged)
    Q_PROPERTY(QString destVenue READ destVenue WRITE setDestVenue NOTIFY routeChanged)
    Q_PROPERTY(int routeDistance READ routeDistance NOTIFY routeChanged)
    Q_PROPERTY(QVariantList routePath READ routePath NOTIFY routeChanged)
    Q_PROPERTY(bool isReachable READ isReachable NOTIFY routeChanged)

private:
    Graph& campusGraph;
    QString m_startVenue;
    QString m_destVenue;
    DijkstraResult m_currentRoute;

public:
    explicit CampusMapController(Graph& graph, QObject* parent = nullptr);

    QString startVenue() const { return m_startVenue; }
    QString destVenue() const { return m_destVenue; }
    int routeDistance() const { return m_currentRoute.distance; }
    QVariantList routePath() const;
    bool isReachable() const { return m_currentRoute.reachable; }

    void setStartVenue(const QString& v);
    void setDestVenue(const QString& v);

    Q_INVOKABLE QVariantList getVenues() const;
    Q_INVOKABLE QVariantList getConnections() const;
    Q_INVOKABLE void calculateRoute();

signals:
    void routeChanged();
};

#endif // CAMPUSMAPCONTROLLER_H
