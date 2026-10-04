#ifndef BOTTOMNAVBAR_H
#define BOTTOMNAVBAR_H

#include <QWidget>
#include <QPushButton>
#include <QHBoxLayout>
#include <vector>

class BottomNavBar : public QWidget {
    Q_OBJECT

private:
    std::vector<QPushButton*> buttons;
    int currentIndex;

public:
    explicit BottomNavBar(QWidget* parent = nullptr);

    void setCurrentIndex(int index);
    int getCurrentIndex() const;

signals:
    void tabChanged(int index);

private slots:
    void handleButtonClicked(int index);

protected:
    void paintEvent(QPaintEvent* event) override;
};

#endif // BOTTOMNAVBAR_H
