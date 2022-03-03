export class Rules {
    protected rules: (() => boolean)[] = [];

    public addRule(rule: () => boolean) {
        this.rules.push(rule);
    }

    public removeRule(rule: () => boolean): boolean {
        const index = this.rules.indexOf(rule);
        if (index > -1) {
            this.rules.splice(index, 1);
            return true;
        }
        return false;
    }

    public evaluate(): boolean {
        for (let rule of this.rules) {
            if (!rule()) return false;
        }
        return true;
    }
}