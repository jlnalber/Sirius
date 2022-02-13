export class Event {
    private listeners: (() => void)[] = [];
    
    public addListener(listener: () => void): void {
        this.listeners.push(listener);
    }

    public emit() {
        for (let listener of this.listeners) {
            listener();
        }
    }

    public removeListener(listener: () => void): boolean {
        const index = this.listeners.indexOf(listener);
        if (index > -1) {
            this.listeners.splice(index, 1);
            return true;
        }
        return false;
    }
}