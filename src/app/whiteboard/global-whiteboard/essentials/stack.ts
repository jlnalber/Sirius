export class Stack<T> {
    private storage: T[] = [];
  
    private currentSize = 0;

    constructor(private maxSize: number = Infinity, private readonly sizeCalculator: (t: T) => number = () => 1, private minSteps?: number) {}
  
    push(item: T): void {
      this.storage.push(item);

      this.currentSize += this.sizeCalculator(item);

      while ((this.size() > (this.minSteps ?? 0)) && (this.currentSize > this.maxSize)) {
        let el = this.storage.splice(0, 1)[0];
        this.currentSize -= this.sizeCalculator(el);
      }
    }

    empty(): void {
      this.storage = [];
    }
  
    pop(): T | undefined {
      let el = this.storage.pop();
      
      if (el != undefined) {
        this.currentSize -= this.sizeCalculator(el);
      }

      return el;
    }
  
    peek(): T | undefined {
      return this.storage[this.size() - 1];
    }
  
    size(): number {
      return this.storage.length;
    }
  }