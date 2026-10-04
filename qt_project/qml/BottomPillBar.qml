import QtQuick 2.15
import QtQuick.Controls 2.15

Item {
    id: root
    width: Math.min(460, parent.width - 32)
    height: 60

    property int currentIndex: 0
    property int pendingRequestsCount: 0
    property bool canUndo: false

    signal tabSelected(int index)

    readonly property var items: [
        { label: "Facilities", icon: "building" },
        { label: "Schedule", icon: "calendar" },
        { label: "Campus Map", icon: "compass" },
        { label: "Requests", icon: "tray" },
        { label: "More", icon: "ellipsis" }
    ]

    // Frosted Pill Container with Apple Ambient Shadow
    Rectangle {
        id: pillBackground
        anchors.fill: parent
        radius: 30
        color: "rgba(255, 255, 255, 0.86)"
        border.color: "rgba(0, 0, 0, 0.08)"
        border.width: 1

        // Inner rim light
        Rectangle {
            anchors.fill: parent
            anchors.margins: 1
            radius: 29
            color: "transparent"
            border.color: "rgba(255, 255, 255, 0.65)"
            border.width: 1
        }

        // Gliding Active Pill Capsule
        Rectangle {
            id: activeIndicator
            width: (pillBackground.width - 12) / root.items.length
            height: pillBackground.height - 12
            y: 6
            x: 6 + root.currentIndex * width
            radius: 24
            color: "#0071e3"

            Behavior on x {
                NumberAnimation {
                    duration: 280
                    easing.type: Easing.OutQuint
                }
            }
        }

        // Nav Buttons Row
        Row {
            anchors.fill: parent
            anchors.margins: 6
            spacing: 0

            Repeater {
                model: root.items
                delegate: Item {
                    id: tabItem
                    width: (pillBackground.width - 12) / root.items.length
                    height: parent.height

                    readonly property bool isActive: root.currentIndex === index

                    scale: clickArea.pressed ? 0.94 : 1.0
                    Behavior on scale {
                        NumberAnimation { duration: 120 }
                    }

                    MouseArea {
                        id: clickArea
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        onClicked: {
                            root.currentIndex = index
                            root.tabSelected(index)
                        }
                    }

                    Column {
                        anchors.centerIn: parent
                        spacing: 3

                        AppleIcon {
                            anchors.horizontalCenter: parent.horizontalCenter
                            name: modelData.icon
                            color: tabItem.isActive ? "#ffffff" : "#86868b"
                            width: 18
                            height: 18
                            strokeWidth: tabItem.isActive ? 2.0 : 1.6
                        }

                        Text {
                            anchors.horizontalCenter: parent.horizontalCenter
                            text: modelData.label
                            font.family: "-apple-system, 'SF Pro Text', Inter, sans-serif"
                            font.pixelSize: 10
                            font.weight: tabItem.isActive ? Font.DemiBold : Font.Normal
                            color: tabItem.isActive ? "#ffffff" : "#86868b"
                        }
                    }

                    // Badge for Requests
                    Rectangle {
                        visible: index === 3 && root.pendingRequestsCount > 0
                        width: 16
                        height: 16
                        radius: 8
                        color: tabItem.isActive ? "#ffffff" : "#ff3b30"
                        anchors.top: parent.top
                        anchors.right: parent.right
                        anchors.rightMargin: 10
                        anchors.topMargin: 4

                        Text {
                            anchors.centerIn: parent
                            text: root.pendingRequestsCount
                            font.pixelSize: 9
                            font.weight: Font.Bold
                            color: tabItem.isActive ? "#0071e3" : "#ffffff"
                        }
                    }

                    // Badge for Undo
                    Rectangle {
                        visible: index === 0 && root.canUndo
                        width: 14
                        height: 14
                        radius: 7
                        color: tabItem.isActive ? "#ffffff" : "#ff9500"
                        anchors.top: parent.top
                        anchors.right: parent.right
                        anchors.rightMargin: 10
                        anchors.topMargin: 4

                        Text {
                            anchors.centerIn: parent
                            text: "↺"
                            font.pixelSize: 9
                            font.weight: Font.Bold
                            color: tabItem.isActive ? "#0071e3" : "#ffffff"
                        }
                    }
                }
            }
        }
    }
}
