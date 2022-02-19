import { BoardService } from 'src/app/features/board.service';
import { CanvasItem, Point } from "./canvasElement";

export class Move extends CanvasItem {
    
    public touchStart(p: Point): void {
        return;
    }
    public touchMove(from: Point, to: Point): void {
        if (this.boardService.canvas) {
          this.boardService.canvas.translateX += to.x - from.x;
          this.boardService.canvas.translateY += to.y - from.y;
        }
    }
    public touchEnd(p: Point): void {
        return;
    }
    
    constructor(private boardService: BoardService) {
        super();
    }
}