import QtQuick 2.15

pragma Singleton

QtObject {
    readonly property color canvasBg: "#f5f5f7"
    readonly property color cardBg: "#ffffff"
    readonly property color cardBgTranslucent: "rgba(255, 255, 255, 0.82)"
    readonly property color appleBlue: "#0071e3"
    readonly property color appleGreen: "#34c759"
    readonly property color appleRed: "#ff3b30"
    readonly property color appleOrange: "#ff9500"
    readonly property color textPrimary: "#1d1d1f"
    readonly property color textSecondary: "#86868b"
    readonly property color borderSubtle: "#e5e5ea"
    readonly property color borderCard: "rgba(0, 0, 0, 0.06)"
    
    readonly property string fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', Inter, sans-serif"
    readonly property string monoFont: "'SF Mono', 'JetBrains Mono', Menlo, Monaco, monospace"
    
    readonly property int radiusCard: 18
    readonly property int radiusButton: 20
    readonly property int radiusPill: 26
}
