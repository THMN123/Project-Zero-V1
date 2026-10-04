import { Resource } from '../types';

export interface SortMetrics {
  algorithm: string;
  comparisons: number;
  swaps: number;
  timeMs: number;
  result: Resource[];
}

export class Sorter {
  // QuickSort by Resource ID
  static quickSort(items: Resource[]): SortMetrics {
    const start = performance.now();
    let comparisons = 0;
    let swaps = 0;
    const arr = [...items];

    function partition(low: number, high: number): number {
      const pivot = arr[high].resourceID;
      let i = low - 1;

      for (let j = low; j < high; j++) {
        comparisons++;
        if (arr[j].resourceID <= pivot) {
          i++;
          swaps++;
          const tmp = arr[i];
          arr[i] = arr[j];
          arr[j] = tmp;
        }
      }
      swaps++;
      const tmp = arr[i + 1];
      arr[i + 1] = arr[high];
      arr[high] = tmp;
      return i + 1;
    }

    function sort(low: number, high: number) {
      if (low < high) {
        const pi = partition(low, high);
        sort(low, pi - 1);
        sort(pi + 1, high);
      }
    }

    if (arr.length > 0) {
      sort(0, arr.length - 1);
    }

    const duration = performance.now() - start;
    return {
      algorithm: 'QuickSort (O(n log n)) by Resource ID',
      comparisons,
      swaps,
      timeMs: Number(duration.toFixed(3)),
      result: arr
    };
  }

  // BubbleSort by Capacity
  static bubbleSort(items: Resource[]): SortMetrics {
    const start = performance.now();
    let comparisons = 0;
    let swaps = 0;
    const arr = [...items];
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      let swapped = false;
      for (let j = 0; j < n - i - 1; j++) {
        comparisons++;
        if (arr[j].capacity > arr[j + 1].capacity) {
          swaps++;
          const tmp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = tmp;
          swapped = true;
        }
      }
      if (!swapped) break;
    }

    const duration = performance.now() - start;
    return {
      algorithm: 'BubbleSort (O(n²)) by Capacity',
      comparisons,
      swaps,
      timeMs: Number(duration.toFixed(3)),
      result: arr
    };
  }

  // MergeSort by Name
  static mergeSort(items: Resource[]): SortMetrics {
    const start = performance.now();
    let comparisons = 0;
    let swaps = 0;

    function merge(left: Resource[], right: Resource[]): Resource[] {
      const merged: Resource[] = [];
      let i = 0, j = 0;
      while (i < left.length && j < right.length) {
        comparisons++;
        if (left[i].name.localeCompare(right[j].name) <= 0) {
          merged.push(left[i++]);
        } else {
          merged.push(right[j++]);
          swaps++;
        }
      }
      return merged.concat(left.slice(i)).concat(right.slice(j));
    }

    function sort(arr: Resource[]): Resource[] {
      if (arr.length <= 1) return arr;
      const mid = Math.floor(arr.length / 2);
      const left = sort(arr.slice(0, mid));
      const right = sort(arr.slice(mid));
      return merge(left, right);
    }

    const result = sort([...items]);
    const duration = performance.now() - start;

    return {
      algorithm: 'MergeSort (O(n log n)) by Name',
      comparisons,
      swaps,
      timeMs: Number(duration.toFixed(3)),
      result
    };
  }
}
