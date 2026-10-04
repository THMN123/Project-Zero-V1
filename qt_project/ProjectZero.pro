QT += core gui qml quick quickcontrols2

CONFIG += c++17

TARGET = ProjectZero
TEMPLATE = app

SOURCES += \
    main.cpp \
    AppController.cpp \
    FacilityModel.cpp \
    TimetableModel.cpp \
    RequestModel.cpp \
    CampusMapController.cpp \
    Resource.cpp \
    Request.cpp \
    LinkedList.cpp \
    HashTable.cpp \
    PriorityQueue.cpp \
    Stack.cpp \
    Tree.cpp \
    Graph.cpp \
    Timetable.cpp \
    User.cpp \
    UserHashTable.cpp \
    Sorting.cpp

HEADERS += \
    AppController.h \
    FacilityModel.h \
    TimetableModel.h \
    RequestModel.h \
    CampusMapController.h \
    Resource.h \
    Request.h \
    LinkedList.h \
    HashTable.h \
    PriorityQueue.h \
    Stack.h \
    Tree.h \
    Graph.h \
    Timetable.h \
    User.h \
    UserHashTable.h \
    Sorting.h

RESOURCES += \
    qml.qrc
