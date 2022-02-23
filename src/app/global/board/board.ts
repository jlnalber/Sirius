import { CanvasComponent } from "src/app/whiteboard/drawing/canvas/canvas.component";
import { CanvasItem, Point } from "../canvasElements/canvasElement";
import { Color } from "../color";
import { Stroke } from "../stroke";
import { Event } from "../event";
import { Path } from "../canvasElements/path";
import { Delete } from "../canvasElements/delete";
import { Move } from "../canvasElements/move";
import { Circle } from "../canvasElements/circle";
import { Ellipse } from "../canvasElements/ellipse";
import { Line } from "../canvasElements/line";
import { Rectangle } from "../canvasElements/rectangle";
import { Page } from "./page";

const svgns = "http://www.w3.org/2000/svg";

export enum BoardModes {
  Draw,
  Move,
  Shape,
  Delete,
  Select
}

export enum Shapes {
  Rectangle,
  Circle,
  Ellipse,
  Line
}

export class Board {

  public getActualPoint(p: Point): Point {
    if (this.canvas) {
      let x = (p.x - this.canvas.translateX) / this.canvas.zoom;
      let y = (p.y - this.canvas.translateY) / this.canvas.zoom;
      return { x: x, y: y };
    }
    return { x: 0, y: 0 };
  }

  constructor() {
  }

  public stroke: Stroke = new Stroke(new Color(0, 0, 0));
  public fill: Color = new Color(0, 0, 0, 0);
  public canvas: CanvasComponent | undefined;
  public mode: BoardModes = BoardModes.Draw;
  public shapeMode: Shapes = Shapes.Line;
  private currentCanvasItem: CanvasItem | undefined;
  public isOnActiveTouch: boolean = false;

  public readonly onTouch: Event = new Event();
  public readonly onTouchStart: Event = new Event();
  public readonly onTouchMove: Event = new Event();
  public readonly onTouchEnd: Event = new Event();

  public pages: Page[] = [ new Page(this) ]
  public currentPageIndex = 0;
  public get currentPage(): Page {
      return this.pages[this.currentPageIndex];
  };

  public startTouch(p: Point) {
    if (!this.isOnActiveTouch) {
        this.isOnActiveTouch = true;
        this.onTouch.emit();

        switch (this.mode) {
        case BoardModes.Draw: this.currentCanvasItem = new Path(this); break;
        case BoardModes.Delete: this.currentCanvasItem = new Delete(this); break;
        case BoardModes.Move: this.currentCanvasItem = new Move(this); break;
        case BoardModes.Shape: {
            switch (this.shapeMode) {
            case Shapes.Circle: this.currentCanvasItem = new Circle(this); break;
            case Shapes.Ellipse: this.currentCanvasItem = new Ellipse(this); break;
            case Shapes.Line: this.currentCanvasItem = new Line(this); break;
            case Shapes.Rectangle: this.currentCanvasItem = new Rectangle(this); break;
            }
            break;
        } 
        }

        this.currentCanvasItem?.touchStart(p);

        this.onTouchStart.emit();
    }
  }

  public moveTouch(from: Point, to: Point) {
    if (this.isOnActiveTouch) {
      this.currentCanvasItem?.touchMove(from, to);

      this.onTouchMove.emit();
    }
  }

  public endTouch(p: Point) {
    if (this.isOnActiveTouch) {
      this.currentCanvasItem?.touchEnd(p);

      this.onTouchEnd.emit();
      this.isOnActiveTouch = false;
    }
  }

  public createElement(tag: string): SVGElement {
    let el = document.createElementNS(svgns, tag);
    this.canvas?.gElement?.appendChild(el);

    return el;
  }

  public downloadWhiteboard() {
    this.doDownload('whiteboard.svg', this.getSVG());
  }

  public getSVG(): string {
    if (this.canvas && this.canvas.svgElement) {
      return `<?xml version="1.0" encoding="UTF-8"?>
      <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      ${this.canvas.svgElement.innerHTML}
      </svg>`;
    }
    return '';
  }
  
  private doDownload(filename: string, text: string) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
  }
  
}
