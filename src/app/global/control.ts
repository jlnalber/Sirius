import { BoardModes, BoardService } from "../features/board.service";
import { BottomControl } from "./bottomControl";

export abstract class Control extends BottomControl {

    constructor(boardService: BoardService, private readonly mode: BoardModes) {
        super(boardService, () => {
            return boardService.mode == this.mode;
        }, () => {
            boardService.mode = this.mode;
        })
    }
}