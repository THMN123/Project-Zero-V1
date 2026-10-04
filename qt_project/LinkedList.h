#ifndef LINKEDLIST_H
#define LINKEDLIST_H

#include "Resource.h"
#include <vector>

class Node {
public:
    Resource data;
    Node* next;
    Node(Resource val) : data(val), next(nullptr) {}
};

class LinkedList {
private:
    Node* head;
    int size;

public:
    LinkedList();
    ~LinkedList();

    void insertAtEnd(const Resource& val);
    bool deleteResource(const std::string& id);
    Resource* searchResource(const std::string& id, int& stepCount);
    Resource* searchResource(const std::string& id);
    int getSize() const;
    void clear();

    std::vector<Resource> toVector() const;
};

#endif // LINKEDLIST_H
