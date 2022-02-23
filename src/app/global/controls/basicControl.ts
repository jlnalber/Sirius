import { Board } from "../board/board";
import { Event } from "../event";

export abstract class BasicControl {
    public abstract enabled: boolean;

    public abstract board: Board;

    public click(): void {
        if (this.enabled) {
            this.onClick();
        }
    }

    public abstract onClick: () => void;

    protected afterViewInit: Event = new Event();

    public prevDef(ev: MouseEvent) {
        ev.preventDefault();
    }

    constructor() { }
}