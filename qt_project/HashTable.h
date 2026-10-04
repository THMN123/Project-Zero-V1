#ifndef HASHTABLE_H
#define HASHTABLE_H

#include "Resource.h"
#include <string>
#include <vector>

struct HashNode {
    std::string key;
    Resource value;
    HashNode* next;
    HashNode(std::string k, Resource v) : key(k), value(v), next(nullptr) {}
};

class HashTable {
private:
    int capacity;
    std::vector<HashNode*> table;
    int hashFunction(const std::string& key) const;

public:
    HashTable(int cap = 31);
    ~HashTable();

    void insert(const std::string& key, const Resource& res);
    Resource* search(const std::string& key, int& stepCount, int& bucketIndex);
    Resource* search(const std::string& key);
    bool remove(const std::string& key);
    void clear();

    int getCapacity() const;
    std::vector<Resource> getAll() const;
};

#endif // HASHTABLE_H
