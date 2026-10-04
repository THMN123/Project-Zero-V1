import QtQuick 2.15
import QtQuick.Window 2.15
import QtQuick.Controls 2.15
import QtQuick.Layouts 1.15

ApplicationWindow {
    id: window
    width: 960
    height: 700
    visible: true
    title: "Project Zero - NUL Campus Management System"
    color: "#f5f5f7"

    // Top Header Bar
    Rectangle {
        id: topHeader
        width: parent.width
        height: 52
        color: "#fbfbfd"
        border.color: "rgba(0, 0, 0, 0.06)"
        border.width: 1
        z: 20

        RowLayout {
            anchors.fill: parent
            anchors.margins: 16

            Row {
                spacing: 8
                Rectangle {
                    width: 26
                    height: 26
                    radius: 8
                    color: "#1d1d1f"
                    Text {
                        anchors.centerIn: parent
                        text: "NUL"
                        font.pixelSize: 10
                        font.weight: Font.Bold
                        color: "#ffffff"
                    }
                }
                Text {
                    anchors.verticalCenter: parent.verticalCenter
                    text: "Project Zero"
                    font.family: "-apple-system, sans-serif"
                    font.pixelSize: 14
                    font.weight: Font.Bold
                    color: "#1d1d1f"
                }
            }

            Item { Layout.fillWidth: true }

            Row {
                spacing: 10
                Text {
                    anchors.verticalCenter: parent.verticalCenter
                    text: appController.currentUserName + " · " + appController.currentUserRole
                    font.pixelSize: 12
                    font.weight: Font.DemiBold
                    color: "#86868b"
                }

                Button {
                    text: "Switch Persona"
                    onClicked: loginDialog.open()
                }
            }
        }
    }

    // Stack Layout for Views
    StackLayout {
        id: stackLayout
        anchors.top: topHeader.bottom
        anchors.bottom: parent.bottom
        anchors.left: parent.left
        anchors.right: parent.right
        currentIndex: appController.activeTabIndex

        FacilitiesPage {}
        SchedulePage {}
        CampusMapPage {}
        RequestsPage {}
        MorePage {}
    }

    // Floating Apple-Style Bottom Pill Navbar
    BottomPillBar {
        id: bottomBar
        anchors.bottom: parent.bottom
        anchors.bottomMargin: 18
        anchors.horizontalCenter: parent.horizontalCenter
        z: 30
        currentIndex: appController.activeTabIndex
        pendingRequestsCount: requestModel.pendingCount
        canUndo: false

        onTabSelected: function(index) {
            appController.activeTabIndex = index
        }
    }

    // Login Overlay Sheet
    LoginPage {
        id: loginDialog
        z: 100
    }
}
