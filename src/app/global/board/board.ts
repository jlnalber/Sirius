import { Rect } from './../../interfaces/rect';
import { SelectorComponent } from './../../whiteboard/drawing/selector/selector.component';
import { SelectControlComponent } from './../../whiteboard/drawing/select-control/select-control.component';
import { EmptyCanvasElement } from './../canvasElements/emptyCanvasElement';
import { Select } from './../canvasElements/select';
import { BackgroundImageCross } from './background/cross.backgroundImage copy';
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
import { jsPDF } from "jspdf";
import 'svg2pdf.js';
import { BackgroundImage } from "./background/backgroundImage";

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
    // berechne die Position eines Punktes im canvas
    if (this.canvas) {
      let x = (p.x - this.canvas.translateX) / this.canvas.zoom;
      let y = (p.y - this.canvas.translateY) / this.canvas.zoom;
      return { x: x, y: y };
    }
    return { x: 0, y: 0 };
  }

  public getActualRect(rect: Rect): Rect {
    // berechne die Position eines Rects im canvas
    if (this.canvas) {
      let startPoint = this.getActualPoint(rect);
      return {
        x: startPoint.x,
        y: startPoint.y,
        width: rect.width / this.canvas.zoom,
        height: rect.height / this.canvas.zoom
      }
    }
    return {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    }
  }

  public  getPosFromMouseEvent(e: MouseEvent): Point {
    const rect = this.canvas?.svgElement?.getBoundingClientRect() as DOMRect;

    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  public getPosFromTouchEvent(e: any): Point {
    let res1: any = e.changedTouches[0];

    const rect = this.canvas?.svgElement?.getBoundingClientRect() as DOMRect;
    
    return {
      x: res1.clientX - rect.left,
      y: res1.clientY - rect.top
    };
  }

  constructor() {
    new Delete(this);
    new Select(this);
  }

  public stroke: Stroke = new Stroke(new Color(255, 255, 255), 5);
  public fill: Color = new Color(0, 0, 0, 0);
  public canvas: CanvasComponent | undefined;
  public selector: SelectorComponent | undefined;

  private _mode: BoardModes = BoardModes.Draw;
  public get mode(): BoardModes {
    return this._mode;
  }
  public set mode(value: BoardModes) {
    this._mode = value;
    this.onBoardModeChange.emit();
  }

  public shapeMode: Shapes = Shapes.Line;
  private currentCanvasItem: CanvasItem | undefined;
  public isOnActiveTouch: boolean = false;
  public backgroundColor: Color = new Color(18, 52, 19);
  public backgroundImage: BackgroundImage = new BackgroundImageCross();

  public readonly onBoardModeChange: Event = new Event();
  public readonly onTouch: Event = new Event();
  public readonly onTouchStart: Event = new Event();
  public readonly onTouchMove: Event = new Event();
  public readonly onTouchEnd: Event = new Event();
  public readonly onPageSwitched: Event = new Event();
  public readonly beforePageSwitched: Event = new Event();
  public readonly onAddElement: Event = new Event();
  public readonly onRemoveElement: Event = new Event();

  public pages: Page[] = [ new Page(this) ]
  private _currentPageIndex = 0;
  public get currentPageIndex(): number {
    return this._currentPageIndex;
  }
  public set currentPageIndex(value: number) {
    if (value >= 0 && value < this.pages.length && this._currentPageIndex != value) {
      this.beforePageSwitched.emit();
      this.currentPage.close();
      this._currentPageIndex = value;
      this.currentPage.open();
      this.onPageSwitched.emit();
    } 
  }
  public get currentPage(): Page {
      return this.pages[this.currentPageIndex];
  };

  public async startTouch(p: Point) {
    if (!this.isOnActiveTouch) {
        this.isOnActiveTouch = true;
        this.onTouch.emit();

        switch (this.mode) {
        case BoardModes.Draw: this.currentCanvasItem = new Path(this); break;
        case BoardModes.Delete: this.currentCanvasItem = new EmptyCanvasElement(); break;
        case BoardModes.Move: this.currentCanvasItem = new Move(this); break;
        case BoardModes.Select: this.currentCanvasItem = new EmptyCanvasElement(); break;
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

  public async moveTouch(from: Point, to: Point) {
    if (this.isOnActiveTouch) {
      this.currentCanvasItem?.touchMove(from, to);

      this.onTouchMove.emit();
    }
  }

  public async endTouch(p: Point) {
    if (this.isOnActiveTouch) {
      this.currentCanvasItem?.touchEnd(p);

      this.onTouchEnd.emit();
      this.isOnActiveTouch = false;
    }
  }

  public createElement(tag: string): SVGElement {
    let el = document.createElementNS(svgns, tag);
    this.canvas?.gElement?.appendChild(el);

    this.onAddElement.emit();

    return el;
  }

  public removeElement(el: SVGElement): boolean {
    if (this.canvas && this.canvas.gElement && this.canvas.gElement.contains(el)) {
      this.canvas.gElement.removeChild(el);

      this.onRemoveElement.emit();

      return true;
    }
    return false;
  }

  public downloadWhiteboard() {
    this.doDownload('whiteboard.svg', this.getSVG());
  }

  public downloadPDF() {
    if (this.canvas && this.canvas.svgElement) {
      let rect = this.currentPage.getSizeRect();

      const doc = new jsPDF('l', 'px', [ rect.width - rect.x, rect.height - rect.y ]);
      doc
        .svg(this.canvas.svgElement, {
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
          loadExternalStyleSheets: true
        })
        .then(() => {
          doc.save('whiteboard.pdf');
        })
    }
  }

  public getSVG(): string {
    if (this.canvas && this.canvas.svgElement) {
      return `<?xml version="1.0" encoding="UTF-8"?>
      <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="${this.backgroundColor.toString()}" style="background-color: ${this.backgroundColor.toString()}; background-image: url('${this.backgroundImage.url}');">
      ${this.canvas.svgElement.innerHTML}
      </svg>`;
    }
    return '';
  }

  public goBack() {
    this.currentPage.goBack();
  }

  public canGoBack() {
    return this.currentPage.canGoBack();
  }

  public goForward() {
    this.currentPage.goForward();
  }

  public canGoForward() {
    return this.currentPage.canGoForward();
  }

  public clear() {
    this.currentPage.clear();
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

  public addPage() {
    this.pages.push(new Page(this));
    this.currentPageIndex = this.pages.length - 1;
  }
  
}
