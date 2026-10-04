#ifndef RESOURCE_H
#define RESOURCE_H

#include <string>
#include <iostream>

class Resource {
private:
    std::string resourceID;
    std::string name;
    std::string type;     // Laboratory, Lecture Room, Equipment, Workshop
    std::string location; // Science Block, Main Hall, etc.
    int capacity;
    std::string status;   // Available, Occupied, Reserved, Maintenance

public:
    Resource();
    Resource(std::string id, std::string n, std::string t, std::string loc, int cap, std::string stat);

    std::string getResourceID() const;
    std::string getName() const;
    std::string getType() const;
    std::string getLocation() const;
    int getCapacity() const;
    std::string getStatus() const;

    void setStatus(const std::string& newStatus);
    void setCapacity(int cap);
    void setLocation(const std::string& loc);
    void setName(const std::string& n);

    void display() const;
};

#endif // RESOURCE_H
