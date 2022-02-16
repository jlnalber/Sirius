import { Injectable } from '@angular/core';
import { PassThrough } from 'stream';
import { Color } from '../global/color';
import { Path } from '../global/path';
import { Stroke } from '../global/stroke';
import { CanvasComponent } from '../whiteboard/drawing/canvas/canvas.component';

const svgns = "http://www.w3.org/2000/svg";

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

export interface Point {
  x: number,
  y: number
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
  public mode: BoardModes = BoardModes.Draw;
  private currentPath: Path = new Path(document.createElementNS(svgns, 'path'), this.stroke);

  public startTouch(p: Point) {
    switch (this.mode) {
      case BoardModes.Draw: this.drawStartTouch(p); break;
      case BoardModes.Move: this.moveStartTouch(p); break;
      case BoardModes.Shape: this.shapeStartTouch(p); break;
    }
  }

  public moveTouch(from: Point, to: Point) {
    switch (this.mode) {
      case BoardModes.Draw: this.drawMoveTouch(from, to); break;
      case BoardModes.Move: this.moveMoveTouch(from, to); break;
      case BoardModes.Shape: this.shapeMoveTouch(from, to); break;
    }
  }

  public endTouch(p: Point) {
    switch (this.mode) {
      case BoardModes.Draw: this.drawEndTouch(p); break;
      case BoardModes.Move: this.moveEndTouch(p); break;
      case BoardModes.Shape: this.shapeEndTouch(p); break;
    }
  }

  private drawStartTouch(p: Point) {
    let pathEl = document.createElementNS(svgns, 'path');
    this.canvas?.gElement?.appendChild(pathEl);
    this.currentPath = new Path(pathEl, this.stroke);
    this.currentPath.addPoint(this.getActualPoint(p));
  }
  private drawMoveTouch(from: Point, to: Point) {
    let realFrom = this.getActualPoint(from);

    this.currentPath.addPoint(realFrom);
  }
  private drawEndTouch(p: Point) {
    this.currentPath.addPoint(this.getActualPoint(p));
    this.currentPath.finalize();
  }

  private moveStartTouch(p: Point) {
    return;
  }
  private moveMoveTouch(from: Point, to: Point) {
    if (this.canvas) {
      this.canvas.translateX += to.x - from.x;
      this.canvas.translateY += to.y - from.y;
    }
  }
  private moveEndTouch(p: Point) {
    return;
  }

  private shapeStartTouch(p: Point) {

  }
  private shapeMoveTouch(from: Point, to: Point) {

  }
  private shapeEndTouch(p: Point) {

  }
  
}
