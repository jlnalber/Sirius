import { BoardService } from 'src/app/features/board.service';
import { Board } from '../board/board';
import { CanvasItem, Point } from "./canvasElement";

export class Move extends CanvasItem {
    
    public touchStart(p: Point): void {
        return;
    }
    public touchMove(from: Point, to: Point): void {
        if (this.board.canvas) {
          this.board.translateX += to.x - from.x;
          this.board.translateY += to.y - from.y;
        }
    }
    public touchEnd(p: Point): void {
        return;
    }
    
    constructor(private board: Board) {
        super();
    }
}