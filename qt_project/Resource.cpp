#include "Resource.h"

Resource::Resource() : resourceID(""), name(""), type(""), location(""), capacity(0), status("Available") {}

Resource::Resource(std::string id, std::string n, std::string t, std::string loc, int cap, std::string stat)
    : resourceID(id), name(n), type(t), location(loc), capacity(cap), status(stat) {}

std::string Resource::getResourceID() const { return resourceID; }
std::string Resource::getName() const { return name; }
std::string Resource::getType() const { return type; }
std::string Resource::getLocation() const { return location; }
int Resource::getCapacity() const { return capacity; }
std::string Resource::getStatus() const { return status; }

void Resource::setStatus(const std::string& newStatus) { status = newStatus; }
void Resource::setCapacity(int cap) { capacity = cap; }
void Resource::setLocation(const std::string& loc) { location = loc; }
void Resource::setName(const std::string& n) { name = n; }

void Resource::display() const {
    std::cout << "[" << resourceID << "] " << name 
              << " (" << type << ", " << location << ", Cap: " << capacity 
              << ", Status: " << status << ")" << std::endl;
}
