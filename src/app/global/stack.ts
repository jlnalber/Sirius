export class Stack<T> {
    private storage: T[] = [];
  
    constructor() {}
  
    push(item: T): void {
      this.storage.push(item);
    }

    empty(): void {
      this.storage = [];
    }
  
    pop(): T | undefined {
      return this.storage.pop();
    }
  
    peek(): T | undefined {
      return this.storage[this.size() - 1];
    }
  
    size(): number {
      return this.storage.length;
    }
  }