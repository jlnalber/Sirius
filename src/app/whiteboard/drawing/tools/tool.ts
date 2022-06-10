import { ElementRef } from '@angular/core';
import { Board, svgns, pixelsToMM } from 'src/app/whiteboard/global-whiteboard/board/board';
import { TouchController } from "../../global-whiteboard/essentials/touchController";
import { getDistance, getTouchControllerEventsAllSame, mod, turnVectorByAngle } from "../../global-whiteboard/essentials/utils";
import { Point, Vector } from "../../global-whiteboard/interfaces/point";
import { Geometry } from './geometry';

export abstract class Tool {

    public abstract position: Vector;
    public abstract g: ElementRef;
    public abstract gElement?: SVGGElement;
    public abstract gMarks: ElementRef;
    public abstract gMarksElement?: SVGGElement;
    public abstract board: Board;
    public abstract get isActive(): boolean;

    protected alreadyDrawn: boolean = false;

    protected additionalInitialization?: () => void;

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

    // #region draw the red line
    protected startPoint?: Point;
    private indexDrawPoints?: number;
    private lineIndicator?: SVGLineElement;
    protected drawPoints(start?: Point, end?: Point, index?: number): void {
      if (start && end) {
        if (!this.lineIndicator) {
          this.lineIndicator = this.addLine(0, 0, 0, 0, 2, 'red');
        }
  
        this.lineIndicator.setAttributeNS(null, 'x1', start.x.toString());
        this.lineIndicator.setAttributeNS(null, 'y1', start.y.toString());
        this.lineIndicator.setAttributeNS(null, 'x2', end.x.toString());
        this.lineIndicator.setAttributeNS(null, 'y2', end.y.toString());

        this.drawAngle((Math.round(getDistance(start, end) / this.board.zoom / pixelsToMM / 10 * 100) / 100).toLocaleString() + 'cm', 'red');
      }
      else if (this.lineIndicator) {
        try {
          this.gElement?.removeChild(this.lineIndicator);
          this.lineIndicator = undefined;
        }
        catch { }
      }
      
      if (!start || !end) {
        // reset the label
        this.drawAngle(this.getAngleLabel(), 'black');
      }
    }
    private resetPoints = () => {
        this.startPoint = undefined;
        this.indexDrawPoints = undefined;
        if (this.isActive) {
            this.requestDrawPoints();
        }
    }
    private requestDrawPoints = (start?: Point, end?: Point, index?: number) => {
        if (start && end)  {
            let realStart = this.board.getAbsolutePointToActualPoint(start);
            let realEnd = this.board.getAbsolutePointToActualPoint(end);
    
            realStart = turnVectorByAngle({
                x: realStart.x - this.position.x,
                y: realStart.y - this.position.y
            }, -this.angle);
            realEnd = turnVectorByAngle({
                x: realEnd.x - this.position.x,
                y: realEnd.y - this.position.y
            }, -this.angle);

            this.drawPoints(realStart, realEnd, index);
        }
        else {
            this.drawPoints();
        }
    }
    // #endregion

    public correctPoint(p: Point): Point {
        if (this.isActive) {
            // get all the closestPs to the lines
            let closestPs = this.getGeometryElementsFromCache().map(l => l.getClosestPointTo(p));
            const maxDistance = 30 / this.board.zoom;

            //console.log(closestPs);
            //console.log(this.getLinesFromCache())

            // now look for the closest one to the Point p and return it when it's smaller than the maxDistance
            if (closestPs.length >= 1) {
                let closestP = closestPs[0];
                let closestPIndex = 0;
                let minDistance = getDistance(p, closestP);

                for (let i = 1; i < closestPs.length; i++) {
                    const distance = getDistance(p, closestPs[i]);
                    if (distance < minDistance) {
                        minDistance = distance;
                        closestP = closestPs[i];
                        closestPIndex = i;
                    }
                }

                if (minDistance <= maxDistance) {
                    if (closestPIndex != this.indexDrawPoints) this.resetPoints();
                    this.indexDrawPoints = closestPIndex;
                    if (!this.startPoint) this.startPoint = closestP;
                    this.requestDrawPoints(this.startPoint, closestP, this.indexDrawPoints);

                    return closestP;
                }
            }

            this.resetPoints();
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

      this.drawAngle(this.getAngleLabel(), 'black');
    }
    public get angle(): number {
      return this._angle;
    }

    public get angleInDeg(): number {
      return this.angle / Math.PI * 180;
    }

    private getAngleLabel(): string {
        return (Math.round(mod(this.angle - this.defaultAngle, 2 * Math.PI) / Math.PI * 180 * 100) / 100).toLocaleString() + '°';
    }

    private zoomListener = () => {
        if (this.isActive) {
            this.drawLines();
            this.drawAngle(this.getAngleLabel(), 'black');
            this.requestDrawPoints();
            this.alreadyDrawn = true;
        }
    }

    public intialize() {
        try {
            this.alreadyDrawn = false;

            // add myself to the events on the board
            this.board.onWhiteboardViewChange.removeListener(this.clearCache);
            this.board.onWhiteboardViewChange.addListener(this.clearCache);

            this.board.onZoom.removeListener(this.zoomListener);
            this.board.onZoom.addListener(this.zoomListener);

            this.board.onPageSwitched.removeListener(this.zoomListener);
            this.board.onPageSwitched.addListener(this.zoomListener);

            this.board.onInput.removeListener(this.resetPoints);
            this.board.onInput.addListener(this.resetPoints);
            this.board.onWhiteboardViewChange.removeListener(this.resetPoints);
            this.board.onWhiteboardViewChange.addListener(this.resetPoints);

            // get the g element
            this.gElement = this.g.nativeElement;
            this.gMarksElement = this.gMarks.nativeElement;
    
            // set position
            this.position = {
                x: this.defaultPosition.x,
                y: this.defaultPosition.y
            };
            this.angle = this.defaultAngle;
            this.clearCache();
    
            // make additional intialization
            if (this.additionalInitialization) {
                this.additionalInitialization();
            }

            // draw lines and angle
            this.drawLines();
            this.drawAngle(this.getAngleLabel(), 'black');
            this.resetPoints();
            this.alreadyDrawn = true;
    
            // set up the touch controller
            new TouchController(getTouchControllerEventsAllSame((p: Point) => { }, (from: Point, to: Point) => {
                this.position.x += to.x - from.x;
                this.position.y += to.y - from.y;
                this.clearCache();
                this.resetPoints();
            }, (p: Point) => { }, undefined, (angle: number, p: Point) => {
                this.turnAroundPoint(angle, p);
                this.resetPoints();
            }, undefined, (by: number, p: Point) => {
                let angle = by / 180 * Math.PI / 10;
                this.turnAroundPoint(angle, p);
                this.resetPoints();
            }), this.gElement as SVGGElement, this.board.canvas?.svgWrapperElement, document);
        }
        catch { }
    }

    protected turnAroundPoint(angle: number, p: Point): void {
        p = {
            x: p.x - this.position.x,
            y: p.y - this.position.y
        }
        let turnedP = turnVectorByAngle(p, angle);
        this.angle += angle;
        this.position.x += p.x - turnedP.x;
        this.position.y += p.y - turnedP.y;
    }

    private getLine(x1: number, y1: number, x2: number, y2: number, strokeWidth: number = 1, stroke: string = 'black'): SVGLineElement {
        let line = document.createElementNS(svgns, 'line');
        line.setAttributeNS(null, 'x1', x1.toString());
        line.setAttributeNS(null, 'x2', x2.toString());
        line.setAttributeNS(null, 'y1', y1.toString());
        line.setAttributeNS(null, 'y2', y2.toString());
        line.setAttributeNS(null, 'stroke', stroke);
        line.setAttributeNS(null, 'stroke-width', strokeWidth.toString());

        return line;
    }

    protected addLineMarks(x1: number, y1: number, x2: number, y2: number, strokeWidth: number = 1, stroke: string = 'black'): SVGLineElement {
        return this.gMarksElement?.appendChild(this.getLine(x1, y1, x2, y2, strokeWidth, stroke)) as SVGLineElement;
    }

    protected addLine(x1: number, y1: number, x2: number, y2: number, strokeWidth: number = 1, stroke: string = 'black'): SVGLineElement {
        return this.gElement?.appendChild(this.getLine(x1, y1, x2, y2, strokeWidth, stroke)) as SVGLineElement;
    }

    private getText(x: number, y: number, str: string | number): SVGTextElement {
        let text = document.createElementNS(svgns, 'text');
        text.textContent = str.toLocaleString();
        text.setAttributeNS(null, 'x', x.toString());
        text.setAttributeNS(null, 'y', y.toString());

        return text;
    }

    protected addTextMarks(x: number, y: number, str: string | number): SVGTextElement {
        return this.gMarksElement?.appendChild(this.getText(x, y, str)) as SVGTextElement;
    }

    protected addText(x: number, y: number, str: string | number): SVGTextElement {
        return this.gElement?.appendChild(this.getText(x, y, str)) as SVGTextElement;
    }

    protected removeMarks(): void {
        if (this.gMarksElement) {
            this.gMarksElement.innerHTML = '';
        }
    }

    protected getJumpsForMarks(): number {
        return Math.max(1, Math.floor(1 / this.board.zoom));
    }

    protected abstract drawLines(): void;
    protected abstract drawAngle(value: string, color: string): void;

    constructor(protected defaultAngle: number = 0, protected defaultPosition: Vector = { x: 0, y: 0 }) { }
}