#include "Sorting.h"
#include <chrono>

SortReport Sorter::quickSort(const std::vector<Resource>& items) {
    auto start = std::chrono::high_resolution_clock::now();
    int comps = 0, swaps = 0;
    std::vector<Resource> arr = items;

    auto partition = [&](auto& self, int low, int high) -> int {
        std::string pivot = arr[high].getResourceID();
        int i = low - 1;
        for (int j = low; j < high; j++) {
            comps++;
            if (arr[j].getResourceID() <= pivot) {
                i++;
                swaps++;
                std::swap(arr[i], arr[j]);
            }
        }
        swaps++;
        std::swap(arr[i + 1], arr[high]);
        return i + 1;
    };

    auto sort = [&](auto& self, int low, int high) -> void {
        if (low < high) {
            int pi = partition(partition, low, high);
            self(self, low, pi - 1);
            self(self, pi + 1, high);
        }
    };

    if (!arr.empty()) {
        sort(sort, 0, static_cast<int>(arr.size()) - 1);
    }

    auto end = std::chrono::high_resolution_clock::now();
    double ms = std::chrono::duration<double, std::milli>(end - start).count();
    return {"QuickSort (by Resource ID)", comps, swaps, ms, arr};
}

SortReport Sorter::bubbleSort(const std::vector<Resource>& items) {
    auto start = std::chrono::high_resolution_clock::now();
    int comps = 0, swaps = 0;
    std::vector<Resource> arr = items;
    int n = static_cast<int>(arr.size());

    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            comps++;
            if (arr[j].getCapacity() > arr[j + 1].getCapacity()) {
                swaps++;
                std::swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break;
    }

    auto end = std::chrono::high_resolution_clock::now();
    double ms = std::chrono::duration<double, std::milli>(end - start).count();
    return {"BubbleSort (by Capacity)", comps, swaps, ms, arr};
}

SortReport Sorter::mergeSort(const std::vector<Resource>& items) {
    auto start = std::chrono::high_resolution_clock::now();
    int comps = 0, swaps = 0;

    auto merge = [&](const std::vector<Resource>& left, const std::vector<Resource>& right) -> std::vector<Resource> {
        std::vector<Resource> res;
        size_t i = 0, j = 0;
        while (i < left.size() && j < right.size()) {
            comps++;
            if (left[i].getName() <= right[j].getName()) {
                res.push_back(left[i++]);
            } else {
                res.push_back(right[j++]);
                swaps++;
            }
        }
        while (i < left.size()) res.push_back(left[i++]);
        while (j < right.size()) res.push_back(right[j++]);
        return res;
    };

    auto sort = [&](auto& self, const std::vector<Resource>& list) -> std::vector<Resource> {
        if (list.size() <= 1) return list;
        size_t mid = list.size() / 2;
        std::vector<Resource> left(list.begin(), list.begin() + mid);
        std::vector<Resource> right(list.begin() + mid, list.end());
        return merge(self(self, left), self(self, right));
    };

    std::vector<Resource> sorted = sort(sort, items);
    auto end = std::chrono::high_resolution_clock::now();
    double ms = std::chrono::duration<double, std::milli>(end - start).count();
    return {"MergeSort (by Name)", comps, swaps, ms, sorted};
}
