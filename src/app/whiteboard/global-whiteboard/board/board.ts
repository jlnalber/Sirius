import { Whiteboard as WhiteboardExport, Page as PageExport } from './../interfaces/whiteboard';
import { EmptyCanvasElement } from './../canvasElements/emptyCanvasElement';
import { Select } from './../canvasElements/select';
import { CanvasComponent } from "src/app/whiteboard/drawing/canvas/canvas.component";
import { CanvasItem } from "../canvasElements/canvasElement";
import { Stroke } from "../essentials/stroke";
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
import { Rect } from '../interfaces/rect';
import { Point } from '../interfaces/point';
import { Color } from '../essentials/color';
import { SelectorComponent } from '../../drawing/selector/selector.component';
import { Event } from '../essentials/event';

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
      let x = (p.x - this.translateX) / this.zoom;
      let y = (p.y - this.translateY) / this.zoom;
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
        width: rect.width / this.zoom,
        height: rect.height / this.zoom
      }
    }
    return {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    }
  }

  public getPosFromMouseEvent(e: MouseEvent): Point {
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
  public backgroundImage: string = '';

  public readonly onBoardModeChange: Event = new Event();
  public readonly onTouch: Event = new Event();
  public readonly onTouchStart: Event = new Event();
  public readonly onTouchMove: Event = new Event();
  public readonly onTouchEnd: Event = new Event();
  public readonly onPageSwitched: Event = new Event();
  public readonly beforePageSwitched: Event = new Event();
  public readonly onAddElement: Event = new Event();
  public readonly onRemoveElement: Event = new Event();
  public readonly onImport: Event = new Event();

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


  // translate and zoom (actually managed by page)
  public get translateX(): number {
    return this.currentPage.translateX;
  }
  public set translateX(value: number) {
    this.currentPage.translateX = value;
  }

  public get translateY(): number {
    return this.currentPage.translateY;
  }
  public set translateY(value: number) {
    this.currentPage.translateY = value;
  }

  public get zoom(): number {
    return this.currentPage.zoom;
  }
  public set zoom(value: number) {
    this.currentPage.zoom = value;
  }

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
    this.doDownload('whiteboard.json', JSON.stringify(this.export()));
  }

  public downloadSVG(): void {
    this.doDownload('whiteboard.svg', this.currentPage.getSVG(), 'svg');
  }

  public downloadPDF() {
    if (this.canvas && this.canvas.svgElement) {
      let rect = this.currentPage.getSizeRect();

      let svg = document.createElement('svg');
      svg.innerHTML = this.canvas.svgElement.innerHTML;

      let bgRect = document.createElement('rect');
      bgRect.setAttributeNS('null', 'x', rect.x.toString());
      bgRect.setAttributeNS('null', 'y', rect.y.toString());
      bgRect.setAttributeNS('null', 'width', rect.width.toString());
      bgRect.setAttributeNS('null', 'height', rect.height.toString());
      bgRect.setAttributeNS('null', 'fill', this.backgroundColor.toString());
      svg.insertBefore(bgRect, svg.firstChild);

      const doc = new jsPDF(
        'l', 'px', [ rect.width - rect.x, rect.height - rect.y ]
      );
      doc
        .svg(svg, {
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
  
  private doDownload(filename: string, text: string, type?: string) {
    console.log(text);

    var element = document.createElement('a');
    element.setAttribute('href', `data:${type ?? 'text'}/plain;charset=utf-8,` + encodeURIComponent(text));
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

  public import(whiteboard: WhiteboardExport): boolean {
    // Lade das Whiteboard aus einer Datei
    try {
      this.backgroundImage = whiteboard.backgroundImage;
      this.backgroundColor.from(whiteboard.backgroundColor);

      this.pages.splice(0);
      for (let page of whiteboard.pages) {
        let p = new Page(this);
        p.import(page);
        this.pages.push(p);
      }
      if (this.pages.length == 0) {
        this.pages.push(new Page(this));
      }

      let pageIndex = whiteboard.pageIndex >= this.pages.length ? 0 : whiteboard.pageIndex;
      this.pages[pageIndex].reload();
      this.currentPageIndex = pageIndex;

      this.onImport.emit();

      return true;
    }
    catch {
      return false;
    }
  }

  public export(): WhiteboardExport {
    // Exportiere dieses Whiteboard
    let pages: PageExport[] = [];
    for (let page of this.pages) {
      pages.push(page.export());
    }
    return {
      backgroundImage: this.backgroundImage,
      backgroundColor: this.backgroundColor.export(),
      pageIndex: this.currentPageIndex,
      pages: pages
    };
  }
  
}
