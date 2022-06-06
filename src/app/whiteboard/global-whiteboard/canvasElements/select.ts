import { Board } from '../board/board';
import { Point } from '../interfaces/point';
import { Shape } from './shape';

export class Select extends Shape {

    private start: Point = { x: 0, y: 0 };

    public touchStart(p: Point): void {
        let realP = this.board.getActualPoint(p);
        this.start = realP;
        this.moveTo(realP);

        if (this.board.selector) {
            this.board.selector.svgEl = undefined;
        }
    }
    public touchMove(from: Point, to: Point): void {
        let realTo = this.board.getActualPoint(to);
        this.expandTo(realTo);
    }
    public touchEnd(p: Point): void {
        let realTo = this.board.getActualPoint(p);
        this.expandTo(realTo);

        if (this.board.selector) {
            this.board.selector.svgEl = this.checkCollision();
        }

        this.board.removeElement(this.svgElement);
    }

    private checkCollision(): SVGElement[] {
        let intersectRect = (r1: SVGElement, r2: SVGElement) => {
            let rect1 = r1.getBoundingClientRect();    //BOUNDING BOX OF THE FIRST OBJECT
            let rect2 = r2.getBoundingClientRect();    //BOUNDING BOX OF THE SECOND OBJECT
        
            //CHECK IF THE TWO BOUNDING BOXES OVERLAP
          return !(rect2.left > rect1.right || 
            rect2.right < rect1.left || 
            rect2.top > rect1.bottom ||
            rect2.bottom < rect1.top);
        }

        if (this.board.canvas && this.board.canvas.gElement) {
            let res: SVGElement[] = [];

            for (let i in this.board.canvas.gElement.children) {
                let el = this.board.canvas.gElement.children[i];
                if (el instanceof SVGElement && el != this.svgElement && intersectRect(this.svgElement, el)) {
                    res.push(el);
                }
            }

            console.log(res);

            return res;
        }

        return [];
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
    
    private writeStyles() {
        this.svgElement.setAttributeNS(null, 'stroke', '#478EFA');
        this.svgElement.setAttributeNS(null, 'stroke-width', '1');
        this.svgElement.setAttributeNS(null, 'fill', '#478EFA40');
    }
    
    constructor(board: Board) {
        super(board, 'rect', false);
        this.writeStyles();
    }
}