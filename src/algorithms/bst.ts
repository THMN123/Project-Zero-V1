import { Resource } from '../types';

export interface BSTVisualNode {
  id: string;
  name: string;
  capacity: number;
  left: BSTVisualNode | null;
  right: BSTVisualNode | null;
}

export class ResourceBST {
  root: BSTVisualNode | null = null;

  insert(res: Resource): void {
    const newNode: BSTVisualNode = {
      id: res.resourceID,
      name: res.name,
      capacity: res.capacity,
      left: null,
      right: null
    };

    if (!this.root) {
      this.root = newNode;
      return;
    }

    let curr: BSTVisualNode = this.root;
    while (true) {
      if (res.resourceID < curr.id) {
        if (!curr.left) {
          curr.left = newNode;
          break;
        }
        curr = curr.left;
      } else if (res.resourceID > curr.id) {
        if (!curr.right) {
          curr.right = newNode;
          break;
        }
        curr = curr.right;
      } else {
        // Equal key - update
        curr.name = res.name;
        curr.capacity = res.capacity;
        break;
      }
    }
  }

  search(id: string): { found: boolean; steps: number; node: BSTVisualNode | null } {
    let steps = 0;
    let curr = this.root;
    while (curr) {
      steps++;
      if (curr.id === id) {
        return { found: true, steps, node: curr };
      }
      if (id < curr.id) {
        curr = curr.left;
      } else {
        curr = curr.right;
      }
    }
    return { found: false, steps, node: null };
  }

  inorder(): BSTVisualNode[] {
    const result: BSTVisualNode[] = [];
    const traverse = (node: BSTVisualNode | null) => {
      if (!node) return;
      traverse(node.left);
      result.push(node);
      traverse(node.right);
    };
    traverse(this.root);
    return result;
  }

  preorder(): BSTVisualNode[] {
    const result: BSTVisualNode[] = [];
    const traverse = (node: BSTVisualNode | null) => {
      if (!node) return;
      result.push(node);
      traverse(node.left);
      traverse(node.right);
    };
    traverse(this.root);
    return result;
  }

  postorder(): BSTVisualNode[] {
    const result: BSTVisualNode[] = [];
    const traverse = (node: BSTVisualNode | null) => {
      if (!node) return;
      traverse(node.left);
      traverse(node.right);
      result.push(node);
    };
    traverse(this.root);
    return result;
  }
}
