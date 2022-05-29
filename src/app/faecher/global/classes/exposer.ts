type Provider<T> = () => T;

export class Exposer<T> {
    constructor() { }

    private providers: Provider<T>[] = [];

    public request(func: (t: T) => void): void {
        for (let provider of this.providers) {
            func(provider());
        }
    }

    public addProvider(provider: Provider<T>): void {
        this.providers.push(provider);
    }

    public removeProvider(provider: Provider<T>): boolean {
        const index = this.providers.indexOf(provider);
        if (index >= 0) {
            this.providers.splice(index, 1);
            return true;
        }
        return false;
    }

    public clear(): void {
        this.providers = [];
    }
}