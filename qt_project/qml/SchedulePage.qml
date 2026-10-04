import QtQuick 2.15
import QtQuick.Controls 2.15
import QtQuick.Layouts 1.15

Item {
    id: root

    readonly property var days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

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

            RowLayout {
                width: parent.width

                Column {
                    Layout.fillWidth: true
                    Text {
                        text: "Schedule & Timetable"
                        font.family: "-apple-system, sans-serif"
                        font.pixelSize: 22
                        font.weight: Font.Bold
                        color: "#1d1d1f"
                    }
                    Text {
                        text: "Conflict-free BST Scheduler for NUL Academic Programs"
                        font.pixelSize: 12
                        color: "#86868b"
                    }
                }

                Button {
                    visible: appController.currentUserRole === "ADMIN"
                    text: "Regenerate Engine"
                    onClicked: timetableModel.autoGenerateSchedule()
                }
            }

            // View Mode Segmented Control
            Rectangle {
                width: parent.width
                height: 38
                radius: 12
                color: "#e5e5ea"

                Row {
                    anchors.fill: parent
                    anchors.margins: 3
                    spacing: 4

                    Repeater {
                        model: ["My Syllabus (Student)", "Master Timetable", "Lecturer Schedule"]
                        delegate: Rectangle {
                            width: (parent.width - 8) / 3
                            height: parent.height
                            radius: 9
                            color: timetableModel.filterMode === index ? "#ffffff" : "transparent"

                            MouseArea {
                                anchors.fill: parent
                                cursorShape: Qt.PointingHandCursor
                                onClicked: timetableModel.filterMode = index
                            }

                            Text {
                                anchors.centerIn: parent
                                text: modelData
                                font.pixelSize: 11
                                font.weight: timetableModel.filterMode === index ? Font.DemiBold : Font.Normal
                                color: timetableModel.filterMode === index ? "#1d1d1f" : "#86868b"
                            }
                        }
                    }
                }
            }

            // Weekday Picker
            Row {
                width: parent.width
                spacing: 8

                Repeater {
                    model: root.days
                    delegate: Rectangle {
                        width: (parent.width - 32) / 5
                        height: 48
                        radius: 12
                        color: timetableModel.filterDay === modelData ? "#1d1d1f" : "#ffffff"
                        border.color: "rgba(0, 0, 0, 0.06)"

                        MouseArea {
                            anchors.fill: parent
                            cursorShape: Qt.PointingHandCursor
                            onClicked: timetableModel.filterDay = modelData
                        }

                        Column {
                            anchors.centerIn: parent
                            Text {
                                anchors.horizontalCenter: parent.horizontalCenter
                                text: modelData.substring(0, 3)
                                font.pixelSize: 12
                                font.weight: Font.DemiBold
                                color: timetableModel.filterDay === modelData ? "#ffffff" : "#1d1d1f"
                            }
                        }
                    }
                }
            }

            // Scheduled Sessions List
            ListView {
                width: parent.width
                height: Math.max(120, count * 70)
                interactive: false
                model: timetableModel

                delegate: Rectangle {
                    width: parent.width
                    height: 62
                    radius: 14
                    color: "#ffffff"
                    border.color: "rgba(0, 0, 0, 0.05)"

                    RowLayout {
                        anchors.fill: parent
                        anchors.margins: 12
                        spacing: 12

                        Column {
                            Layout.preferredWidth: 80
                            Text {
                                text: model.time
                                font.pixelSize: 11
                                font.family: "monospace"
                                font.weight: Font.Bold
                                color: "#0071e3"
                            }
                        }

                        Rectangle {
                            width: 1
                            height: parent.height - 8
                            color: "#e5e5ea"
                        }

                        Column {
                            Layout.fillWidth: true
                            Row {
                                spacing: 6
                                Text {
                                    text: model.courseName
                                    font.pixelSize: 13
                                    font.weight: Font.DemiBold
                                    color: "#1d1d1f"
                                }
                                Text {
                                    text: model.courseId
                                    font.pixelSize: 11
                                    font.family: "monospace"
                                    color: "#86868b"
                                }
                            }
                            Text {
                                text: "📍 " + model.room + " · 👤 " + model.lecturerId + " · " + model.program
                                font.pixelSize: 11
                                color: "#86868b"
                            }
                        }
                    }
                }
            }
        }
    }
}
