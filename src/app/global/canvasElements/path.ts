import { BoardService } from "../../features/board.service";
import { Point, CanvasItem } from "./canvasElement";
import { Stroke } from "../stroke";

export class Path extends CanvasItem {

    private tolerance: ((path: Path) => number) = (path: Path) => {
        return Math.sqrt(path.stroke.getThickness());
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

    constructor(private boardService: BoardService) {
        super();

        this.stroke = this.boardService.stroke;
        this.pathElement = this.boardService.createElement('path') as SVGPathElement;

        this.intialize();
    }

    public addPoint(point: Point) {
        if (point) {
            if (this.points.length == 0) {
                this.pathElement.setAttributeNS(null, 'd', `M${point.x} ${point.y}`);
            }
            else {
                let d = this.pathElement.getAttributeNS(null, 'd');
                this.pathElement.setAttributeNS(null, 'd', d + ` L${point.x} ${point.y}`)
            }
            this.points.push(point);
        }
    }

    public finalize() { 
        if (this.points.length != 0) {
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
            
            for (let i = 0; 2 * i + 2 < this.points.length; i++) {
                let from = this.points[2 * i + 1];
                let to = this.points[2 * i + 2];
                d += ` Q ${from.x} ${from.y} ${to.x} ${to.y}`
            }

            if (this.points.length % 2 == 0) {
                let point = this.points[this.points.length - 1];
                d += ` L ${point.x} ${point.y}`;
            }

            this.pathElement.setAttributeNS(null, 'd', d);
        }
    }

    public touchStart(p: Point): void {
        let realPoint = this.boardService.getActualPoint(p);
        this.addPoint(realPoint);
    }

    public touchMove(from: Point, to: Point): void {
        let realCurr = this.boardService.getActualPoint(to);
        this.addPoint(realCurr);
    }

    public touchEnd(p: Point): void {
        let realPoint = this.boardService.getActualPoint(p);
        this.addPoint(realPoint);
        this.finalize();
    }
}