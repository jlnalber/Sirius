import { BoardService } from "../features/board.service";

export abstract class BottomControl {
    public active: boolean = false;

    public click(): void {
        if (this.isOpen()) {
            this.active = !this.active;
        }
        else {
            this.active = false;
            this.secondClick();
        }
    }

    public prevDef(ev: MouseEvent) {
        ev.preventDefault();
    }

    constructor(public readonly boardService: BoardService, public isOpen: () => boolean, private secondClick: () => void) {
        this.boardService.onTouch.addListener(() => {
            this.active = false;
        });
    }
}