import { CanvasItem } from "./canvasElement";
import { Stroke } from "../essentials/stroke";
import { Board } from "../board/board";
import { Point } from "../interfaces/point";

export class Path extends CanvasItem {

    private tolerance: ((path: Path) => number) = (path: Path) => {
        return 1;
    };

    private points: Point[] = [];

    private intialize(): void {
        this.pathElement.setAttributeNS(null, 'stroke', this.stroke.color.toString());
        this.pathElement.setAttributeNS(null, 'stroke-width', this.stroke.getThicknessString());
        this.pathElement.setAttributeNS(null, 'stroke-linecap', this.stroke.strokeLineCap);
        this.pathElement.setAttributeNS(null, 'd', '');
        this.pathElement.setAttributeNS(null, 'fill', 'transparent')
    }

    private pathElement: SVGPathElement;
    private stroke: Stroke;

    constructor(private board: Board) {
        super();

        this.stroke = this.board.stroke;
        this.pathElement = this.board.createElement('path') as SVGPathElement;

        this.intialize();
    }

    public addPoint(point: Point) {
        let correct = this.points.length == 0 || Math.sqrt((point.x - this.points[this.points.length - 1].x) ** 2 + (point.y - this.points[this.points.length - 1].y) ** 2) > this.tolerance(this);
        if (point && correct) {
            if (this.points.length == 0) {
                this.pathElement.setAttributeNS(null, 'd', `M${point.x} ${point.y}`);
            }
            else {
                let d = this.pathElement.getAttributeNS(null, 'd');
                const index = d?.lastIndexOf('L');
                if (index && index != -1 && d) {
                    d = d.substring(0, index - 1);
                }

                let lastP = this.points[this.points.length - 1];
                let dx = (point.x + lastP.x) / 2;
                let dy = (point.y + lastP.y) / 2;

                this.pathElement.setAttributeNS(null, 'd', d + ` Q ${lastP.x} ${lastP.y}, ${dx} ${dy} L${point.x} ${point.y}`)
            }
            this.points.push(point);
        }
    }

    public finalize() { 
        return; // Can be skipped since everything is already made in in addPoint
        if (this.points.length != 0) {
            // minimize the points by removing to close ones
            let tolerance = this.tolerance(this);
            let removePoints: Point[] = [];
            let lastPoint = this.points[0];
            for (let i = 1; i < this.points.length - 1; i++) {
                let currPoint = this.points[i];
                if (Math.abs(lastPoint.x - currPoint.x) < tolerance && Math.abs(lastPoint.y - currPoint.y) < tolerance) {
                    removePoints.push(currPoint);
                }
                else {
                    lastPoint = currPoint;
                }
            }
            for (let point of removePoints) {
                const index = this.points.indexOf(point);
                if (index > -1) {
                    this.points.splice(index, 1);
                }
            }

            let d: string = `M${this.points[0].x} ${this.points[0].y}`;

            // version with 'Q' and 'T' --> Result: doesn't work, still interesting
            /*if (this.points.length >= 3) {
                d += ` Q ${this.points[1].x} ${this.points[1].y}, ${this.points[2].x} ${this.points[2].y}`;
                for (let i = 3; i < this.points.length; i++) {
                    d += ` T ${this.points[i].x} ${this.points[i].y}`
                }
            }

            else if (this.points.length == 2) {
                d += ` L${this.points[1].x} ${this.points[1].y}`;
            }*/

            if (this.points.length >= 3) {
                for (let i = 1; i < this.points.length - 1; i++) {
                    var xc = (this.points[i].x + this.points[i + 1].x) / 2;
                    var yc = (this.points[i].y + this.points[i + 1].y) / 2;
                    d += ` Q${this.points[i].x} ${this.points[i].y}, ${xc} ${yc}`;
                }
            }
            if (this.points.length >= 2) {
                let lastP = this.points[this.points.length - 1];
                d += ` L${lastP.x} ${lastP.y}`;
            }
            
            // Version with qubics
            /*for (let i = 0; 2 * i + 2 < this.points.length; i++) {
                let from = this.points[2 * i + 1];
                let to = this.points[2 * i + 2];
                d += ` Q ${from.x} ${from.y} ${to.x} ${to.y}`
            }

            if (this.points.length % 2 == 0) {
                let point = this.points[this.points.length - 1];
                d += ` L ${point.x} ${point.y}`;
            }*/

            this.pathElement.setAttributeNS(null, 'd', d);
        }
    }

    public touchStart(p: Point): void {
        let realPoint = this.board.getActualPoint(p);
        this.addPoint(realPoint);
    }

    public touchMove(from: Point, to: Point): void {
        let realCurr = this.board.getActualPoint(to);
        this.addPoint(realCurr);
    }

    public touchEnd(p: Point): void {
        let realPoint = this.board.getActualPoint(p);
        this.addPoint(realPoint);
        this.finalize();
    }
}