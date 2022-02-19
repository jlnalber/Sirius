import { BoardService } from 'src/app/features/board.service';
import { CanvasItem, Point } from "./canvasElement";
import { Shape } from './shape';

export class Ellipse extends Shape {

    private start: Point = { x: 0, y: 0 };

    public touchStart(p: Point): void {
        let realP = this.boardService.getActualPoint(p);
        this.start = realP;
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

    private goTo(p: Point): void {
        let smaller = (a: number, b: number): number => {
            return a < b ? a : b;
        }
        let bigger = (a: number, b: number): number => {
            return a > b ? a : b;
        }

        let startX = smaller(p.x, this.start.x);
        let startY = smaller(p.y, this.start.y);
        let endX = bigger(p.x, this.start.x);
        let endY = bigger(p.y, this.start.y);

        let rx = (endX - startX) / 2;
        let ry = (endY - startY) / 2;

        this.svgElement.setAttributeNS(null, 'cx', (startX + rx).toString());
        this.svgElement.setAttributeNS(null, 'cy', (startY + ry).toString());
        this.svgElement.setAttributeNS(null, 'rx', rx.toString());
        this.svgElement.setAttributeNS(null, 'ry', ry.toString());
    }
    
    constructor(boardService: BoardService) {
        super(boardService, 'ellipse');
    }
}