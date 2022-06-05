import { ElementRef } from '@angular/core';
import { Board, svgns } from 'src/app/whiteboard/global-whiteboard/board/board';
import { TouchController } from "../../global-whiteboard/essentials/touchController";
import { getDistance, getTouchControllerEventsAllSame, mod } from "../../global-whiteboard/essentials/utils";
import { Point, Vector } from "../../global-whiteboard/interfaces/point";
import { Geometry } from './geometry';

export abstract class Tool {

    public abstract position: Vector;
    public abstract g: ElementRef;
    public abstract gElement?: SVGGElement;
    public abstract board: Board;
    public abstract get isActive(): boolean;
    protected abstract additionalInitialization?: () => void;
    protected abstract angleSet?: () => void;

    // #region managing the correction of the points
    protected abstract getGeometryElements(): Geometry[];

    private _geometryElementsCache?: Geometry[];
    private getGeometryElementsFromCache(): Geometry[] {
        // manage the cache of the lines
        if (!this._geometryElementsCache) {
            this._geometryElementsCache = this.getGeometryElements();
        }
        return this._geometryElementsCache;
    }
    protected clearCache = () => {
        this._geometryElementsCache = undefined;
    }

    public correctPoint(p: Point): Point {
        if (this.isActive) {
            // get all the closestPs to the lines
            let closestPs = this.getGeometryElementsFromCache().map(l => l.getClosestPointTo(p));
            const maxDistance = 40 / this.board.zoom;

            //console.log(closestPs);
            //console.log(this.getLinesFromCache())

            // now look for the closest one to the Point p and return it when it's smaller than the maxDistance
            if (closestPs.length >= 1) {
                let closestP = closestPs[0];
                let minDistance = getDistance(p, closestP);

                for (let i = 1; i < closestPs.length; i++) {
                    const distance = getDistance(p, closestPs[i]);
                    if (distance < minDistance) {
                        minDistance = distance;
                        closestP = closestPs[i];
                    }
                }

                if (minDistance <= maxDistance) {
                    return closestP;
                }
            }
        }

        // otherwise return the original Point
        return p;
    }
    // #endregion
    

    // managing the angle
    private _angle: number = 0;
    public set angle(value: number) {
      this._angle = mod(value, Math.PI * 2);
      this.clearCache();

      if (this.angleSet) {
          this.angleSet();
      }
    }
    public get angle(): number {
      return this._angle;
    }

    public get angleInDeg(): number {
      return this.angle / Math.PI * 180;
    }

    public intialize() {
        try {
            // add myself to the events on the board
            this.board.onWhiteboardViewChange.removeListener(this.clearCache);
            this.board.onWhiteboardViewChange.addListener(this.clearCache);

            // get the g element
            this.gElement = this.g.nativeElement;
    
            // set position
            this.position = this.defaultPosition;
            this.angle = this.defaultAngle;
            this.clearCache();
    
            // make additional intialization
            if (this.additionalInitialization) {
                this.additionalInitialization();
            }
    
            // set up the touch controller
            new TouchController(getTouchControllerEventsAllSame((p: Point) => { }, (from: Point, to: Point) => {
                this.position.x += to.x - from.x;
                this.position.y += to.y - from.y;
                this.clearCache();
            }, (p: Point) => { }, undefined, (angle: number, p: Point) => {
                this.angle += angle;
            }), this.gElement as SVGGElement, this.board.canvas?.svgElement, document);
        }
        catch { }
    }

    protected addLine(x1: number, y1: number, x2: number, y2: number, strokeWidth: number = 1, stroke: string = 'black'): void {
        let line = document.createElementNS(svgns, 'line');
        line.setAttributeNS(null, 'x1', x1.toString());
        line.setAttributeNS(null, 'x2', x2.toString());
        line.setAttributeNS(null, 'y1', y1.toString());
        line.setAttributeNS(null, 'y2', y2.toString());
        line.setAttributeNS(null, 'stroke', stroke);
        line.setAttributeNS(null, 'stroke-width', strokeWidth.toString());
  
        this.gElement?.appendChild(line);
    }

    constructor(protected defaultAngle: number = 0, protected defaultPosition: Vector = { x: 0, y: 0 }) { }
}