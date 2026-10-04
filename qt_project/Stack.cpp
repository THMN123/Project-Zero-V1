#include "Stack.h"

UndoStack::UndoStack() {}

void UndoStack::push(const Resource& res) {
    elements.push_back(res);
}

bool UndoStack::pop(Resource& outRes) {
    if (elements.empty()) return false;
    outRes = elements.back();
    elements.pop_back();
    return true;
}

bool UndoStack::peek(Resource& outRes) const {
    if (elements.empty()) return false;
    outRes = elements.back();
    return true;
}

bool UndoStack::isEmpty() const {
    return elements.empty();
}

int UndoStack::size() const {
    return static_cast<int>(elements.size());
}

void UndoStack::clear() {
    elements.clear();
}
