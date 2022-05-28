import { SVGElementWrapper } from './../../drawing/selector/SVGElementWrapper';
import { Board, BoardModes, svgns } from '../board/board';
import { Point } from '../interfaces/point';
import { CanvasItem } from './canvasElement';
import { clamp, createPathD, getDistance, readPoints, splitByPoints } from '../essentials/utils';

/*export class DeleteOld {
    private active: boolean = false;
    public globalListener = (ev: any): boolean => {
        if (this.board.mode == BoardModes.Delete) {
            let p = this.board.getActualPoint(this.board.getPosFromTouchEvent(ev));
            let elem = document.elementFromPoint(p.x, p.y);
            if (elem instanceof SVGElement) {
                return this.board.removeElement(elem);
            }
        }
        return false;
    }
    public start(): void {
        if (this.board.canvas?.gElement) {
            let children = this.board.canvas.gElement.children;
            for (let i in children) {
                let el = children[i] as SVGElement;
                let ev = this.getListener(el);
                let evt = this.getListenerTouch(el);
                try {
                    el.addEventListener('mousemove', ev);
                    el.addEventListener('mousedown', ev)
                    el.addEventListener('touchstart', evt);
                    el.addEventListener('touchmove', evt);
                } catch { }
            }
        }
    }
    
    public end(): void {
        if (this.board.canvas?.gElement) {
            let children = this.board.canvas.gElement.children;
            for (let i in children) {
                let el = children[i];
                if (el.removeAllListeners) {
                    el.removeAllListeners('mousemove');
                    el.removeAllListeners('mousedown');
                    el.removeAllListeners('touchstart');
                    el.removeAllListeners('touchmove');
                }
            }
            // this.board.canvas.svgElement?.removeEventListener('touchmove', this.globalListener);
        }
    }
    private removeElement(el: SVGElement, ev: MouseEvent): boolean {
        if (ev.buttons != 0 && this.board.canvas && this.board.canvas.gElement && this.board.canvas.gElement.contains(el)) {
            return this.board.removeElement(el);
        }
        return false;
    }
    private removeElementTouch(el: SVGElement): boolean {
        if (this.board.canvas && this.board.canvas.gElement && this.board.canvas.gElement.contains(el)) {
            return this.board.removeElement(el);
        }
        return false;
    }
    private getListener(el: SVGElement): (ev: MouseEvent) => void {
        return (ev: MouseEvent) => { return this.removeElement(el, ev) };
    }
    private getListenerTouch(el: SVGElement): () => void {
        return () => { return this.removeElementTouch(el); };
    }
    constructor(private readonly board: Board) {
        this.board.onBoardAnyModeChange.addListener(() => {
            if (this.board.mode == BoardModes.Delete && !this.active) {
                this.start();
                this.active = true;
            }
            else if (this.active) {
                this.end();
                this.active = false;
            }
        })
        // Ende, wenn eine Seite geschlossen wird
        this.board.beforePageSwitched.addListener(() => {
            if (this.active) {
                this.end();
            }
        })
        // startet erneut, wenn eine andere Seite geöffnet wird
        this.board.onPageSwitched.addListener(() => {
            if (this.active) {
                this.start();
            }
        })
        // starte erneut, wenn eine Veränderung auftritt
        this.board.onWhiteboardViewChange.addListener(() => {
            if (this.active) {
                this.end();
                this.start();
            }
        })
        this.board.canvas?.svgElement?.addEventListener('touchmove', this.globalListener);
    }
    
}*/

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

            console.log(rect, distance);
        
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

            return clamp(10, Math.sqrt(4 * (1.5 * strokeThicknessPath + 0.5 * (this.board.stroke.thickness ?? 0))), Number.MAX_VALUE);
        }



        // save all the svgpathelements in res that could potentially intersect with the point

        let counter: number = 0;

        let res: SVGPathElement[] = [];
        if (this.board.canvas && this.board.canvas.gElement) {

            for (let i in this.board.canvas.gElement.children) {
                let el = this.board.canvas.gElement.children[i];

                if (el instanceof SVGPathElement) counter++;
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