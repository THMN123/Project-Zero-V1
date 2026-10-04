#include "Graph.h"
#include <queue>
#include <climits>
#include <algorithm>

Graph::Graph() {}

int Graph::getLocationIndex(const std::string& location) const {
    for (size_t i = 0; i < locations.size(); i++) {
        if (locations[i] == location) return static_cast<int>(i);
    }
    return -1;
}

bool Graph::addLocation(const std::string& location) {
    if (getLocationIndex(location) != -1) return false;
    locations.push_back(location);
    size_t n = locations.size();
    for (auto& row : adjMatrix) {
        row.push_back(0);
    }
    adjMatrix.push_back(std::vector<int>(n, 0));
    return true;
}

bool Graph::addConnection(const std::string& loc1, const std::string& loc2, int weight) {
    int i = getLocationIndex(loc1);
    int j = getLocationIndex(loc2);
    if (i == -1 || j == -1) return false;
    adjMatrix[i][j] = weight;
    adjMatrix[j][i] = weight;
    return true;
}

std::vector<std::string> Graph::getLocations() const {
    return locations;
}

std::vector<std::vector<int>> Graph::getMatrix() const {
    return adjMatrix;
}

int Graph::getNumVertices() const {
    return static_cast<int>(locations.size());
}

std::vector<std::string> Graph::BFS(const std::string& startLoc) const {
    int startIdx = getLocationIndex(startLoc);
    if (startIdx == -1) return {};

    std::vector<bool> visited(locations.size(), false);
    std::queue<int> q;
    std::vector<std::string> traversal;

    visited[startIdx] = true;
    q.push(startIdx);

    while (!q.empty()) {
        int curr = q.front();
        q.pop();
        traversal.push_back(locations[curr]);

        for (size_t i = 0; i < locations.size(); i++) {
            if (adjMatrix[curr][i] > 0 && !visited[i]) {
                visited[i] = true;
                q.push(static_cast<int>(i));
            }
        }
    }
    return traversal;
}

std::vector<std::string> Graph::DFS(const std::string& startLoc) const {
    int startIdx = getLocationIndex(startLoc);
    if (startIdx == -1) return {};

    std::vector<bool> visited(locations.size(), false);
    std::vector<std::string> traversal;
    DFSRecursive(startIdx, visited, traversal);
    return traversal;
}

void Graph::DFSRecursive(int vertexIdx, std::vector<bool>& visited, std::vector<std::string>& traversal) const {
    visited[vertexIdx] = true;
    traversal.push_back(locations[vertexIdx]);

    for (size_t i = 0; i < locations.size(); i++) {
        if (adjMatrix[vertexIdx][i] > 0 && !visited[i]) {
            DFSRecursive(static_cast<int>(i), visited, traversal);
        }
    }
}

DijkstraResult Graph::dijkstra(const std::string& startLoc, const std::string& destLoc) const {
    int startIdx = getLocationIndex(startLoc);
    int destIdx = getLocationIndex(destLoc);
    if (startIdx == -1 || destIdx == -1) {
        return {startLoc, {}, -1, false};
    }

    int n = static_cast<int>(locations.size());
    const int INF = 9999999;
    std::vector<int> dist(n, INF);
    std::vector<bool> visited(n, false);
    std::vector<int> prev(n, -1);

    dist[startIdx] = 0;

    for (int count = 0; count < n - 1; count++) {
        int u = -1;
        int minD = INF;
        for (int v = 0; v < n; v++) {
            if (!visited[v] && dist[v] < minD) {
                minD = dist[v];
                u = v;
            }
        }
        if (u == -1 || dist[u] == INF) break;
        visited[u] = true;

        for (int v = 0; v < n; v++) {
            if (adjMatrix[u][v] > 0 && !visited[v]) {
                int alt = dist[u] + adjMatrix[u][v];
                if (alt < dist[v]) {
                    dist[v] = alt;
                    prev[v] = u;
                }
            }
        }
    }

    if (dist[destIdx] == INF) {
        return {startLoc, {}, INF, false};
    }

    std::vector<std::string> path;
    int curr = destIdx;
    while (curr != -1) {
        path.push_back(locations[curr]);
        curr = prev[curr];
    }
    std::reverse(path.begin(), path.end());
    return {startLoc, path, dist[destIdx], true};
}

std::vector<DijkstraResult> Graph::dijkstraAll(const std::string& startLoc) const {
    std::vector<DijkstraResult> results;
    for (const auto& dest : locations) {
        if (dest != startLoc) {
            results.push_back(dijkstra(startLoc, dest));
        }
    }
    return results;
}
