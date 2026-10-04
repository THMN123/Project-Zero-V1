import { Resource } from '../types';

export interface HashBucketEntry<T> {
  key: string;
  value: T;
  hash: number;
}

export class ResourceHashTable {
  private capacity: number;
  private buckets: HashBucketEntry<Resource>[][];
  private size: number = 0;

  constructor(capacity = 23) {
    this.capacity = capacity;
    this.buckets = Array.from({ length: capacity }, () => []);
  }

  // Hash function matching polynomial / Horner rule style
  hashFunction(key: string): number {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash * 31 + key.charCodeAt(i)) % this.capacity;
    }
    return Math.abs(hash);
  }

  insert(key: string, res: Resource): void {
    const idx = this.hashFunction(key);
    const bucket = this.buckets[idx];
    const existing = bucket.find(item => item.key === key);
    if (existing) {
      existing.value = res;
    } else {
      bucket.push({ key, value: res, hash: idx });
      this.size++;
    }
  }

  search(key: string): { found: Resource | null; steps: number; bucketIndex: number } {
    const idx = this.hashFunction(key);
    const bucket = this.buckets[idx];
    let steps = 1; // 1 step to calculate hash and jump directly to bucket
    for (const item of bucket) {
      steps++;
      if (item.key === key) {
        return { found: item.value, steps, bucketIndex: idx };
      }
    }
    return { found: null, steps, bucketIndex: idx };
  }

  remove(key: string): boolean {
    const idx = this.hashFunction(key);
    const bucket = this.buckets[idx];
    const itemIndex = bucket.findIndex(item => item.key === key);
    if (itemIndex !== -1) {
      bucket.splice(itemIndex, 1);
      this.size--;
      return true;
    }
    return false;
  }

  getBuckets(): { index: number; items: HashBucketEntry<Resource>[] }[] {
    return this.buckets.map((items, index) => ({ index, items }));
  }

  getLoadFactor(): number {
    return Number((this.size / this.capacity).toFixed(2));
  }
}
