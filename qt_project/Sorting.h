#ifndef SORTING_H
#define SORTING_H

#include "Resource.h"
#include <vector>

struct SortReport {
    std::string algorithm;
    int comparisons;
    int swaps;
    double durationMs;
    std::vector<Resource> sortedList;
};

class Sorter {
public:
    static SortReport quickSort(const std::vector<Resource>& items);
    static SortReport bubbleSort(const std::vector<Resource>& items);
    static SortReport mergeSort(const std::vector<Resource>& items);
};

#endif // SORTING_H
