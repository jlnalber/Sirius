import { SVGElementWrapper } from './../../drawing/selector/SVGElementWrapper';
import { Board, BoardModes, svgns } from '../board/board';
import { Point } from '../interfaces/point';
import { CanvasItem } from './canvasElement';
import { clamp, createPathD, getDistance, readPoints, splitByPoints } from '../essentials/utils';


export class Delete extends CanvasItem {

    constructor(private board: Board) {
        super();
    }

    public touchStart(p: Point): void {
        this.delete(p);
    }

    public touchMove(from: Point, to: Point): void {
        this.delete(to);
    }

    public touchEnd(p: Point): void {
        this.delete(p);
    }

    private delete(p: Point): void {

        // this method first checks the svg elements that intersect with a given point (+ condition)

        let intersectRect = (r: SVGPathElement) => {
            const distance = distanceCalculator(r);

            let rect = this.board.getRectRealPosInCanvas(r.getBoundingClientRect());    //BOUNDING BOX OF THE OBJECT
        
            //CHECK IF THE TWO BOUNDING BOXES OVERLAP (+ the distance)
            return !((rect.x - distance) > p.x || 
                (rect.x + rect.width + distance) < p.x || 
                (rect.y - distance) > p.y ||
                (rect.y + rect.height + distance) < p.y);
        }

        let setSameProperty = (oldPath: SVGElement, newPath: SVGElement, property: string) => {
            newPath.setAttributeNS(null, property, oldPath.getAttributeNS(null, property) || '');
        }

        let distanceCalculator = (path: SVGPathElement) => {
            let strokeThicknessPath = 0;
            try {
                strokeThicknessPath = parseFloat(path.getAttributeNS(null, 'stroke-width') ?? "");
            }
            catch { }

            return clamp(10, Math.sqrt(4 * (1.5 * strokeThicknessPath + 0.5 * (this.board.stroke.thickness ?? 0))) / this.board.zoom, Number.MAX_VALUE);
        }



        // save all the svgpathelements in res that could potentially intersect with the point

        let res: SVGPathElement[] = [];
        if (this.board.canvas && this.board.canvas.gElement) {

            for (let i in this.board.canvas.gElement.children) {
                let el = this.board.canvas.gElement.children[i];
                if (el instanceof SVGPathElement && intersectRect(el)) {
                    res.push(el);
                }
            }
        }

        p = this.board.getActualPoint(p);

        for (let path of res) {

            // the max distance that a path is allowed to be away from the recognized point
            const distance = distanceCalculator(path);

            let pathEl: SVGElementWrapper = new SVGElementWrapper(path);

            let points = readPoints(path.getAttributeNS(null, 'd') ?? "");

            let pointsToRemove = [];

            // point is the point that would be displayed in the browser if it were a point of the d-property of the path
            let point = p;

            let angle = (pathEl.rotate ?? 0) * Math.PI / 180;

            point.x -= (pathEl.translateX ?? 0);
            point.y -= (pathEl.translateY ?? 0);
            point.x /= (pathEl.scaleX ?? 1);
            point.y /= (pathEl.scaleY ?? 1);
            point = {
                x: point.x * Math.cos(angle) + point.y * Math.sin(angle),
                y: -point.x * Math.sin(angle) + point.y * Math.cos(angle)
            }

            // get all the points we're colliding with
            for (let pPath of points) {
                if (getDistance(pPath, point) <= distance) {
                    pointsToRemove.push(pPath);
                }
            }


            if (pointsToRemove.length != 0) {
                let ds = splitByPoints(points, pointsToRemove).filter(arr => arr.length > 2).map(arr => createPathD(arr));
                
                for (let d of ds) {
                    let newPath = this.board.createElement('path');
                    newPath.setAttributeNS(null, 'd', d);
                    setSameProperty(path, newPath, 'fill');
                    setSameProperty(path, newPath, 'stroke');
                    setSameProperty(path, newPath, 'stroke-width');
                    setSameProperty(path, newPath, 'stroke-linecap');
                    setSameProperty(path, newPath, 'fill');
                    setSameProperty(path, newPath, 'transform');
                }
                this.board.removeElement(path);
            }
        }
    }
    
}