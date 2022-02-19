import { BoardService } from 'src/app/features/board.service';
import { CanvasItem, Point } from "./canvasElement";
import { Shape } from "./shape";

export class Delete extends CanvasItem {

    public touchStart(p: Point): void {
        return;
    }
    public touchMove(from: Point, to: Point): void {
        return;
    }
    public touchEnd(p: Point): void {
        return;
    }

    constructor(private readonly _boardService: BoardService) { 
        super()
    }
    
}