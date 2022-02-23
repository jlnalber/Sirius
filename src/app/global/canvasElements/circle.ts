import { BoardService } from 'src/app/features/board.service';
import { Board } from '../board/board';
import { CanvasItem, Point } from "./canvasElement";
import { Shape } from './shape';

export class Circle extends Shape {

    private start: Point = { x: 0, y: 0 };

    public touchStart(p: Point): void {
        let realP = this.board.getActualPoint(p);
        this.start = realP;
        this.goTo(realP);
    }

    public touchMove(from: Point, to: Point): void {
        let realTo = this.board.getActualPoint(to);
        this.goTo(realTo);
    }

    public touchEnd(p: Point): void {
        let realTo = this.board.getActualPoint(p);
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

        let r = smaller(rx, ry);

        this.svgElement.setAttributeNS(null, 'cx', (startX + r).toString());
        this.svgElement.setAttributeNS(null, 'cy', (startY + r).toString());
        this.svgElement.setAttributeNS(null, 'r', r.toString());
    }
    
    constructor(board: Board) {
        super(board, 'circle');
    }
}