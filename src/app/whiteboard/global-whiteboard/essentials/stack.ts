export class Stack<T> {
    private storage: T[] = [];
  
    constructor(private maxSize: number = Infinity) {}
  
    push(item: T): void {
      this.storage.push(item);

      if (this.size() > this.maxSize) {
        this.storage.splice(0, 1);
      }
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