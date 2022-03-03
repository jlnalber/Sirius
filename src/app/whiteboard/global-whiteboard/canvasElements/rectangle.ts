import { Board } from '../board/board';
import { Point } from '../interfaces/point';
import { Shape } from './shape';

export class Rectangle extends Shape {

    private start: Point = { x: 0, y: 0 };

    public touchStart(p: Point): void {
        let realP = this.board.getActualPoint(p);
        this.start = realP;
        this.moveTo(realP);
    }
    public touchMove(from: Point, to: Point): void {
        let realTo = this.board.getActualPoint(to);
        this.expandTo(realTo);
    }
    public touchEnd(p: Point): void {
        let realTo = this.board.getActualPoint(p);
        this.expandTo(realTo);

    }

    private moveTo(p: Point) {
        this.svgElement.setAttributeNS(null, 'x', p.x.toString());
        this.svgElement.setAttributeNS(null, 'y', p.y.toString());
    }

    private expandTo(p: Point) {
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

        this.moveTo({ x: startX, y: startY });

        this.svgElement.setAttributeNS(null, 'width', (endX - startX).toString());
        this.svgElement.setAttributeNS(null, 'height', (endY - startY).toString());
    }
    
    constructor(board: Board) {
        super(board, 'rect');
    }
}