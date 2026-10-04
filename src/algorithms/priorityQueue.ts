import { RequestItem } from '../types';

export class MaxHeapPriorityQueue {
  private heap: RequestItem[] = [];

  constructor(initialItems: RequestItem[] = []) {
    initialItems.forEach(item => this.enqueue(item));
  }

  enqueue(item: RequestItem): void {
    this.heap.push(item);
    this.heapifyUp(this.heap.length - 1);
  }

  dequeue(): RequestItem | null {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop()!;

    const max = this.heap[0];
    this.heap[0] = this.heap.pop()!;
    this.heapifyDown(0);
    return max;
  }

  peek(): RequestItem | null {
    return this.heap.length > 0 ? this.heap[0] : null;
  }

  size(): number {
    return this.heap.length;
  }

  getHeapArray(): RequestItem[] {
    return [...this.heap];
  }

  private heapifyUp(index: number): void {
    let curr = index;
    while (curr > 0) {
      const parentIdx = Math.floor((curr - 1) / 2);
      if (this.compare(this.heap[curr], this.heap[parentIdx]) > 0) {
        // Swap
        const tmp = this.heap[curr];
        this.heap[curr] = this.heap[parentIdx];
        this.heap[parentIdx] = tmp;
        curr = parentIdx;
      } else {
        break;
      }
    }
  }

  private heapifyDown(index: number): void {
    let curr = index;
    const length = this.heap.length;

    while (true) {
      const leftChild = 2 * curr + 1;
      const rightChild = 2 * curr + 2;
      let largest = curr;

      if (leftChild < length && this.compare(this.heap[leftChild], this.heap[largest]) > 0) {
        largest = leftChild;
      }
      if (rightChild < length && this.compare(this.heap[rightChild], this.heap[largest]) > 0) {
        largest = rightChild;
      }

      if (largest !== curr) {
        const tmp = this.heap[curr];
        this.heap[curr] = this.heap[largest];
        this.heap[largest] = tmp;
        curr = largest;
      } else {
        break;
      }
    }
  }

  private compare(a: RequestItem, b: RequestItem): number {
    // Higher priority first (4 > 3 > 2 > 1)
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }
    // Earlier timestamp first if same priority (FIFO tie-breaker)
    return b.createdAt - a.createdAt;
  }
}
