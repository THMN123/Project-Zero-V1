#ifndef THEME_H
#define THEME_H

#include <QString>

namespace AppleTheme {
    const QString PRIMARY_BLUE   = "#0071e3";
    const QString ACCENT_GREEN   = "#34c759";
    const QString ACCENT_ORANGE  = "#ff9500";
    const QString ACCENT_RED     = "#ff3b30";
    const QString BG_CANVAS      = "#f5f5f7";
    const QString BG_CARD        = "#ffffff";
    const QString TEXT_PRIMARY   = "#1d1d1f";
    const QString TEXT_SECONDARY = "#86868b";
    const QString BORDER_COLOR   = "#e5e5ea";

    inline QString getGlobalStyleSheet() {
        return QString(R"(
            QWidget {
                background-color: %1;
                color: %2;
                font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", "Inter", sans-serif;
                font-size: 13px;
            }
            QMainWindow {
                background-color: %1;
            }
            QFrame.apple-card {
                background-color: %3;
                border: 1px solid %4;
                border-radius: 16px;
            }
            QPushButton {
                background-color: %3;
                color: %2;
                border: 1px solid %4;
                border-radius: 18px;
                padding: 8px 16px;
                font-weight: 600;
            }
            QPushButton:hover {
                background-color: #f2f2f7;
            }
            QPushButton:pressed {
                background-color: #e5e5ea;
            }
            QPushButton.primary {
                background-color: %5;
                color: #ffffff;
                border: none;
            }
            QPushButton.primary:hover {
                background-color: #0077ed;
            }
            QLineEdit, QComboBox {
                background-color: #ffffff;
                border: 1px solid %4;
                border-radius: 10px;
                padding: 6px 12px;
                color: %2;
            }
            QLineEdit:focus, QComboBox:focus {
                border: 1.5px solid %5;
            }
            QTableWidget {
                background-color: #ffffff;
                border: 1px solid %4;
                border-radius: 12px;
                gridline-color: #f2f2f7;
                selection-background-color: rgba(0, 113, 227, 0.1);
                selection-color: %5;
            }
            QHeaderView::section {
                background-color: #fbfbfd;
                color: %6;
                padding: 6px;
                border: none;
                border-bottom: 1px solid %4;
                font-size: 11px;
                font-weight: 600;
                text-transform: uppercase;
            }
            QScrollBar:vertical {
                border: none;
                background: transparent;
                width: 8px;
                margin: 0px;
            }
            QScrollBar::handle:vertical {
                background: #d2d2d7;
                min-height: 20px;
                border-radius: 4px;
            }
        )").arg(BG_CANVAS, TEXT_PRIMARY, BG_CARD, BORDER_COLOR, PRIMARY_BLUE, TEXT_SECONDARY);
    }
}

#endif // THEME_H
