import { Injectable } from '@angular/core';
import { PassThrough } from 'stream';
import { Color } from '../global/color';
import { Path } from '../global/path';
import { Stroke } from '../global/stroke';
import { CanvasComponent } from '../whiteboard/drawing/canvas/canvas.component';

const svgns = "http://www.w3.org/2000/svg";

export enum BoardModes {
  Draw,
  Move
}

export interface Point {
  x: number,
  y: number
}

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  private static calculateCoord(origVal: number, translate: number, zoom: number) {
    return (origVal - translate) / zoom;
  }

  constructor() { }

  public stroke: Stroke = new Stroke(new Color(0, 0, 0));
  public canvas: CanvasComponent | undefined;
  public mode: BoardModes = BoardModes.Draw;
  private currentPath: Path = new Path(document.createElementNS(svgns, 'path'), this.stroke);

  public startTouch() {
    switch (this.mode) {
      case BoardModes.Draw: this.drawStartTouch(); break;
      case BoardModes.Move: this.moveStartTouch(); break;
    }
  }

  public moveTouch(from: Point, to: Point) {
    switch (this.mode) {
      case BoardModes.Draw: this.drawMoveTouch(from, to); break;
      case BoardModes.Move: this.moveMoveTouch(from, to); break;
    }
  }

  public endTouch() {
    switch (this.mode) {
      case BoardModes.Draw: this.drawEndTouch(); break;
      case BoardModes.Move: this.moveEndTouch(); break;
    }
  }

  private drawStartTouch() {
    let pathEl = document.createElementNS(svgns, 'path');
    this.canvas?.gElement?.appendChild(pathEl);
    this.currentPath = new Path(pathEl, this.stroke);
  }
  private drawMoveTouch(from: Point, to: Point) {
    if (this.canvas) {
      let x = BoardService.calculateCoord(to.x, this.canvas.translateX, this.canvas.zoom);
      let y = BoardService.calculateCoord(to.y, this.canvas.translateY, this.canvas.zoom);
      let p = { x: x, y: y };
      this.currentPath.addPoint(p);
    }
  }
  private drawEndTouch() {
    this.currentPath.finalize();
  }

  private moveStartTouch() {
    return;
  }
  private moveMoveTouch(from: Point, to: Point) {
    if (this.canvas) {
      this.canvas.translateX += to.x - from.x;
      this.canvas.translateY += to.y - from.y;
    }
  }
  private moveEndTouch() {
    return;
  }
  
}
