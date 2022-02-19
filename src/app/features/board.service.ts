import { Rectangle } from './../global/canvasElements/rectangle';
import { Injectable } from '@angular/core';
import { PassThrough } from 'stream';
import { CanvasItem, Point, svgns } from '../global/canvasElements/canvasElement';
import { Color } from '../global/color';
import { Path } from '../global/canvasElements/path';
import { Stroke } from '../global/stroke';
import { CanvasComponent } from '../whiteboard/drawing/canvas/canvas.component';
import { Move } from '../global/canvasElements/move';
import { Event } from '../global/event';

export enum BoardModes {
  Draw,
  Move,
  Shape
}

export enum Shapes {
  Rectangle,
  Circle,
  Ellipse,
  Line
}

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  public getActualPoint(p: Point): Point {
    if (this.canvas) {
      let x = (p.x - this.canvas.translateX) / this.canvas.zoom;
      let y = (p.y - this.canvas.translateY) / this.canvas.zoom;
      return { x: x, y: y };
    }
    return { x: 0, y: 0 };
  }

  constructor() { }

  public stroke: Stroke = new Stroke(new Color(0, 0, 0));
  public canvas: CanvasComponent | undefined;
  public mode: BoardModes = BoardModes.Shape;
  public shapeMode: Shapes = Shapes.Rectangle;
  private currentCanvasItem: CanvasItem | undefined;
  public isOnActiveTouch: boolean = false;
  public onTouch: Event = new Event();

  public startTouch(p: Point) {
    this.isOnActiveTouch = true;
    this.onTouch.emit();

    switch (this.mode) {
      case BoardModes.Draw: this.currentCanvasItem = new Path(this); break;
      case BoardModes.Move: this.currentCanvasItem = new Move(this); break;
      case BoardModes.Shape: this.currentCanvasItem = new Rectangle(this); break;
    }

    this.currentCanvasItem?.touchStart(p);
  }

  public moveTouch(from: Point, to: Point) {
    if (this.isOnActiveTouch) {
      this.currentCanvasItem?.touchMove(from, to);
    }
  }

  public endTouch(p: Point) {
    if (this.isOnActiveTouch) {
      this.currentCanvasItem?.touchEnd(p);
    }

    this.isOnActiveTouch = false;
  }
  
}
