import QtQuick 2.15

Item {
    id: root
    width: 20
    height: 20

    property string name: "building"
    property color color: "#1d1d1f"
    property real strokeWidth: 1.6

    Canvas {
        id: canvas
        anchors.fill: parent
        renderTarget: Canvas.FramebufferObject
        renderStrategy: Canvas.Threaded

        onPaint: {
            var ctx = getContext("2d")
            ctx.clearRect(0, 0, width, height)
            ctx.strokeStyle = root.color
            ctx.fillStyle = root.color
            ctx.lineWidth = root.strokeWidth
            ctx.lineCap = "round"
            ctx.lineJoin = "round"

            var w = width
            var h = height

            if (root.name === "building") {
                // SF Symbol building.2 style
                ctx.beginPath()
                // Main building
                ctx.rect(w * 0.15, w * 0.25, w * 0.45, h * 0.65)
                // Side wing
                ctx.rect(w * 0.60, w * 0.45, w * 0.25, h * 0.45)
                ctx.stroke()

                // Windows
                ctx.beginPath()
                ctx.moveTo(w * 0.28, w * 0.40); ctx.lineTo(w * 0.32, w * 0.40)
                ctx.moveTo(w * 0.43, w * 0.40); ctx.lineTo(w * 0.47, w * 0.40)
                ctx.moveTo(w * 0.28, w * 0.55); ctx.lineTo(w * 0.32, w * 0.55)
                ctx.moveTo(w * 0.43, w * 0.55); ctx.lineTo(w * 0.47, w * 0.55)
                ctx.moveTo(w * 0.70, w * 0.60); ctx.lineTo(w * 0.75, w * 0.60)
                ctx.stroke()
            }
            else if (root.name === "calendar") {
                // SF Symbol calendar
                ctx.beginPath()
                ctx.rect(w * 0.15, h * 0.20, w * 0.70, h * 0.68)
                ctx.moveTo(w * 0.15, h * 0.42); ctx.lineTo(w * 0.85, h * 0.42)
                ctx.stroke()

                // Binder rings
                ctx.beginPath()
                ctx.moveTo(w * 0.32, h * 0.12); ctx.lineTo(w * 0.32, h * 0.24)
                ctx.moveTo(w * 0.68, h * 0.12); ctx.lineTo(w * 0.68, h * 0.24)
                ctx.stroke()

                // Event dot
                ctx.beginPath()
                ctx.arc(w * 0.50, h * 0.62, 1.8, 0, 2 * Math.PI)
                ctx.fill()
            }
            else if (root.name === "compass") {
                // SF Symbol safari / compass
                ctx.beginPath()
                ctx.arc(w * 0.50, h * 0.50, w * 0.38, 0, 2 * Math.PI)
                ctx.stroke()

                ctx.beginPath()
                ctx.moveTo(w * 0.62, h * 0.38)
                ctx.lineTo(w * 0.42, h * 0.48)
                ctx.lineTo(w * 0.38, h * 0.62)
                ctx.lineTo(w * 0.58, h * 0.52)
                ctx.closePath()
                ctx.stroke()
            }
            else if (root.name === "tray") {
                // SF Symbol tray.full / queue
                ctx.beginPath()
                ctx.moveTo(w * 0.15, h * 0.30)
                ctx.lineTo(w * 0.85, h * 0.30)
                ctx.stroke()

                ctx.beginPath()
                ctx.moveTo(w * 0.15, h * 0.48)
                ctx.lineTo(w * 0.85, h * 0.48)
                ctx.stroke()

                ctx.beginPath()
                ctx.moveTo(w * 0.15, h * 0.65)
                ctx.lineTo(w * 0.35, h * 0.65)
                ctx.lineTo(w * 0.42, h * 0.78)
                ctx.lineTo(w * 0.58, h * 0.78)
                ctx.lineTo(w * 0.65, h * 0.65)
                ctx.lineTo(w * 0.85, h * 0.65)
                ctx.lineTo(w * 0.85, h * 0.85)
                ctx.lineTo(w * 0.15, h * 0.85)
                ctx.closePath()
                ctx.stroke()
            }
            else if (root.name === "ellipsis") {
                // SF Symbol ellipsis.circle
                ctx.beginPath()
                ctx.arc(w * 0.50, h * 0.50, w * 0.38, 0, 2 * Math.PI)
                ctx.stroke()

                ctx.beginPath()
                ctx.arc(w * 0.32, h * 0.50, 1.4, 0, 2 * Math.PI)
                ctx.arc(w * 0.50, h * 0.50, 1.4, 0, 2 * Math.PI)
                ctx.arc(w * 0.68, h * 0.50, 1.4, 0, 2 * Math.PI)
                ctx.fill()
            }
            else if (root.name === "search") {
                ctx.beginPath()
                ctx.arc(w * 0.42, h * 0.42, w * 0.26, 0, 2 * Math.PI)
                ctx.stroke()
                ctx.beginPath()
                ctx.moveTo(w * 0.60, h * 0.60)
                ctx.lineTo(w * 0.84, h * 0.84)
                ctx.stroke()
            }
            else if (root.name === "undo") {
                ctx.beginPath()
                ctx.arc(w * 0.52, h * 0.54, w * 0.28, Math.PI * 0.8, Math.PI * 0.1)
                ctx.stroke()
                ctx.beginPath()
                ctx.moveTo(w * 0.24, h * 0.38)
                ctx.lineTo(w * 0.32, h * 0.22)
                ctx.lineTo(w * 0.44, h * 0.36)
                ctx.stroke()
            }
            else if (root.name === "shield") {
                ctx.beginPath()
                ctx.moveTo(w * 0.50, h * 0.14)
                ctx.lineTo(w * 0.82, h * 0.24)
                ctx.lineTo(w * 0.82, h * 0.54)
                ctx.bezierCurveTo(w * 0.82, h * 0.74, w * 0.50, h * 0.88, w * 0.50, h * 0.88)
                ctx.bezierCurveTo(w * 0.50, h * 0.88, w * 0.18, h * 0.74, w * 0.18, h * 0.54)
                ctx.lineTo(w * 0.18, h * 0.24)
                ctx.closePath()
                ctx.stroke()
            }
            else if (root.name === "briefcase") {
                ctx.beginPath()
                ctx.rect(w * 0.15, h * 0.34, w * 0.70, h * 0.54)
                ctx.stroke()
                ctx.beginPath()
                ctx.rect(w * 0.34, h * 0.18, w * 0.32, h * 0.16)
                ctx.stroke()
            }
            else if (root.name === "graduationCap") {
                ctx.beginPath()
                ctx.moveTo(w * 0.50, h * 0.22)
                ctx.lineTo(w * 0.86, h * 0.38)
                ctx.lineTo(w * 0.50, h * 0.54)
                ctx.lineTo(w * 0.14, h * 0.38)
                ctx.closePath()
                ctx.stroke()
                ctx.beginPath()
                ctx.moveTo(w * 0.28, h * 0.44)
                ctx.lineTo(w * 0.28, h * 0.68)
                ctx.bezierCurveTo(w * 0.28, h * 0.76, w * 0.72, h * 0.76, w * 0.72, h * 0.68)
                ctx.lineTo(w * 0.72, h * 0.44)
                ctx.stroke()
            }
            else if (root.name === "xmark") {
                ctx.beginPath()
                ctx.moveTo(w * 0.25, h * 0.25)
                ctx.lineTo(w * 0.75, h * 0.75)
                ctx.moveTo(w * 0.75, h * 0.25)
                ctx.lineTo(w * 0.25, h * 0.75)
                ctx.stroke()
            }
        }
    }

    onColorChanged: canvas.requestPaint()
    onNameChanged: canvas.requestPaint()
    Component.onCompleted: canvas.requestPaint()
}
