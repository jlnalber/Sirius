import { BoardModes, BoardService } from "../features/board.service";

export abstract class Control {
    public active: boolean = false;

    public click(): void {
        if (this.isOpen()) {
            this.active = !this.active;
        }
        else {
            this.active = false;
            this.boardService.mode = this.mode;
        }
    }

    public isOpen(): boolean {
        return this.boardService.mode == this.mode;
    }

    constructor(public readonly boardService: BoardService, private readonly mode: BoardModes) {
        this.boardService.onTouch.addListener(() => {
            this.active = false;
        });
    }
}