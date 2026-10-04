#include "HashTable.h"
#include <cmath>

HashTable::HashTable(int cap) : capacity(cap) {
    table.resize(capacity, nullptr);
}

HashTable::~HashTable() {
    clear();
}

void HashTable::clear() {
    for (int i = 0; i < capacity; i++) {
        HashNode* curr = table[i];
        while (curr) {
            HashNode* toDel = curr;
            curr = curr->next;
            delete toDel;
        }
        table[i] = nullptr;
    }
}

int HashTable::hashFunction(const std::string& key) const {
    unsigned long hash = 0;
    for (char c : key) {
        hash = (hash * 31 + static_cast<unsigned char>(c)) % capacity;
    }
    return static_cast<int>(hash);
}

void HashTable::insert(const std::string& key, const Resource& res) {
    int idx = hashFunction(key);
    HashNode* curr = table[idx];
    while (curr) {
        if (curr->key == key) {
            curr->value = res;
            return;
        }
        curr = curr->next;
    }
    HashNode* newNode = new HashNode(key, res);
    newNode->next = table[idx];
    table[idx] = newNode;
}

Resource* HashTable::search(const std::string& key, int& stepCount, int& bucketIndex) {
    bucketIndex = hashFunction(key);
    stepCount = 1; // 1 step to calculate hash and access bucket
    HashNode* curr = table[bucketIndex];
    while (curr) {
        stepCount++;
        if (curr->key == key) {
            return &(curr->value);
        }
        curr = curr->next;
    }
    return nullptr;
}

Resource* HashTable::search(const std::string& key) {
    int dummySteps = 0, dummyBucket = 0;
    return search(key, dummySteps, dummyBucket);
}

bool HashTable::remove(const std::string& key) {
    int idx = hashFunction(key);
    HashNode* curr = table[idx];
    HashNode* prev = nullptr;

    while (curr) {
        if (curr->key == key) {
            if (prev) prev->next = curr->next;
            else table[idx] = curr->next;
            delete curr;
            return true;
        }
        prev = curr;
        curr = curr->next;
    }
    return false;
}

int HashTable::getCapacity() const {
    return capacity;
}

std::vector<Resource> HashTable::getAll() const {
    std::vector<Resource> list;
    for (int i = 0; i < capacity; i++) {
        HashNode* curr = table[i];
        while (curr) {
            list.push_back(curr->value);
            curr = curr->next;
        }
    }
    return list;
}
