import { Board } from '../board/board';
import { Point } from '../interfaces/point';
import { Shape } from './shape';

export class Circle extends Shape {

    private start: Point = { x: 0, y: 0 };

    public touchStart(p: Point): void {
        let realP = this.board.getActualPoint(p);
        this.start = realP;
        this.svgElement.setAttributeNS(null, 'cx', this.start.x.toString());
        this.svgElement.setAttributeNS(null, 'cy', this.start.y.toString());
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
        let r = Math.sqrt((p.x - this.start.x) ** 2 + (p.y - this.start.y) ** 2);
        this.svgElement.setAttributeNS(null, 'r', r.toString());
    }
    
    constructor(board: Board) {
        super(board, 'circle');
    }
}