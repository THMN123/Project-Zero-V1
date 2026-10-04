#ifndef USER_H
#define USER_H

#include <string>

class User {
private:
    std::string userID;
    std::string password;
    std::string role; // ADMIN, LECTURER, STUDENT
    std::string fullName;
    std::string program;

public:
    User();
    User(std::string id, std::string pass, std::string r, std::string name, std::string prog = "");

    std::string getUserID() const;
    std::string getPassword() const;
    std::string getRole() const;
    std::string getFullName() const;
    std::string getProgram() const;

    void setPassword(const std::string& p);
    void setRole(const std::string& r);
    void setFullName(const std::string& n);
    void setProgram(const std::string& prog);
};

#endif // USER_H
