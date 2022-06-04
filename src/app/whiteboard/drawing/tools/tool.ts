import { ElementRef } from '@angular/core';
import { Board } from 'src/app/whiteboard/global-whiteboard/board/board';
import { TouchController } from "../../global-whiteboard/essentials/touchController";
import { getTouchControllerEventsAllSame } from "../../global-whiteboard/essentials/utils";
import { Point, Vector } from "../../global-whiteboard/interfaces/point";

export abstract class Tool {
    public abstract correctPoint(p: Point): Point;
    public abstract angle: number;
    public abstract position: Vector;
    public abstract g: ElementRef;
    public abstract gElement?: SVGGElement;
    public abstract board: Board;
    protected abstract additionalInitialization?: () => void;
    protected abstract _lineCache?: any;

    public get angleInDeg(): number {
      //console.log('Hey!')
      return this.angle / Math.PI * 180;
    }

    public turnByAngle(angle: number, p: Point): void {
        this.angle += angle;
    }

    public intialize() {
        try {
            this.gElement = this.g.nativeElement;
    
            this.position = { x: 0, y: 0 }
            this.angle = 0;
            this._lineCache = undefined;
    
            if (this.additionalInitialization) {
                this.additionalInitialization();
            }
    
            new TouchController(getTouchControllerEventsAllSame((p: Point) => { }, (from: Point, to: Point) => {
                this.position.x += to.x - from.x;
                this.position.y += to.y - from.y;
                this._lineCache = undefined;
            }, (p: Point) => { }, undefined, (angle: number, p: Point) => {
                this.turnByAngle(angle, p);
            }), this.gElement as SVGGElement, this.board.canvas?.svgElement, document);
        }
        catch { }
    }
}