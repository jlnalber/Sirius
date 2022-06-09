import { Vector } from './../interfaces/point';
import { HalbkreisComponent } from './../../drawing/tools/halbkreis/halbkreis.component';
import { LinealComponent } from './../../drawing/tools/lineal/lineal.component';
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
import { Rect } from '../interfaces/rect';
import { Point } from '../interfaces/point';
import { Color } from '../essentials/color';
import { SelectorComponent } from '../../drawing/selector/selector.component';
import { Event } from '../essentials/event';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import { add, defaultPoint, getBoundingRect, getImageDimensions, getIntersectionRects, sameRect, scale } from '../essentials/utils';
import { GeodreieckComponent } from '../../drawing/tools/geodreieck/geodreieck.component';

declare var require: any

export const svgns = "http://www.w3.org/2000/svg";

export const pixelsToMM = 4;

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

  //#region methods for dealing with positions
  public getActualPoint(p: Point): Point {
    // berechne die Position eines Punktes im canvas
    if (this.canvas) {
      if (this.format) {
        // Wenn ein Format eingestellt ist, muss der Punkt anders berechnet werden, da die scale-Property bei HTML-Elementen nicht vom Ursprung sondern vom Zentrum scalet
        let center: Vector = {
          x: this.format.width / 2 + this.translateX,
          y: this.format.height / 2 + this.translateY
        }
        let cToP = add(p, scale(center, -1));
        let newCToP = scale(cToP, 1 / this.zoom);
        let x = this.format.width / 2 + newCToP.x;
        let y = this.format.height / 2 + newCToP.y;
        return { x: x, y: y };
      }
      else {
        let x = (p.x - this.translateX) / this.zoom;
        let y = (p.y - this.translateY) / this.zoom;
        return { x: x, y: y };
      }
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

  public getRectRealPosInCanvas(rect: Rect): Rect {
    // calculate the position of a rect in the canvas (if svg deposition is respected)
    if (this.canvas && this.canvas.svgElement && this.canvas.svgWrapperElement) {

      let svgRect = this.canvas.svgElement.getBoundingClientRect() as DOMRect;
      
      // in the format mode, the rect is from the svgWrapper
      if (this.format) {
        svgRect = this.canvas.svgWrapperElement.getBoundingClientRect() as DOMRect;
      }

      return {
        x: rect.x - svgRect.left,
        y: rect.y - svgRect.top,
        width: rect.width,
        height: rect.height
      };
    }
    return rect;
  }

  public getRectFromBoundingClientRect(rect: DOMRect | Rect | undefined): Rect {
    // maps DOMRect or rect to the actual coordinates in the svg
    
    if (rect instanceof DOMRect) {
      rect = {
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height
      };
    }

    return this.getActualRect(this.getRectRealPosInCanvas(rect ?? {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    }));
  }

  public correctPoint(p: Point): Point {
    // transform the point so that it fits with the opened tools
    if (this.linealOpen && this.lineal) {
      return this.lineal.correctPoint(p);
    }
    else if (this.geodreieckOpen && this.geodreieck) {
      return this.geodreieck.correctPoint(p);
    }
    else if (this.halbkreisOpen && this.halbkreis) {
      return this.halbkreis.correctPoint(p);
    }
    return p;
  }
  //#endregion

  constructor() {
    // new Delete(this);

    // those listeners will reset the select on certain occassions
    this.onBoardAnyModeChange.addListener(() => {
      // reset the selector when the board mode is changed
      if (this.selector) {
        this.selector.svgEl = undefined;
      }
    })

    this.onBoardDetectPointer.addListener(() => {
      if (this.selector) {
        this.selector.svgEl = undefined;
      }
    });
  }

  public stroke: Stroke = new Stroke(new Color(0, 0, 0), 5);
  public fill: Color = new Color(0, 0, 0, 0);
  public canvas: CanvasComponent | undefined;
  public selector: SelectorComponent | undefined;

  // #region the tools
  public lineal: LinealComponent | undefined;
  private _linealOpen: boolean = false;
  public get linealOpen(): boolean {
    return this._linealOpen;
  }
  public set linealOpen(value: boolean) {
    this._linealOpen = value;
    this.onLinealToggled.emit();
    this.onToolToggled.emit();
  }

  public geodreieck: GeodreieckComponent | undefined;
  private _geodreieckOpen: boolean = false;
  public get geodreieckOpen(): boolean {
    return this._geodreieckOpen;
  }
  public set geodreieckOpen(value: boolean) {
    this._geodreieckOpen = value;
    this.onGeodreieckToggled.emit();
    this.onToolToggled.emit();
  }

  public halbkreis: HalbkreisComponent | undefined;
  private _halbkreisOpen: boolean = false;
  public get halbkreisOpen(): boolean {
    return this._halbkreisOpen;
  }
  public set halbkreisOpen(value: boolean) {
    this._halbkreisOpen = value;
    this.onHalbkreisToggled.emit();
    this.onToolToggled.emit();
  }
  // #endregion

  // #region the modes
  private _mode: BoardModes = BoardModes.Draw;
  public get mode(): BoardModes {
    return this._mode;
  }
  public set mode(value: BoardModes) {
    this._mode = value;
    this.onBoardModeChange.emit();
    this.onBoardAnyModeChange.emit();
  }

  private _touchMode: BoardModes = BoardModes.Move;
  public get touchMode(): BoardModes {
    return this._touchMode;
  }
  public set touchMode(value: BoardModes) {
    this._touchMode = value;
    this.onBoardTouchModeChange.emit();
    this.onBoardAnyModeChange.emit();
  }

  private _barrelMode: BoardModes = BoardModes.Select;
  public get barrelMode(): BoardModes {
    return this._barrelMode;
  }
  public set barrelMode(value: BoardModes) {
    this._barrelMode = value;
    this.onBoardBarrelModeChange.emit();
    this.onBoardAnyModeChange.emit();
  }

  private _eraseMode: BoardModes = BoardModes.Delete;
  public get eraseMode(): BoardModes {
    return this._eraseMode;
  }
  public set eraseMode(value: BoardModes) {
    this._eraseMode = value;
    this.onBoardEraseModeChange.emit();
    this.onBoardAnyModeChange.emit();
  }
  // #endregion

  private _backgroundColor: Color = new Color(255, 255, 255);
  public set backgroundColor(value: Color) {
    this._backgroundColor = value;
    this.onBackgroundChange.emit();
  }
  public get backgroundColor(): Color {
    return this._backgroundColor;
  }

  private _backgroundScale: number = 1;
  public set backgroundScale(value: number) {
    this._backgroundScale = value;
    this.onBackgroundChange.emit();
  }
  public get backgroundScale(): number {
    return this._backgroundScale;
  }

  private _backgroundImage: string = '';
  public set backgroundImage(value: string) {
    this._backgroundImage = value;
    this.onBackgroundChange.emit();
  }
  public get backgroundImage(): string {
    return this._backgroundImage;
  }

  private _format?: Rect;
  public set format(value: Rect | undefined) {
    if (!sameRect(this._format, value)) {
      this._format = value;
      this.onFormatChanged.emit();
    }
  }
  public get format(): Rect | undefined {
    return this._format;
  }

  public shapeMode: Shapes = Shapes.Line;
  private currentCanvasItem: CanvasItem | undefined;
  private currentTouchCanvasItem: CanvasItem | undefined;
  private currentBarrelCanvasItem: CanvasItem | undefined;
  private currentEraseCanvasItem: CanvasItem | undefined;
  public isOnActiveMouse: boolean = false;
  //public isOnActiveTouch: boolean = false;
  public onPointerMoveDoZoom: boolean = true;

  public readonly onBoardModeChange: Event = new Event();
  public readonly onBoardTouchModeChange: Event = new Event();
  public readonly onBoardBarrelModeChange: Event = new Event();
  public readonly onBoardEraseModeChange: Event = new Event();
  public readonly onBoardAnyModeChange: Event = new Event();

  public readonly onMouse: Event = new Event();
  public readonly onMouseStart: Event = new Event();
  public readonly onMouseMove: Event = new Event();
  public readonly onMouseEnd: Event = new Event();
  public readonly onTouch: Event = new Event();
  public readonly onTouchStart: Event = new Event();
  public readonly onTouchMove: Event = new Event();
  public readonly onTouchEnd: Event = new Event();
  public readonly onBarrel: Event = new Event();
  public readonly onBarrelStart: Event = new Event();
  public readonly onBarrelMove: Event = new Event();
  public readonly onBarrelEnd: Event = new Event();
  public readonly onErase: Event = new Event();
  public readonly onEraseStart: Event = new Event();
  public readonly onEraseMove: Event = new Event();
  public readonly onEraseEnd: Event = new Event();
  public readonly onInput: Event = new Event();

  public readonly onPageSwitched: Event = new Event();
  public readonly onPageRemoved: Event = new Event();
  public readonly beforePageSwitched: Event = new Event();
  public readonly onAddElement: Event = new Event();
  public readonly onRemoveElement: Event = new Event();
  public readonly onImport: Event = new Event();
  public readonly onZoom: Event = new Event();
  public readonly onWhiteboardViewChange: Event = new Event();
  public readonly onBackgroundChange: Event = new Event();
  public readonly onBack: Event = new Event();
  public readonly onForward: Event = new Event();
  public readonly onBoardDetectPointer: Event = new Event();
  public readonly onFormatChanged: Event = new Event();

  public readonly onLinealToggled: Event = new Event();
  public readonly onGeodreieckToggled: Event = new Event();
  public readonly onHalbkreisToggled: Event = new Event();
  public readonly onToolToggled: Event = new Event();

  //#region pages
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
      this.onWhiteboardViewChange.emit();
    } 
  }
  public get currentPage(): Page {
      return this.pages[this.currentPageIndex];
  };

  public removePage(page: Page): boolean {
    // try to remove the page
    const index = this.pages.indexOf(page);
    if (index >= 0) {
      try {
        this.beforePageSwitched.emit();
        this.currentPage.close();
        this.pages.splice(index, 1);
        if (this.pages.length == 0) {
          this.pages.push(new Page(this));
        }
        if (this.currentPageIndex >= this.pages.length) {
          this._currentPageIndex = this.pages.length - 1;
        }
        this.currentPage.open();
        this.onPageSwitched.emit();
        this.onWhiteboardViewChange.emit();
        this.onPageRemoved.emit();
        
        return true;
      }
      catch {
        return false;
      }
    }
    return false;
  }
  //#endregion

  //#region translate and zoom (actually managed by page)
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

  public zoomTo(value: number, p?: Point): void {
    this.currentPage.zoomTo(value, p);
  }
  //#endregion

  //#region touch and mouse event handlers
  private getCanvasElementToMode(mode: BoardModes): CanvasItem {
    // returns to a board mode the according CanvasItem
    switch (mode) {
      case BoardModes.Draw: return new Path(this);
      case BoardModes.Delete: return new Delete(this);
      case BoardModes.Move: return new Move(this);
      case BoardModes.Select: return new Select(this);
      case BoardModes.Shape: {
        switch (this.shapeMode) {
          case Shapes.Circle: return new Circle(this);
          case Shapes.Ellipse: return new Ellipse(this);
          case Shapes.Line: return new Line(this);
          case Shapes.Rectangle: return new Rectangle(this);
          default: return new EmptyCanvasElement();
        }
      }
      default: return new EmptyCanvasElement(); 
    }
  }

  public async startMouse(p: Point) {
    if (!this.isOnActiveMouse) {
        this.onBoardDetectPointer.emit();

        this.isOnActiveMouse = true;
        this.onMouse.emit();

        this.currentCanvasItem = this.getCanvasElementToMode(this.mode);

        this.currentCanvasItem?.touchStart(p);

        this.onMouseStart.emit();
    }
  }

  public async moveMouse(from: Point, to: Point) {
    if (this.isOnActiveMouse && this.currentCanvasItem) {
      this.currentCanvasItem.touchMove(from, to);

      this.onMouseMove.emit();
    }
  }

  public async endMouse(p: Point) {
    if (this.isOnActiveMouse && this.currentCanvasItem) {
      this.currentCanvasItem.touchEnd(p);

      this.onMouseEnd.emit();
      this.isOnActiveMouse = false;
      this.markChange();
    }
  }

  public async startTouch(p: Point) {
    if (!this.isOnActiveMouse) {
        this.onBoardDetectPointer.emit();

        //this.isOnActiveTouch = true;
        this.onTouch.emit();

        this.currentTouchCanvasItem = this.getCanvasElementToMode(this.touchMode);

        this.currentTouchCanvasItem?.touchStart(p);

        this.onTouchStart.emit();
    }
  }

  public async moveTouch(from: Point, to: Point) {
    if (!this.isOnActiveMouse && this.currentTouchCanvasItem) {
      this.currentTouchCanvasItem.touchMove(from, to);

      this.onTouchMove.emit();
    }
  }

  public async endTouch(p: Point) {
    if (!this.isOnActiveMouse && this.currentTouchCanvasItem) {
      this.currentTouchCanvasItem.touchEnd(p);

      this.onTouchEnd.emit();
      //this.isOnActiveTouch = false;
      this.markChange();
    }
  }

  public async startBarrel(p: Point) {
    if (!this.isOnActiveMouse) {
        this.onBoardDetectPointer.emit();
        
        //this.isOnActiveTouch = true;
        this.onBarrel.emit();

        this.currentBarrelCanvasItem = this.getCanvasElementToMode(this.barrelMode);

        this.currentBarrelCanvasItem?.touchStart(p);

        this.onBarrelStart.emit();
    }
  }

  public async moveBarrel(from: Point, to: Point) {
    if (!this.isOnActiveMouse && this.currentBarrelCanvasItem) {
      this.currentBarrelCanvasItem.touchMove(from, to);

      this.onBarrelMove.emit();
    }
  }

  public async endBarrel(p: Point) {
    if (!this.isOnActiveMouse && this.currentBarrelCanvasItem) {
      this.currentBarrelCanvasItem.touchEnd(p);

      this.onBarrelEnd.emit();
      //this.isOnActiveTouch = false;
      this.markChange();
    }
  }

  public async startErase(p: Point) {
    if (!this.isOnActiveMouse) {
        this.onBoardDetectPointer.emit();

        //this.isOnActiveTouch = true;
        this.onErase.emit();

        this.currentEraseCanvasItem = this.getCanvasElementToMode(this.eraseMode);

        this.currentEraseCanvasItem?.touchStart(p);

        this.onEraseStart.emit();
    }
  }

  public async moveErase(from: Point, to: Point) {
    if (!this.isOnActiveMouse && this.currentEraseCanvasItem) {
      this.currentEraseCanvasItem.touchMove(from, to);

      this.onEraseMove.emit();
    }
  }

  public async endErase(p: Point) {
    if (!this.isOnActiveMouse && this.currentEraseCanvasItem) {
      this.currentEraseCanvasItem.touchEnd(p);

      this.onEraseEnd.emit();
      //this.isOnActiveTouch = false;
      this.markChange();
    }
  }

  public markChange(): void {
    this.onInput.emit();
    this.onWhiteboardViewChange.emit();
  }
  //#endregion

  //#region methods for adding and removing elements to the board
  public createElement(tag: string): SVGElement {
    return this.addElement(document.createElementNS(svgns, tag));
  }
  
  public addElement(element: SVGElement): SVGElement {
    this.canvas?.gElement?.appendChild(element);

    this.onAddElement.emit();

    return element;
  }

  public addFile(file: File | null | undefined): boolean {
    // Füge eine Datei zum Whiteboard hinzu
    try {
      if (file) {
        if (file.type == 'application/pdf') {
          let pages = new Map<number, [HTMLCanvasElement, string]>();

          
          // function that adds the pdf-pages to the whiteboard
          let render = () => {
            for (let i = 1; i < pages.size + 1; i++) {
              let p = pages.get(i);
              if (p) {
                // add the image to the page
                this.addPage();
                let img = this.createElement('image');
                img.setAttributeNS(null, 'href', p[1]);
                img.setAttributeNS(null, 'transform', `translate(0 ${p[0].height}) rotate(180) scale(-1 1)`);

                this.markChange();
              }
            }
          }

          let fileReader = new FileReader();
          fileReader.readAsArrayBuffer(file);
          //fileReader.readAsDataURL(file);
          fileReader.onload = (ev) => {
            
            
            if (fileReader.result) {

              //var typedarray = new Uint8Array(fileReader.result as ArrayBuffer);

              GlobalWorkerOptions.workerSrc = require('pdfjs-dist/build/pdf.worker.entry');

              getDocument(fileReader.result as string).promise.then((pdf: any) => {
                //
                // Fetch the first page
                //
                let size: number = pdf.numPages;

                for (let i = 1; i < size + 1; i++) {
                  pdf.getPage(i).then((page: any) => {

                    var scale = 1;
                    var viewport = page.getViewport(scale);

                    let pageNumber: number = page.pageNumber;
                    
                    //
                    // Prepare canvas using PDF page dimensions
                    //
                    let canvas = document.createElement('canvas');
                    //document.body.appendChild(canvas);
                    var context = canvas.getContext('2d');
                    canvas.width = page.view[2];
                    canvas.height = page.view[3];

                    //
                    // Render PDF page into canvas context
                    //
                    var renderContext = {
                      canvasContext: context,
                      viewport: viewport};
 
                    page.render(renderContext).promise.then(() => {
                      let res = canvas.toDataURL('image/png');
                      pages.set(pageNumber, [canvas, res])
                      if (size == pages.size) render();
                      
                    })});
                }
                //console.log(pdf.numPages);
                //console.log(pdf)

            }, (error: any) => {
              console.log(error);
            });
              }
          };

        }
        else if (file.type.startsWith('image')) {
          var reader = new FileReader();
          reader.readAsDataURL(file);
          
          // helper to get dimensions of an image
          const imageDimensions = (file: any) => 
              new Promise((resolve, reject) => {
                  const img = new Image()
          
                  // the following handler will fire after the successful loading of the image
                  img.onload = () => {
                      const { naturalWidth: width, naturalHeight: height } = img
                      resolve({ width, height })
                  }
              
                  img.src = URL.createObjectURL(file)
          })

          reader.onload = async () => {
            // add the image to the board
            let dim: any = await imageDimensions(file);
            let img = this.createElement('image');
            if (reader.result) img.setAttributeNS(null, 'href', reader.result.toString());
            img.setAttributeNS(null, 'width', dim.width);
            img.setAttributeNS(null, 'height', dim.height);

            // center the image
            let rectG = this.getActualRect(img.getBoundingClientRect());
            let centerG: Point = {
              x: rectG.x + rectG.width / 2,
              y: rectG.y + rectG.height / 2
            }
            let centerSVG: Point = this.getScreenCenterSVG();
            img.setAttributeNS(null, 'transform', `translate(${centerSVG.x - centerG.x} ${centerSVG.y - centerG.y})`);
            
            this.markChange();
          };
        }

        return true;
      }
    }
    catch { }
    return false;
  }

  public addStickyNote(text: string, color: Color, textColor: Color) {
    // helper-function for the text-wrapper
    let splitStringAll = (text: string, length: number): string[] => {
      let texts = [];
      while (text.length >= length) {
        let word = text.substring(0, length);
        texts.push(word);
        text = text.substring(length);
      }
      if (text != '') texts.push(text);
      return texts;
    }

    // helper-function for the text-wrapper
    let yieldMe = (arr: string[][]): string[] => {
      let strs = [];
      for (let sarr of arr) {
        for (let s of sarr) {
          strs.push(s);
        }
      }
      return strs;
    }

    // this function wraps text
    let createSVGtext = (text: string): [SVGTextElement, number, number] => {
        //  This function attempts to create a new svg "text" element, chopping 
        //  it up into "tspan" pieces, if the caption is too long
        //
        let svgText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        // svgText.setAttributeNS(null, 'text-anchor', 'middle');   //  Center the text

        let y = 0;
        let x = 0;
    
        //  The following two variables should really be passed as parameters
        let charsperlineproposal = Math.floor(Math.sqrt(text.length * 2));
        const MAXIMUM_CHARS_PER_LINE = charsperlineproposal < 20 ? 20 : charsperlineproposal;
        const LINE_HEIGHT = 30;
    
        let words = yieldMe(text.split(" ").map(s => splitStringAll(s, MAXIMUM_CHARS_PER_LINE - 1)));
        let line = "";
    
        for (let n = 0; n < words.length; n++) {
            let testLine = line + words[n] + " ";
            if (testLine.length > MAXIMUM_CHARS_PER_LINE)
            {
                //  Add a new <tspan> element
                let svgTSpan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
                svgTSpan.setAttributeNS(null, 'y', y.toString());
                svgTSpan.setAttributeNS(null, 'x', x.toString());
    
                let tSpanTextNode = document.createTextNode(line);
                svgTSpan.appendChild(tSpanTextNode);
                svgText.appendChild(svgTSpan);
    
                line = words[n] + " ";
                y += LINE_HEIGHT;
            }
            else {
                line = testLine;
            }
        }
    
        let svgTSpan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        svgTSpan.setAttributeNS(null, 'x', x.toString());
        svgTSpan.setAttributeNS(null, 'y', y.toString());
    
        let tSpanTextNode = document.createTextNode(line);
        svgTSpan.appendChild(tSpanTextNode);
    
        svgText.appendChild(svgTSpan);
    
        return [ svgText, y + (line != '' ? LINE_HEIGHT : 0), LINE_HEIGHT ];
    }

    let g = this.createElement('g');
    let t = createSVGtext(text);
    let textSVG = t[0];
    let rect = document.createElementNS(svgns, 'rect');

    g.appendChild(rect);
    g.appendChild(textSVG);

    textSVG.setAttributeNS(null, 'fill', textColor.toString());
    textSVG.setAttributeNS(null, 'font-size', '15pt');
    textSVG.setAttributeNS(null, 'font-family', 'sans-serif');

    let rectText = this.getActualRect(g.getBoundingClientRect());
    rectText.height = t[1];

    const padding = 12;
    const offset = rectText.height - t[2] + 7;
    const borderRadius = 7;

    rect.setAttributeNS(null, 'x', (-padding).toString());
    rect.setAttributeNS(null, 'y', (-1 * rectText.height - padding + offset).toString());
    rect.setAttributeNS(null, 'width', (rectText.width + 2 * padding).toString());
    rect.setAttributeNS(null, 'height', (rectText.height +  2 * padding).toString());
    rect.setAttributeNS(null, 'fill', color.toString());
    rect.setAttributeNS(null, 'rx', borderRadius.toString());
    rect.setAttributeNS(null, 'ry', borderRadius.toString());

    // center the sticky note in the middle of the screen
    let rectG = this.getActualRect(g.getBoundingClientRect());
    let centerG: Point = {
      x: rectG.x + rectG.width / 2,
      y: rectG.y + rectG.height / 2
    }
    let centerSVG: Point = this.getScreenCenterSVG();
    g.setAttributeNS(null, 'transform', `translate(${centerSVG.x - centerG.x} ${centerSVG.y - centerG.y})`);

    this.markChange();
  }

  public getScreenCenterSVG(): Point {
    // this method returns the center of the visible part of the page
    if (this.canvas && this.canvas.svgElement && this.canvas.svgWrapperElement) {
      let rect: Rect;

      if (this.format) {
        rect = this.getActualRect(getIntersectionRects(this.canvas.svgElement.getBoundingClientRect(), this.canvas.svgWrapperElement.getBoundingClientRect()));
      }
      else {
        rect = this.getActualRect(this.canvas.svgElement.getBoundingClientRect());
      }

      return {
        x: rect.x + rect.width / 2,
        y: rect.y + rect.height / 2
      };
    }

    return defaultPoint;
  }

  public removeElement(el: SVGElement): boolean {
    if (this.canvas && this.canvas.gElement && this.canvas.gElement.contains(el)) {
      this.canvas.gElement.removeChild(el);

      this.onRemoveElement.emit();
      this.onWhiteboardViewChange.emit();

      return true;
    }
    return false;
  }
  //#endregion

  //#region methods for handling with files
  public downloadWhiteboard() {
    this.doDownload('whiteboard.json', JSON.stringify(this.export()));
  }

  public async downloadSVG(): Promise<void> {
    this.doDownload('whiteboard.svg', (await this.currentPage.getSVG())[0], 'svg');
  }

  public async downloadPNG(): Promise<void> {
    this.doDownload('whiteboard.png', await this.currentPage.getPageAsPicture(), 'png', true)
  }

  public async downloadPDF() {
    if (this.canvas && this.canvas.svgElement) {


      //let c = 0;
      let rects = this.pages.map(p => { 
        let rectP = p.getSizeRect();
        return { 
          x: 0,
          y: 0,
          width: rectP.width,
          height: rectP.height
        }
      })

      let boundingRect = getBoundingRect(rects);

      let doc = new jsPDF(boundingRect.width > boundingRect.height ? 'l' : 'p', 'mm', [ boundingRect.width, boundingRect.height]);
      
      for (let page of this.pages) {
        let img = await page.getPageAsPicture();
        let rect = await getImageDimensions(img);
        //doc.setPage(c++ + 1);
        doc.addPage([ rect.width, rect.height], rect.width > rect.height ? 'l' : 'p');
        doc.addImage(img, 'PNG', 0, 0, rect.width, rect.height);

        
      }

      /*let rect = getBoundingRect(this.pages.map(p => p.getSizeRect()));
      for (let pageIndex = 0; pageIndex < this.pages.length; pageIndex++) {
        let img = await this.pages[pageIndex].getPageAsPicture();
        let width = doc.internal.pageSize.getWidth();
        let height = doc.internal.pageSize.getHeight();
        doc.addImage(img, 'PNG', 0, 0, width, height);
        if (pageIndex != this.pages.length - 1) {
          doc.addPage();
        }
      }*/

      doc.deletePage(1);
      doc.save('whiteboard')
    }
  }
  
  private doDownload(filename: string, text: string, type?: string, alreadyDataUrl = false) {
    var element = document.createElement('a');
    element.setAttribute('href', alreadyDataUrl ? text : `data:${type ?? 'text'}/plain;charset=utf-8,` + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
  }

  public import(whiteboard: WhiteboardExport): boolean {
    // Lade das Whiteboard aus einer Datei
    try {
      this.backgroundImage = whiteboard.backgroundImage;
      this.backgroundScale = whiteboard.backgroundScale ?? 1;
      this.format = whiteboard.format;
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
      this.pages[pageIndex].open();
      this._currentPageIndex = pageIndex;

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
      backgroundScale: this.backgroundScale,
      backgroundColor: this.backgroundColor.export(),
      format: this.format,
      pageIndex: this.currentPageIndex,
      pages: pages
    };
  }
  //#endregion

  //#region dealing with pages
  public goBack() {
    this.currentPage.goBack();
    this.onBack.emit();
    this.onWhiteboardViewChange.emit();
  }

  public canGoBack() {
    return this.currentPage.canGoBack();
  }

  public goForward() {
    this.currentPage.goForward();
    this.onForward.emit();
    this.onWhiteboardViewChange.emit();
  }

  public canGoForward() {
    return this.currentPage.canGoForward();
  }

  public clear() {
    this.currentPage.clear();
    if (this.selector) this.selector.svgEl = undefined;
    this.onWhiteboardViewChange.emit();
  }

  public addPage() {
    this.pages.push(new Page(this));
    this.currentPageIndex = this.pages.length - 1;
    this.currentPage.resetZoomAndTranslate();
  }
  //#endregion
  
}