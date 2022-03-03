import { BoardModes } from "../board/board";
import { BottomControl } from "./bottomControl";

export abstract class Control extends BottomControl {

    public isActive = () => {
        return this.board.mode == this.mode;
    };

    protected secondClick = () => {
        this.board.mode = this.mode;
    };

    protected firstClick?: (() => void) | undefined;

    constructor(private readonly mode: BoardModes) {
        super();
    }
}