#include "PriorityQueue.h"

PriorityQueue::PriorityQueue() {}

void PriorityQueue::enqueue(const Request& req) {
    heap.push_back(req);
    heapifyUp(static_cast<int>(heap.size()) - 1);
}

bool PriorityQueue::dequeue(Request& outReq) {
    if (heap.empty()) return false;
    outReq = heap[0];
    heap[0] = heap.back();
    heap.pop_back();
    if (!heap.empty()) {
        heapifyDown(0);
    }
    return true;
}

bool PriorityQueue::peek(Request& outReq) const {
    if (heap.empty()) return false;
    outReq = heap[0];
    return true;
}

int PriorityQueue::size() const {
    return static_cast<int>(heap.size());
}

bool PriorityQueue::isEmpty() const {
    return heap.empty();
}

void PriorityQueue::clear() {
    heap.clear();
}

std::vector<Request> PriorityQueue::toVector() const {
    return heap;
}

void PriorityQueue::heapifyUp(int index) {
    int curr = index;
    while (curr > 0) {
        int parent = (curr - 1) / 2;
        if (heap[curr].getPriority() > heap[parent].getPriority()) {
            std::swap(heap[curr], heap[parent]);
            curr = parent;
        } else {
            break;
        }
    }
}

void PriorityQueue::heapifyDown(int index) {
    int curr = index;
    int length = static_cast<int>(heap.size());

    while (true) {
        int left = 2 * curr + 1;
        int right = 2 * curr + 2;
        int largest = curr;

        if (left < length && heap[left].getPriority() > heap[largest].getPriority()) {
            largest = left;
        }
        if (right < length && heap[right].getPriority() > heap[largest].getPriority()) {
            largest = right;
        }

        if (largest != curr) {
            std::swap(heap[curr], heap[largest]);
            curr = largest;
        } else {
            break;
        }
    }
}
