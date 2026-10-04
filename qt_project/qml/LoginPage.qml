import QtQuick 2.15
import QtQuick.Controls 2.15

Rectangle {
    id: root
    anchors.fill: parent
    color: "rgba(0, 0, 0, 0.32)"
    visible: false

    signal userLoggedIn()

    function open() {
        errorMsg.text = ""
        root.visible = true
    }

    function close() {
        root.visible = false
    }

    MouseArea {
        anchors.fill: parent
        onClicked: root.close()
    }

    // Modal Card (Apple Sheet Design)
    Rectangle {
        id: card
        width: Math.min(380, parent.width - 32)
        height: 480
        anchors.centerIn: parent
        radius: 24
        color: "#ffffff"
        border.color: "rgba(0, 0, 0, 0.08)"
        border.width: 1

        MouseArea {
            anchors.fill: parent
        }

        Column {
            anchors.fill: parent
            anchors.margins: 24
            spacing: 16

            Row {
                width: parent.width
                Text {
                    text: "Switch Persona"
                    font.family: "-apple-system, 'SF Pro Display', sans-serif"
                    font.pixelSize: 20
                    font.weight: Font.Bold
                    color: "#1d1d1f"
                }
                Item { width: 1; height: 1; Layout.fillWidth: true }
                AppleIcon {
                    name: "xmark"
                    color: "#86868b"
                    width: 16
                    height: 16
                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        onClicked: root.close()
                    }
                }
            }

            Text {
                text: "Select a verified profile or enter credentials to sign in."
                font.family: "-apple-system, sans-serif"
                font.pixelSize: 12
                color: "#86868b"
            }

            // Demo Profiles Header
            Text {
                text: "VERIFIED DEMO PROFILES"
                font.pixelSize: 10
                font.weight: Font.Bold
                font.letterSpacing: 0.5
                color: "#86868b"
            }

            Column {
                width: parent.width
                spacing: 8

                Repeater {
                    model: appController.getDemoUsers()
                    delegate: Rectangle {
                        width: parent.width
                        height: 52
                        radius: 14
                        color: "#f5f5f7"
                        border.color: "rgba(0, 0, 0, 0.04)"

                        MouseArea {
                            anchors.fill: parent
                            cursorShape: Qt.PointingHandCursor
                            onClicked: {
                                appController.switchPersona(modelData.role)
                                root.userLoggedIn()
                                root.close()
                            }
                        }

                        Row {
                            anchors.fill: parent
                            anchors.margins: 10
                            spacing: 12

                            Rectangle {
                                width: 32
                                height: 32
                                radius: 16
                                color: "#ffffff"
                                border.color: "rgba(0, 0, 0, 0.06)"

                                AppleIcon {
                                    anchors.centerIn: parent
                                    name: modelData.role === "ADMIN" ? "shield" : modelData.role === "LECTURER" ? "briefcase" : "graduationCap"
                                    color: modelData.role === "ADMIN" ? "#0071e3" : modelData.role === "LECTURER" ? "#ff9500" : "#34c759"
                                    width: 16
                                    height: 16
                                }
                            }

                            Column {
                                anchors.verticalCenter: parent.verticalCenter
                                Text {
                                    text: modelData.fullName
                                    font.family: "-apple-system, sans-serif"
                                    font.pixelSize: 13
                                    font.weight: Font.DemiBold
                                    color: "#1d1d1f"
                                }
                                Text {
                                    text: modelData.userId + " · " + modelData.role + (modelData.program ? " (" + modelData.program + ")" : "")
                                    font.pixelSize: 10
                                    color: "#86868b"
                                }
                            }
                        }
                    }
                }
            }

            Text {
                text: "MANUAL CREDENTIALS"
                font.pixelSize: 10
                font.weight: Font.Bold
                font.letterSpacing: 0.5
                color: "#86868b"
            }

            TextField {
                id: idInput
                width: parent.width
                placeholderText: "User ID (e.g. admin)"
                font.pixelSize: 12
            }

            TextField {
                id: passInput
                width: parent.width
                placeholderText: "Password"
                echoMode: TextInput.Password
                font.pixelSize: 12
            }

            Text {
                id: errorMsg
                text: ""
                font.pixelSize: 11
                color: "#ff3b30"
                visible: text.length > 0
            }

            Button {
                width: parent.width
                text: "Sign In"
                onClicked: {
                    if (appController.login(idInput.text, passInput.text)) {
                        root.userLoggedIn()
                        root.close()
                    } else {
                        errorMsg.text = "Invalid User ID or password."
                    }
                }
            }
        }
    }
}
