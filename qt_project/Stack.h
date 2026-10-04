#ifndef STACK_H
#define STACK_H

#include "Resource.h"
#include <vector>

class UndoStack {
private:
    std::vector<Resource> elements;

public:
    UndoStack();

    void push(const Resource& res);
    bool pop(Resource& outRes);
    bool peek(Resource& outRes) const;
    bool isEmpty() const;
    int size() const;
    void clear();
};

#endif // STACK_H
