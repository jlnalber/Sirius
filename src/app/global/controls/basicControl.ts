import { Rules } from './../rules';
import { Board } from "../board/board";
import { Event } from "../event";

export abstract class BasicControl {
    public abstract enabled: boolean;

    public enabledRules: Rules = new Rules();

    public isEnabled(): boolean {
        return this.enabledRules.evaluate();
    }

    public abstract board: Board;

    public click(): void {
        if (this.isEnabled()) {
            this.onClick();
        }
    }

    public getNgClasses(): string {
        return this.isEnabled() ? 'enabled' : 'disabled';
    }

    public abstract onClick: () => void;

    protected afterViewInit: Event = new Event();

    public prevDef(ev: MouseEvent) {
        ev.preventDefault();
    }

    constructor() {
        this.enabledRules.addRule(() => {
            return this.enabled;
        })
    }
}