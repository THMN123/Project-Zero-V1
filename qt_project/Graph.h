#ifndef GRAPH_H
#define GRAPH_H

#include <string>
#include <vector>

struct DijkstraResult {
    std::string startLocation;
    std::vector<std::string> path;
    int distance;
    bool reachable;
};

class Graph {
private:
    std::vector<std::string> locations;
    std::vector<std::vector<int>> adjMatrix;

    int getLocationIndex(const std::string& location) const;

public:
    Graph();

    bool addLocation(const std::string& location);
    bool addConnection(const std::string& loc1, const std::string& loc2, int weight = 1);

    std::vector<std::string> getLocations() const;
    std::vector<std::vector<int>> getMatrix() const;
    int getNumVertices() const;

    std::vector<std::string> BFS(const std::string& startLoc) const;
    std::vector<std::string> DFS(const std::string& startLoc) const;
    DijkstraResult dijkstra(const std::string& startLoc, const std::string& destLoc) const;
    std::vector<DijkstraResult> dijkstraAll(const std::string& startLoc) const;

private:
    void DFSRecursive(int vertexIdx, std::vector<bool>& visited, std::vector<std::string>& traversal) const;
};

#endif // GRAPH_H
