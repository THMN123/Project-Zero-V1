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

            RowLayout {
                width: parent.width

                Column {
                    Layout.fillWidth: true
                    Text {
                        text: "Booking Requests (Max-Heap Priority Queue)"
                        font.family: "-apple-system, sans-serif"
                        font.pixelSize: 22
                        font.weight: Font.Bold
                        color: "#1d1d1f"
                    }
                    Text {
                        text: "Binary Max-Heap ensures Emergency Level 4 is always at root node"
                        font.pixelSize: 12
                        color: "#86868b"
                    }
                }

                Button {
                    text: "+ New Booking"
                    onClicked: reqDialog.open()
                }
            }

            // Heap Root Actions (Admin)
            Rectangle {
                visible: appController.currentUserRole === "ADMIN" && requestModel.rowCount() > 0
                width: parent.width
                height: 52
                radius: 14
                color: "#ffffff"
                border.color: "rgba(0, 0, 0, 0.06)"

                RowLayout {
                    anchors.fill: parent
                    anchors.margins: 12

                    Text {
                        text: "Priority Max-Heap Root Node Action:"
                        font.pixelSize: 12
                        font.weight: Font.DemiBold
                        color: "#1d1d1f"
                        Layout.fillWidth: true
                    }

                    Button {
                        text: "Approve Root (Highest Priority)"
                        onClicked: requestModel.approveRoot()
                    }

                    Button {
                        text: "Reject Root"
                        onClicked: requestModel.rejectRoot()
                    }
                }
            }

            // Queue List
            ListView {
                width: parent.width
                height: Math.max(100, count * 64)
                interactive: false
                model: requestModel

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
                            color: model.priority === 4 ? "#ff3b30" : model.priority === 3 ? "#ff9500" : model.priority === 2 ? "#0071e3" : "#86868b"
                        }

                        Column {
                            Layout.fillWidth: true
                            Row {
                                spacing: 6
                                Text {
                                    text: model.resourceId
                                    font.pixelSize: 13
                                    font.weight: Font.DemiBold
                                    color: "#1d1d1f"
                                }
                                Text {
                                    text: "#" + model.requestId
                                    font.pixelSize: 11
                                    font.family: "monospace"
                                    color: "#86868b"
                                }
                            }
                            Text {
                                text: model.userId + " · " + model.time + " · " + model.urgency + " · " + model.status
                                font.pixelSize: 11
                                color: "#86868b"
                            }
                        }
                    }
                }
            }
        }
    }

    // Submit Request Dialog
    Dialog {
        id: reqDialog
        title: "New Booking Request"
        width: 320
        height: 280
        anchors.centerIn: parent
        modal: true

        Column {
            anchors.fill: parent
            spacing: 10

            TextField {
                id: venueIn
                placeholderText: "Facility ID (e.g. LAB101)"
                font.pixelSize: 12
                width: parent.width
            }

            ComboBox {
                id: slotIn
                model: ["08:00 - 10:00", "10:00 - 12:00", "12:00 - 14:00", "14:00 - 16:00", "16:00 - 18:00"]
                width: parent.width
            }

            ComboBox {
                id: prioIn
                model: ["Level 1 (Low)", "Level 2 (Normal)", "Level 3 (High)", "Level 4 (Emergency)"]
                currentIndex: 1
                width: parent.width
            }

            Button {
                text: "Submit"
                width: parent.width
                onClicked: {
                    requestModel.submitRequest(appController.currentUserId, venueIn.text, slotIn.currentText, prioIn.currentIndex + 1)
                    reqDialog.close()
                }
            }
        }
    }
}
