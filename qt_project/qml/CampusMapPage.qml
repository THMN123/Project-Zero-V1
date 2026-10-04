import QtQuick 2.15
import QtQuick.Controls 2.15
import QtQuick.Layouts 1.15

Item {
    id: root

    readonly property var venues: campusMapController.getVenues()
    readonly property var connections: campusMapController.getConnections()

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
                        text: "Campus Navigation & Shortest Path"
                        font.family: "-apple-system, sans-serif"
                        font.pixelSize: 22
                        font.weight: Font.Bold
                        color: "#1d1d1f"
                    }
                    Text {
                        text: "Dijkstra Minimum Walking Route & 2D Vector Spatial Graph"
                        font.pixelSize: 12
                        color: "#86868b"
                    }
                }
            }

            // Route Selector Card
            Rectangle {
                width: parent.width
                height: 100
                radius: 16
                color: "#ffffff"
                border.color: "rgba(0, 0, 0, 0.06)"

                Column {
                    anchors.fill: parent
                    anchors.margins: 14
                    spacing: 10

                    RowLayout {
                        width: parent.width
                        spacing: 12

                        Text { text: "Start:"; font.pixelSize: 12; font.weight: Font.DemiBold; color: "#86868b" }
                        ComboBox {
                            id: startCb
                            model: ["Library", "ICTLAB", "Main Hall", "Admin Block", "Science Block", "Engineering Block", "Student Centre", "Sports Pavilion"]
                            currentIndex: 0
                            onActivated: {
                                campusMapController.startVenue = currentText
                                mapCanvas.requestPaint()
                            }
                        }

                        Text { text: "Destination:"; font.pixelSize: 12; font.weight: Font.DemiBold; color: "#86868b" }
                        ComboBox {
                            id: destCb
                            model: ["Library", "ICTLAB", "Main Hall", "Admin Block", "Science Block", "Engineering Block", "Student Centre", "Sports Pavilion"]
                            currentIndex: 4
                            onActivated: {
                                campusMapController.destVenue = currentText
                                mapCanvas.requestPaint()
                            }
                        }

                        Item { Layout.fillWidth: true }
                    }

                    Text {
                        text: "Dijkstra Route: " + campusMapController.routePath.join(" → ") + " (" + campusMapController.routeDistance + " walking units)"
                        font.pixelSize: 12
                        color: "#0071e3"
                        font.weight: Font.DemiBold
                    }
                }
            }

            // 2D Vector Canvas Map
            Rectangle {
                width: parent.width
                height: 380
                radius: 18
                color: "#fbfbfd"
                border.color: "rgba(0, 0, 0, 0.08)"

                Canvas {
                    id: mapCanvas
                    anchors.fill: parent
                    anchors.margins: 16

                    onPaint: {
                        var ctx = getContext("2d")
                        ctx.clearRect(0, 0, width, height)

                        var scaleX = (width - 60) / 580
                        var scaleY = (height - 60) / 360

                        function getVenuePos(name) {
                            for (var i = 0; i < root.venues.length; i++) {
                                if (root.venues[i].name === name) {
                                    return {
                                        x: 30 + root.venues[i].x * scaleX,
                                        y: 30 + root.venues[i].y * scaleY
                                    }
                                }
                            }
                            return { x: width / 2, y: height / 2 }
                        }

                        function isEdgeInPath(from, to) {
                            var p = campusMapController.routePath
                            for (var i = 0; i < p.length - 1; i++) {
                                if ((p[i] === from && p[i+1] === to) || (p[i] === to && p[i+1] === from)) {
                                    return true
                                }
                            }
                            return false
                        }

                        // Draw Pathways
                        for (var i = 0; i < root.connections.length; i++) {
                            var conn = root.connections[i]
                            var p1 = getVenuePos(conn.from)
                            var p2 = getVenuePos(conn.to)
                            var active = isEdgeInPath(conn.from, conn.to)

                            ctx.beginPath()
                            ctx.moveTo(p1.x, p1.y)
                            ctx.lineTo(p2.x, p2.y)
                            ctx.strokeStyle = active ? "#0071e3" : "#d2d2d7"
                            ctx.lineWidth = active ? 4 : 1.5
                            ctx.stroke()

                            // Weight box
                            var midX = (p1.x + p2.x) / 2
                            var midY = (p1.y + p2.y) / 2
                            ctx.fillStyle = active ? "#0071e3" : "#ffffff"
                            ctx.fillRect(midX - 10, midY - 7, 20, 14)
                            ctx.strokeStyle = active ? "#0071e3" : "#d2d2d7"
                            ctx.lineWidth = 1
                            ctx.strokeRect(midX - 10, midY - 7, 20, 14)

                            ctx.fillStyle = active ? "#ffffff" : "#86868b"
                            ctx.font = "bold 9px sans-serif"
                            ctx.textAlign = "center"
                            ctx.fillText(conn.weight, midX, midY + 3)
                        }

                        // Draw Venue Nodes
                        for (var v = 0; v < root.venues.length; v++) {
                            var venue = root.venues[v]
                            var pos = getVenuePos(venue.name)
                            var isStart = venue.name === campusMapController.startVenue
                            var isDest = venue.name === campusMapController.destVenue
                            var inPath = campusMapController.routePath.indexOf(venue.name) !== -1

                            // Outer glow
                            if (isStart || isDest) {
                                ctx.beginPath()
                                ctx.arc(pos.x, pos.y, 22, 0, 2 * Math.PI)
                                ctx.fillStyle = isStart ? "rgba(52, 199, 89, 0.18)" : "rgba(0, 113, 227, 0.18)"
                                ctx.fill()
                            }

                            // Inner Node
                            ctx.beginPath()
                            ctx.arc(pos.x, pos.y, 14, 0, 2 * Math.PI)
                            ctx.fillStyle = isStart ? "#34c759" : isDest ? "#0071e3" : inPath ? "#e8f2ff" : "#ffffff"
                            ctx.fill()
                            ctx.strokeStyle = isStart ? "#2fb34f" : isDest ? "#0071e3" : inPath ? "#0071e3" : "#d2d2d7"
                            ctx.lineWidth = 2
                            ctx.stroke()

                            // Venue Code
                            ctx.fillStyle = (isStart || isDest) ? "#ffffff" : "#1d1d1f"
                            ctx.font = "bold 8px monospace"
                            ctx.textAlign = "center"
                            ctx.fillText(venue.code, pos.x, pos.y + 3)

                            // Venue Name
                            ctx.fillStyle = isStart ? "#2fb34f" : isDest ? "#0071e3" : "#1d1d1f"
                            ctx.font = "600 10px sans-serif"
                            ctx.textAlign = "center"
                            ctx.fillText(venue.name, pos.x, pos.y + 26)
                        }
                    }
                }
            }
        }
    }
}
