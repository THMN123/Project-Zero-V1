#include <QGuiApplication>
#include <QQmlApplicationEngine>
#include <QQmlContext>
#include <QQuickStyle>

#include "UserHashTable.h"
#include "LinkedList.h"
#include "HashTable.h"
#include "Stack.h"
#include "Tree.h"
#include "Graph.h"
#include "Timetable.h"
#include "PriorityQueue.h"

#include "AppController.h"
#include "FacilityModel.h"
#include "TimetableModel.h"
#include "RequestModel.h"
#include "CampusMapController.h"

int main(int argc, char* argv[]) {
    QGuiApplication app(argc, argv);
    app.setApplicationName("ProjectZero");
    app.setOrganizationName("National University of Lesotho");

    QQuickStyle::setStyle("Basic");

    // Initialize Core CS3400 Data Structures
    UserHashTable userTable;
    LinkedList resourcesList;
    HashTable resourcesTable;
    UndoStack undoStack;
    BST resourcesTree;
    Graph campusGraph;
    TimetableBST timetableTree;
    PriorityQueue priorityQueue;

    // Seed Demo Users into UserHashTable
    userTable.insert("admin", User("admin", "admin123", "ADMIN", "System Administrator", "Central Admin"));
    userTable.insert("LEC_CS01", User("LEC_CS01", "pass123", "LECTURER", "Dr. Thabo Moletsane", "BSc Computer Science"));
    userTable.insert("STU101", User("STU101", "pass123", "STUDENT", "Alice Nthabiseng", "BSc Information Systems"));

    // Seed Initial Campus Facilities
    std::vector<Resource> initialResources = {
        Resource("LAB101", "ICT Computing Lab 101", "Laboratory", "Science Block", 40, "Available"),
        Resource("LEC201", "Main Convocation Hall", "Lecture Room", "Main Hall", 150, "Occupied"),
        Resource("PRJ001", "Optoma 4K Projector A", "Equipment", "Store Room", 1, "Available"),
        Resource("LAB102", "Software Engineering Lab", "Laboratory", "Science Block", 35, "Available"),
        Resource("AUD301", "Faculty Auditorium", "Lecture Room", "Admin Block", 250, "Reserved"),
        Resource("SEM402", "Postgrad Seminar Room", "Seminar Room", "Library Building", 20, "Available")
    };

    for (const auto& r : initialResources) {
        resourcesList.insertAtEnd(r);
        resourcesTable.insert(r.getResourceID(), r);
        resourcesTree.insert(r);
    }

    // Seed Campus Graph Venues & Weighted Pathways
    std::vector<std::string> venues = {
        "Library", "ICTLAB", "Main Hall", "Admin Block",
        "Science Block", "Engineering Block", "Student Centre", "Sports Pavilion"
    };
    for (const auto& v : venues) {
        campusGraph.addLocation(v);
    }
    campusGraph.addConnection("Library", "ICTLAB", 3);
    campusGraph.addConnection("Library", "Main Hall", 5);
    campusGraph.addConnection("Main Hall", "Admin Block", 2);
    campusGraph.addConnection("Admin Block", "Science Block", 4);
    campusGraph.addConnection("ICTLAB", "Science Block", 6);
    campusGraph.addConnection("Admin Block", "Student Centre", 3);
    campusGraph.addConnection("Main Hall", "Student Centre", 4);
    campusGraph.addConnection("Student Centre", "Sports Pavilion", 5);
    campusGraph.addConnection("Science Block", "Engineering Block", 3);
    campusGraph.addConnection("Student Centre", "Engineering Block", 6);

    // Seed Master Timetable via Conflict-free BST Scheduler
    generateMasterTimetable(timetableTree);

    // Seed Priority Booking Requests
    priorityQueue.enqueue(Request("REQ-101", "STU101", "LAB101", "10:00 - 12:00", "Pending", 2));
    priorityQueue.enqueue(Request("REQ-102", "LEC_CS01", "PRJ001", "14:00 - 16:00", "Pending", 3));
    priorityQueue.enqueue(Request("REQ-103", "STU101", "AUD301", "08:00 - 10:00", "Pending", 4));

    // Instantiate Modern Qt Quick Models & Controllers
    AppController appController(userTable);
    FacilityModel facilityModel(resourcesList, resourcesTable, resourcesTree, undoStack);
    TimetableModel timetableModel(timetableTree);
    RequestModel requestModel(priorityQueue);
    CampusMapController campusMapController(campusGraph);

    // QML Application Engine
    QQmlApplicationEngine engine;
    QQmlContext* context = engine.rootContext();

    context->setContextProperty("appController", &appController);
    context->setContextProperty("facilityModel", &facilityModel);
    context->setContextProperty("timetableModel", &timetableModel);
    context->setContextProperty("requestModel", &requestModel);
    context->setContextProperty("campusMapController", &campusMapController);

    const QUrl url(QStringLiteral("qrc:/qml/Main.qml"));
    QObject::connect(&engine, &QQmlApplicationEngine::objectCreated,
                     &app, [url](QObject* obj, const QUrl& objUrl) {
        if (!obj && url == objUrl)
            QCoreApplication::exit(-1);
    }, Qt::QueuedConnection);

    // Load from local file path or qrc
    engine.load(QUrl::fromLocalFile(app.applicationDirPath() + "/../qml/Main.qml"));
    if (engine.rootObjects().isEmpty()) {
        engine.load(QUrl("qrc:/qml/Main.qml"));
    }

    return app.exec();
}
