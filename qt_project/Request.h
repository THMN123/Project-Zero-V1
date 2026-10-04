#ifndef REQUEST_H
#define REQUEST_H

#include <string>
#include <iostream>

class Request {
private:
    std::string requestID;
    std::string userID;
    std::string resourceID;
    std::string requestTime;
    std::string status; // Pending, Approved, Rejected
    int priority;       // 4: Emergency, 3: High, 2: Normal, 1: Low

public:
    Request();
    Request(std::string rId, std::string uId, std::string resId, std::string time, std::string stat, int prio);

    std::string getRequestID() const;
    std::string getUserID() const;
    std::string getResourceID() const;
    std::string getRequestTime() const;
    std::string getStatus() const;
    int getPriority() const;

    void setStatus(const std::string& stat);
    void setPriority(int p);

    void display() const;
};

#endif // REQUEST_H
