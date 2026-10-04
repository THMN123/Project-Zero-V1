import QtQuick 2.15
import QtQuick.Controls 2.15
import QtQuick.Layouts 1.15

Item {
    id: root

    Flickable {
        anchors.fill: parent
        contentWidth: width
        contentHeight: contentCol.height + 90
        clip: true

        Column {
            id: contentCol
            width: Math.min(840, parent.width - 32)
            anchors.horizontalCenter: parent.horizontalCenter
            topPadding: 16
            spacing: 16

            Text {
                text: "Curriculum & Algorithmic Architecture"
                font.family: "-apple-system, sans-serif"
                font.pixelSize: 22
                font.weight: Font.Bold
                color: "#1d1d1f"
            }

            Rectangle {
                width: parent.width
                height: 220
                radius: 16
                color: "#ffffff"
                border.color: "rgba(0, 0, 0, 0.06)"

                Column {
                    anchors.fill: parent
                    anchors.margins: 18
                    spacing: 8

                    Text {
                        text: "CS3400 Data Structures & Algorithms Implementation"
                        font.pixelSize: 14
                        font.weight: Font.Bold
                        color: "#1d1d1f"
                    }

                    Text {
                        text: "1. Singly Linked List: Dynamic facility record storage\n" +
                              "2. Direct Hash Table: O(1) Horner polynomial hash function for immediate lookup\n" +
                              "3. Binary Search Tree (BST): Academic timetable indexing & ordered in-order traversal\n" +
                              "4. Binary Max-Heap: Urgent facility booking priority queue\n" +
                              "5. LIFO Undo Stack: Reversible administrative facility deletion history\n" +
                              "6. Spatial Graph: Adjacency Matrix with Dijkstra shortest path calculation"
                        font.pixelSize: 12
                        color: "#1d1d1f"
                        lineHeight: 1.5
                    }
                }
            }

            Rectangle {
                width: parent.width
                height: 120
                radius: 16
                color: "#ffffff"
                border.color: "rgba(0, 0, 0, 0.06)"

                Column {
                    anchors.fill: parent
                    anchors.margins: 18
                    spacing: 6

                    Text {
                        text: "National University of Lesotho (NUL)"
                        font.pixelSize: 13
                        font.weight: Font.Bold
                        color: "#1d1d1f"
                    }

                    Text {
                        text: "Faculty of Science & Technology · Department of Computer Science & Information Systems.\n" +
                              "Built according to Apple Human Interface Guidelines and modern Qt Quick architecture."
                        font.pixelSize: 12
                        color: "#86868b"
                    }
                }
            }
        }
    }
}
