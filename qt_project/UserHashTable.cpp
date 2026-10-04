#include "UserHashTable.h"

UserHashTable::UserHashTable(int cap) : capacity(cap) {
    table.resize(capacity, nullptr);
}

UserHashTable::~UserHashTable() {
    clear();
}

void UserHashTable::clear() {
    for (int i = 0; i < capacity; i++) {
        UserHashNode* curr = table[i];
        while (curr) {
            UserHashNode* toDel = curr;
            curr = curr->next;
            delete toDel;
        }
        table[i] = nullptr;
    }
}

int UserHashTable::hashFunction(const std::string& key) const {
    unsigned long hash = 0;
    for (char c : key) {
        hash = (hash * 31 + static_cast<unsigned char>(c)) % capacity;
    }
    return static_cast<int>(hash);
}

void UserHashTable::insert(const std::string& key, const User& user) {
    int idx = hashFunction(key);
    UserHashNode* curr = table[idx];
    while (curr) {
        if (curr->key == key) {
            curr->value = user;
            return;
        }
        curr = curr->next;
    }
    UserHashNode* newNode = new UserHashNode(key, user);
    newNode->next = table[idx];
    table[idx] = newNode;
}

User* UserHashTable::search(const std::string& key) {
    int idx = hashFunction(key);
    UserHashNode* curr = table[idx];
    while (curr) {
        if (curr->key == key) {
            return &(curr->value);
        }
        curr = curr->next;
    }
    return nullptr;
}

bool UserHashTable::authenticate(const std::string& id, const std::string& pass, User& outUser) {
    User* found = search(id);
    if (found && found->getPassword() == pass) {
        outUser = *found;
        return true;
    }
    return false;
}

std::vector<User> UserHashTable::getAll() const {
    std::vector<User> list;
    for (int i = 0; i < capacity; i++) {
        UserHashNode* curr = table[i];
        while (curr) {
            list.push_back(curr->value);
            curr = curr->next;
        }
    }
    return list;
}
