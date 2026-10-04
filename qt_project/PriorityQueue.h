#ifndef PRIORITYQUEUE_H
#define PRIORITYQUEUE_H

#include "Request.h"
#include <vector>

class PriorityQueue {
private:
    std::vector<Request> heap;

    void heapifyUp(int index);
    void heapifyDown(int index);

public:
    PriorityQueue();

    void enqueue(const Request& req);
    bool dequeue(Request& outReq);
    bool peek(Request& outReq) const;
    int size() const;
    bool isEmpty() const;
    void clear();

    std::vector<Request> toVector() const;
};

#endif // PRIORITYQUEUE_H
