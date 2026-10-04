export interface DijkstraStep {
  current: string;
  distance: number;
  evaluatedNeighbors: { neighbor: string; edgeWeight: number; tentativeDist: number; updated: boolean }[];
}

export interface DijkstraResult {
  startLocation: string;
  distances: Record<string, number>;
  previous: Record<string, string | null>;
  paths: Record<string, { path: string[]; distance: number }>;
  steps: DijkstraStep[];
}

export class CampusGraph {
  private vertices: string[] = [];
  private matrix: number[][] = [];

  constructor(initialVertices: string[] = [], connections: { from: string; to: string; weight: number }[] = []) {
    initialVertices.forEach(v => this.addVertex(v));
    connections.forEach(c => this.addEdge(c.from, c.to, c.weight));
  }

  addVertex(name: string): boolean {
    if (this.vertices.includes(name)) return false;
    this.vertices.push(name);
    const size = this.vertices.length;

    // Expand matrix
    for (let i = 0; i < size - 1; i++) {
      this.matrix[i].push(0);
    }
    this.matrix.push(new Array(size).fill(0));
    return true;
  }

  addEdge(from: string, to: string, weight: number = 1): boolean {
    const i = this.vertices.indexOf(from);
    const j = this.vertices.indexOf(to);
    if (i === -1 || j === -1) return false;

    this.matrix[i][j] = weight;
    this.matrix[j][i] = weight; // Undirected graph
    return true;
  }

  getVertices(): string[] {
    return [...this.vertices];
  }

  getMatrix(): number[][] {
    return this.matrix.map(row => [...row]);
  }

  getNeighbors(vertex: string): { name: string; weight: number }[] {
    const idx = this.vertices.indexOf(vertex);
    if (idx === -1) return [];

    const neighbors: { name: string; weight: number }[] = [];
    for (let j = 0; j < this.vertices.length; j++) {
      if (this.matrix[idx][j] > 0) {
        neighbors.push({ name: this.vertices[j], weight: this.matrix[idx][j] });
      }
    }
    return neighbors;
  }

  // BFS Traversal
  bfs(start: string): { traversal: string[]; edges: { from: string; to: string }[] } {
    const startIdx = this.vertices.indexOf(start);
    if (startIdx === -1) return { traversal: [], edges: [] };

    const visited = new Set<string>();
    const queue: string[] = [start];
    const traversal: string[] = [];
    const edges: { from: string; to: string }[] = [];

    visited.add(start);

    while (queue.length > 0) {
      const curr = queue.shift()!;
      traversal.push(curr);
      const currIdx = this.vertices.indexOf(curr);

      for (let j = 0; j < this.vertices.length; j++) {
        if (this.matrix[currIdx][j] > 0) {
          const neighbor = this.vertices[j];
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push(neighbor);
            edges.push({ from: curr, to: neighbor });
          }
        }
      }
    }

    return { traversal, edges };
  }

  // DFS Traversal
  dfs(start: string): { traversal: string[]; edges: { from: string; to: string }[] } {
    const startIdx = this.vertices.indexOf(start);
    if (startIdx === -1) return { traversal: [], edges: [] };

    const visited = new Set<string>();
    const traversal: string[] = [];
    const edges: { from: string; to: string }[] = [];

    const explore = (curr: string) => {
      visited.add(curr);
      traversal.push(curr);
      const currIdx = this.vertices.indexOf(curr);

      for (let j = 0; j < this.vertices.length; j++) {
        if (this.matrix[currIdx][j] > 0) {
          const neighbor = this.vertices[j];
          if (!visited.has(neighbor)) {
            edges.push({ from: curr, to: neighbor });
            explore(neighbor);
          }
        }
      }
    };

    explore(start);
    return { traversal, edges };
  }

  // Dijkstra's Shortest Path Algorithm
  dijkstra(start: string): DijkstraResult {
    const INF = Infinity;
    const distances: Record<string, number> = {};
    const previous: Record<string, string | null> = {};
    const unvisited = new Set<string>(this.vertices);
    const steps: DijkstraStep[] = [];

    for (const v of this.vertices) {
      distances[v] = INF;
      previous[v] = null;
    }
    distances[start] = 0;

    while (unvisited.size > 0) {
      // Find unvisited node with minimum tentative distance
      let current: string | null = null;
      let minDistance = INF;

      for (const node of unvisited) {
        if (distances[node] < minDistance) {
          minDistance = distances[node];
          current = node;
        }
      }

      if (current === null || minDistance === INF) {
        // Remaining unvisited nodes are unreachable
        break;
      }

      unvisited.delete(current);
      const currentIdx = this.vertices.indexOf(current);
      const step: DijkstraStep = {
        current,
        distance: minDistance,
        evaluatedNeighbors: []
      };

      for (let j = 0; j < this.vertices.length; j++) {
        const edgeWeight = this.matrix[currentIdx][j];
        if (edgeWeight > 0) {
          const neighbor = this.vertices[j];
          if (unvisited.has(neighbor)) {
            const alt = distances[current] + edgeWeight;
            const updated = alt < distances[neighbor];
            if (updated) {
              distances[neighbor] = alt;
              previous[neighbor] = current;
            }
            step.evaluatedNeighbors.push({
              neighbor,
              edgeWeight,
              tentativeDist: alt,
              updated
            });
          }
        }
      }

      steps.push(step);
    }

    // Reconstruct paths
    const paths: Record<string, { path: string[]; distance: number }> = {};
    for (const dest of this.vertices) {
      if (distances[dest] === INF) {
        paths[dest] = { path: [], distance: INF };
      } else {
        const path: string[] = [];
        let curr: string | null = dest;
        while (curr !== null) {
          path.unshift(curr);
          curr = previous[curr];
        }
        paths[dest] = { path, distance: distances[dest] };
      }
    }

    return {
      startLocation: start,
      distances,
      previous,
      paths,
      steps
    };
  }
}
