import { ElementRef } from '@angular/core';
import { Board, svgns } from 'src/app/whiteboard/global-whiteboard/board/board';
import { TouchController } from "../../global-whiteboard/essentials/touchController";
import { getTouchControllerEventsAllSame } from "../../global-whiteboard/essentials/utils";
import { Point, Vector } from "../../global-whiteboard/interfaces/point";

export abstract class Tool {

    public abstract correctPoint(p: Point): Point;
    protected abstract clearCache: () => void;

    public abstract position: Vector;
    public abstract g: ElementRef;
    public abstract gElement?: SVGGElement;
    public abstract board: Board;
    public abstract get isActive(): boolean;
    protected abstract additionalInitialization?: () => void;
    protected abstract angleSet?: () => void;
    

    // managing the angle
    private _angle: number = 0;
    public set angle(value: number) {
      this._angle = (value + 2 * Math.PI) % (Math.PI * 2);
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

    protected addLine(x1: number, y1: number, x2: number, y2: number, stroke: string = 'black'): void {
        let line = document.createElementNS(svgns, 'line');
        line.setAttributeNS(null, 'x1', x1.toString());
        line.setAttributeNS(null, 'x2', x2.toString());
        line.setAttributeNS(null, 'y1', y1.toString());
        line.setAttributeNS(null, 'y2', y2.toString());
        line.setAttributeNS(null, 'stroke', stroke);
  
        this.gElement?.appendChild(line);
    }

    constructor(private readonly defaultAngle: number = 0, private readonly defaultPosition: Vector = { x: 0, y: 0 }) { }
}