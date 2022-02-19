import { MoveControlComponent } from './../../whiteboard/drawing/move-control/move-control.component';
import { BoardService } from 'src/app/features/board.service';
import { CanvasItem, Point } from "./canvasElement";
import { Shape } from './shape';

export class Line extends Shape {

    public touchStart(p: Point): void {
        let realP = this.boardService.getActualPoint(p);
        this.svgElement.setAttributeNS(null, 'x1', realP.x.toString());
        this.svgElement.setAttributeNS(null, 'y1', realP.y.toString());
        this.goTo(realP);
    }

    public touchMove(from: Point, to: Point): void {
        let realTo = this.boardService.getActualPoint(to);
        this.goTo(realTo);
    }

    public touchEnd(p: Point): void {
        let realTo = this.boardService.getActualPoint(p);
        this.goTo(realTo);
    }

    private goTo(p: Point) {
        this.svgElement.setAttributeNS(null, 'x2', p.x.toString());
        this.svgElement.setAttributeNS(null, 'y2', p.y.toString());
    }
    
    constructor(boardService: BoardService) {
        super(boardService, 'line');
    }
}