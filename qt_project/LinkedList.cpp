#include "LinkedList.h"

LinkedList::LinkedList() : head(nullptr), size(0) {}

LinkedList::~LinkedList() {
    clear();
}

void LinkedList::clear() {
    Node* curr = head;
    while (curr) {
        Node* next = curr->next;
        delete curr;
        curr = next;
    }
    head = nullptr;
    size = 0;
}

void LinkedList::insertAtEnd(const Resource& val) {
    Node* newNode = new Node(val);
    if (!head) {
        head = newNode;
    } else {
        Node* temp = head;
        while (temp->next) temp = temp->next;
        temp->next = newNode;
    }
    size++;
}

bool LinkedList::deleteResource(const std::string& id) {
    if (!head) return false;
    if (head->data.getResourceID() == id) {
        Node* toDel = head;
        head = head->next;
        delete toDel;
        size--;
        return true;
    }
    Node* curr = head;
    while (curr->next && curr->next->data.getResourceID() != id) {
        curr = curr->next;
    }
    if (curr->next) {
        Node* toDel = curr->next;
        curr->next = toDel->next;
        delete toDel;
        size--;
        return true;
    }
    return false;
}

Resource* LinkedList::searchResource(const std::string& id, int& stepCount) {
    stepCount = 0;
    Node* curr = head;
    while (curr) {
        stepCount++;
        if (curr->data.getResourceID() == id) {
            return &(curr->data);
        }
        curr = curr->next;
    }
    return nullptr;
}

Resource* LinkedList::searchResource(const std::string& id) {
    int dummy = 0;
    return searchResource(id, dummy);
}

int LinkedList::getSize() const {
    return size;
}

std::vector<Resource> LinkedList::toVector() const {
    std::vector<Resource> list;
    Node* curr = head;
    while (curr) {
        list.push_back(curr->data);
        curr = curr->next;
    }
    return list;
}
