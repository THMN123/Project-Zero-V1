#ifndef USERHASHTABLE_H
#define USERHASHTABLE_H

#include "User.h"
#include <string>
#include <vector>

struct UserHashNode {
    std::string key;
    User value;
    UserHashNode* next;
    UserHashNode(std::string k, User v) : key(k), value(v), next(nullptr) {}
};

class UserHashTable {
private:
    int capacity;
    std::vector<UserHashNode*> table;
    int hashFunction(const std::string& key) const;

public:
    UserHashTable(int cap = 31);
    ~UserHashTable();

    void insert(const std::string& key, const User& user);
    User* search(const std::string& key);
    bool authenticate(const std::string& id, const std::string& pass, User& outUser);
    std::vector<User> getAll() const;
    void clear();
};

#endif // USERHASHTABLE_H
