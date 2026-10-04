cmake_minimum_required(VERSION 3.16)
project(ProjectZero LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTORCC ON)
set(CMAKE_AUTOUIC ON)

find_package(QT NAMES Qt6 Qt5 REQUIRED COMPONENTS Core Gui Qml Quick QuickControls2)
find_package(Qt${QT_VERSION_MAJOR} REQUIRED COMPONENTS Core Gui Qml Quick QuickControls2)

set(PROJECT_SOURCES
    main.cpp
    AppController.h
    AppController.cpp
    FacilityModel.h
    FacilityModel.cpp
    TimetableModel.h
    TimetableModel.cpp
    RequestModel.h
    RequestModel.cpp
    CampusMapController.h
    CampusMapController.cpp
    Resource.h
    Resource.cpp
    Request.h
    Request.cpp
    LinkedList.h
    LinkedList.cpp
    HashTable.h
    HashTable.cpp
    PriorityQueue.h
    PriorityQueue.cpp
    Stack.h
    Stack.cpp
    Tree.h
    Tree.cpp
    Graph.h
    Graph.cpp
    Timetable.h
    Timetable.cpp
    User.h
    User.cpp
    UserHashTable.h
    UserHashTable.cpp
    Sorting.h
    Sorting.cpp
    qml.qrc
)

add_executable(ProjectZero ${PROJECT_SOURCES})
target_link_libraries(ProjectZero PRIVATE
    Qt${QT_VERSION_MAJOR}::Core
    Qt${QT_VERSION_MAJOR}::Gui
    Qt${QT_VERSION_MAJOR}::Qml
    Qt${QT_VERSION_MAJOR}::Quick
    Qt${QT_VERSION_MAJOR}::QuickControls2
)
