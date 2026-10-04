import QtQuick 2.15
import QtQuick.Controls 2.15
import QtQuick.Layouts 1.15

Item {
    id: root

    property bool canUndo: false
    property string lastDeleted: ""

    Connections {
        target: facilityModel
        function onUndoStateChanged(undoable, id) {
            root.canUndo = undoable
            root.lastDeleted = id
        }
    }

    Flickable {
        anchors.fill: parent
        contentWidth: width
        contentHeight: contentColumn.height + 90
        clip: true

        Column {
            id: contentColumn
            width: Math.min(840, parent.width - 32)
            anchors.horizontalCenter: parent.horizontalCenter
            topPadding: 16
            spacing: 16

            // Header Row
            RowLayout {
                width: parent.width

                Column {
                    Layout.fillWidth: true
                    Text {
                        text: "Campus Facilities"
                        font.family: "-apple-system, sans-serif"
                        font.pixelSize: 22
                        font.weight: Font.Bold
                        color: "#1d1d1f"
                    }
                    Text {
                        text: "Linked List, Horner-rule Hash Table & LIFO Deletion Stack"
                        font.pixelSize: 12
                        color: "#86868b"
                    }
                }
            }

            // Undo Stack Notification Pill
            Rectangle {
                visible: root.canUndo
                width: parent.width
                height: 48
                radius: 14
                color: "#fff9e6"
                border.color: "#ffe58f"

                RowLayout {
                    anchors.fill: parent
                    anchors.margins: 12

                    Text {
                        text: "↺ Item deleted from registry (" + root.lastDeleted + "). Ready on LIFO stack."
                        font.pixelSize: 12
                        color: "#874d00"
                        font.weight: Font.DemiBold
                        Layout.fillWidth: true
                    }

                    Button {
                        text: "Undo Delete"
                        onClicked: facilityModel.undoDelete()
                    }
                }
            }

            // Search Benchmark Card
            Rectangle {
                width: parent.width
                height: benchCol.height + 24
                radius: 16
                color: "#ffffff"
                border.color: "rgba(0, 0, 0, 0.06)"

                Column {
                    id: benchCol
                    width: parent.width - 24
                    anchors.centerIn: parent
                    spacing: 12

                    Text {
                        text: "Algorithmic Search Benchmark: O(n) vs O(1)"
                        font.pixelSize: 13
                        font.weight: Font.Bold
                        color: "#1d1d1f"
                    }

                    RowLayout {
                        width: parent.width
                        spacing: 8

                        TextField {
                            id: searchInput
                            placeholderText: "Enter Facility ID (e.g. LAB101)"
                            font.pixelSize: 12
                            Layout.fillWidth: true
                        }

                        Button {
                            text: "Run Benchmark"
                            onClicked: {
                                var res = facilityModel.benchmarkSearch(searchInput.text)
                                benchResult.text = "Benchmark Result: Linked List visited " + res.linkedListSteps + " linear node(s). Hash Table accessed directly in " + res.hashTableSteps + " step(s) (Bucket #" + res.bucketIndex + ")."
                            }
                        }

                        Button {
                            text: "QuickSort"
                            onClicked: facilityModel.sortQuick()
                        }

                        Button {
                            text: "BubbleSort"
                            onClicked: facilityModel.sortBubble()
                        }
                    }

                    Text {
                        id: benchResult
                        text: "Enter a code to compare traversal step metrics."
                        font.pixelSize: 11
                        color: "#0071e3"
                        font.weight: Font.Medium
                    }
                }
            }

            // Facilities Cards List
            ListView {
                width: parent.width
                height: count * 64
                interactive: false
                model: facilityModel

                delegate: Rectangle {
                    width: parent.width
                    height: 58
                    radius: 12
                    color: "#ffffff"
                    border.color: "rgba(0, 0, 0, 0.05)"

                    RowLayout {
                        anchors.fill: parent
                        anchors.margins: 12
                        spacing: 12

                        Rectangle {
                            width: 8
                            height: 8
                            radius: 4
                            color: model.status === "Available" ? "#34c759" : model.status === "Occupied" ? "#0071e3" : "#ff9500"
                        }

                        Column {
                            Layout.fillWidth: true
                            Row {
                                spacing: 6
                                Text {
                                    text: model.name
                                    font.pixelSize: 13
                                    font.weight: Font.DemiBold
                                    color: "#1d1d1f"
                                }
                                Text {
                                    text: model.facilityId
                                    font.pixelSize: 11
                                    font.family: "monospace"
                                    color: "#86868b"
                                }
                            }
                            Text {
                                text: model.location + " · " + model.type + " · " + model.capacity + " seats · " + model.status
                                font.pixelSize: 11
                                color: "#86868b"
                            }
                        }

                        Button {
                            visible: appController.currentUserRole === "ADMIN"
                            text: "Delete"
                            onClicked: facilityModel.deleteFacility(model.facilityId)
                        }
                    }
                }
            }
        }
    }
}
