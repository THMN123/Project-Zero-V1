#include "User.h"

User::User() : userID(""), password(""), role("STUDENT"), fullName(""), program("") {}

User::User(std::string id, std::string pass, std::string r, std::string name, std::string prog)
    : userID(id), password(pass), role(r), fullName(name), program(prog) {}

std::string User::getUserID() const { return userID; }
std::string User::getPassword() const { return password; }
std::string User::getRole() const { return role; }
std::string User::getFullName() const { return fullName; }
std::string User::getProgram() const { return program; }

void User::setPassword(const std::string& p) { password = p; }
void User::setRole(const std::string& r) { role = r; }
void User::setFullName(const std::string& n) { fullName = n; }
void User::setProgram(const std::string& prog) { program = prog; }
