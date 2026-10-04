#include "Request.h"

Request::Request() : requestID(""), userID(""), resourceID(""), requestTime(""), status("Pending"), priority(1) {}

Request::Request(std::string rId, std::string uId, std::string resId, std::string time, std::string stat, int prio)
    : requestID(rId), userID(uId), resourceID(resId), requestTime(time), status(stat), priority(prio) {}

std::string Request::getRequestID() const { return requestID; }
std::string Request::getUserID() const { return userID; }
std::string Request::getResourceID() const { return resourceID; }
std::string Request::getRequestTime() const { return requestTime; }
std::string Request::getStatus() const { return status; }
int Request::getPriority() const { return priority; }

void Request::setStatus(const std::string& stat) { status = stat; }
void Request::setPriority(int p) { priority = p; }

void Request::display() const {
    std::cout << "Request #" << requestID << " from " << userID 
              << " for " << resourceID << " at " << requestTime 
              << " [Priority " << priority << "] Status: " << status << std::endl;
}
