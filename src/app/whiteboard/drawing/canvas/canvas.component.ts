import { TouchController, TouchControllerEvents } from './../../global-whiteboard/essentials/touchController';
import { AfterViewInit, Component, ElementRef, HostListener, Input, ViewChild, OnInit } from '@angular/core';

import { fromEvent } from 'rxjs';
import { switchMap, takeUntil, pairwise } from 'rxjs';
import { Board } from '../../global-whiteboard/board/board';
import { Point, Vector } from '../../global-whiteboard/interfaces/point';
import { add, getImageDimensions, scale } from '../../global-whiteboard/essentials/utils';

@Component({
  selector: 'whiteboard-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements AfterViewInit {

  public initialized = false;

  private touchController?: TouchController;

  @HostListener('touchmove', ['$event'])
  onTouchMove(evt: any) {
    //In this case, the default behavior is scrolling the body, which
    //would result in an overflow.  Since we don't want that, we preventDefault.
    if(!evt._isScroller && evt.preventDefault) {
      evt.preventDefault()
    }
  }

  @Input() board!: Board;

  @ViewChild('svgWrapper')
  public svgWrapper!: ElementRef;

  @ViewChild('canvas')
  public canvas!: ElementRef;

  @ViewChild('g')
  public g!: ElementRef;

  @ViewChild('bgImgPattern')
  public bgImgPattern!: ElementRef;

  @ViewChild('bgImg')
  public bgImg!: ElementRef;

  @ViewChild('patternRect')
  public patternRect!: ElementRef;

  public svgWrapperElement: HTMLDivElement | undefined;
  public svgElement: SVGSVGElement | undefined;
  public gElement: SVGGElement | undefined;
  public bgImgPatternElement: SVGPatternElement | undefined;
  public bgImgElement: SVGImageElement | undefined;
  public patternRectElement: SVGRectElement | undefined;

  private _translateX: number = 0;
  private _translateY: number = 0;
  private _zoom: number = 1;

  public get translateX(): number {
    return this._translateX;
  }
  public set translateX(value: number) {
    this._translateX = value;
    this.justify();
  }
  public get translateY(): number {
    return this._translateY;
  }
  public set translateY(value: number) {
    this._translateY = value;
    this.justify();
  }
  public get zoom(): number {
    return this._zoom;
  }
  public set zoom(value: number) {
    this._zoom = value;
    this.board.onZoom.emit();
    this.justify();
  }

  public zoomTo(value: number, p?: Point): void {
    // zooms by the value to p
    if (this.svgElement) {
      if (this.board.format) {
        if (p == undefined) {
          // take the center to zoom in and out as default
          p = {
            x: this.board.format.width / 2 + this.translateX,
            y: this.board.format.height / 2 + this.translateY
          };
        }

        // first: get the center
        let center = {
          x: this.board.format.width / 2 + this.translateX,
          y: this.board.format.height / 2 + this.translateY
        }
        
        // then get the deposition by scaling and move it so that it fits
        let cToP = add(p, scale(center, -1));
        let cToPNewScale = scale(cToP, value / this.zoom);
        let translate: Vector = add(cToP, scale(cToPNewScale, -1));
        this._translateX += translate.x;
        this._translateY += translate.y;
      }
      else {
        if (p == undefined) {
          let midY = this.svgElement?.clientHeight / 2;
          let midX = this.svgElement?.clientWidth / 2;
          p = { x: midX, y: midY };
        }

        let vectY = -this._translateY + p.y;
        let vectX = -this._translateX + p.x;
        let finalMidY = vectY * value / this._zoom;
        let finalMidX = vectX * value / this._zoom;
        let finalY = vectY - finalMidY;
        let finalX = vectX - finalMidX;
        this._translateX += finalX;
        this._translateY += finalY;
      }
    }

    this.zoom = value;
  }

  constructor() {
    
  }

  ngAfterViewInit(): void {
    this.board.canvas = this;

    this.svgWrapperElement = this.svgWrapper.nativeElement as HTMLDivElement;
    this.svgElement = this.canvas.nativeElement as SVGSVGElement;
    this.gElement = this.g.nativeElement as SVGGElement;
    this.bgImgPatternElement = this.bgImgPattern.nativeElement as SVGPatternElement;
    this.bgImgElement = this.bgImg.nativeElement as SVGImageElement;
    this.patternRectElement = this.patternRect.nativeElement as SVGRectElement;
    //this.captureEvents();
    //this.capturePinchZoomEvents();

    setTimeout(() => {
      this.initialized = true;
    }, 0);

    this.startTouchController();

    this.justifyBgImg();

    this.board.onBackgroundChange.addListener(() => {
      this.justifyBgImg();
    })
    this.board.onFormatChanged.addListener(() => {
      this.startTouchController();
      this.justify();
    })
  }

  private startTouchController() {
    if (this.svgElement) {

      // stop the old controller
      if (this.touchController) this.touchController.stop();

      // the touchControllerEvents
      let touchControllerEvents: TouchControllerEvents = {
        touchStart: (p: Point) => this.board.startTouch(p),
        touchMove: (from: Point, to: Point) => this.board.moveTouch(from, to),
        touchEnd: (p: Point) => this.board.endTouch(p),
        mouseStart: (p: Point) => this.board.startMouse(p),
        mouseMove: (from: Point, to: Point) => this.board.moveMouse (from, to),
        mouseEnd: (p: Point) => this.board.endMouse(p),
        stylusStart: (p: Point) => this.board.startMouse(p),
        stylusMove: (from: Point, to: Point) => this.board.moveMouse(from, to),
        stylusEnd: (p: Point) => this.board.endMouse(p),
        stylusBarrelStart: (p: Point) => this.board.startBarrel(p),
        stylusBarrelMove: (from: Point, to: Point) => this.board.moveBarrel(from, to),
        stylusBarrelEnd: (p: Point) => this.board.endBarrel(p),
        stylusEraseStart: (p: Point) => this.board.startErase(p),
        stylusEraseMove: (from: Point, to: Point) => this.board.moveErase(from, to),
        stylusEraseEnd: (p: Point) => this.board.endErase(p),
        pinchZoom: (factor: number, point: Point) => this.board.zoomTo(this.board.zoom * factor, point)
      };

      // touch controller which keeps track of what happens to the board
      if (this.board.format) {
        this.touchController = new TouchController(touchControllerEvents, this.svgWrapperElement as HTMLDivElement, this.svgWrapperElement, document)
      }
      else {
        this.touchController = new TouchController(touchControllerEvents, this.svgElement)
      }

      // reset zoom and translate
      for (let page of this.board.pages) {
        page.resetZoomAndTranslate();
      }
    }

  }

  private justify() {
    let transform = `translate(${this.translateX} ${this.translateY}) scale(${this.zoom})`;

    // set the zoom and translate of the gElement
    if (this.board.format) {
      this.svgElement?.setAttribute('transform', transform);
      this.gElement?.setAttribute('transform', '');

      // reset the properties for the pattern (background)
      this.patternRectElement?.setAttributeNS(null, 'transform', '');
      this.patternRectElement?.setAttributeNS(null, 'x', '0');
      this.patternRectElement?.setAttributeNS(null, 'y', '0');
      this.patternRectElement?.setAttributeNS(null, 'width', '100%');
      this.patternRectElement?.setAttributeNS(null, 'height', '100%');
    }
    else {
      this.gElement?.setAttribute('transform', transform);
      this.svgElement?.setAttribute('transform', '');

      // set the properties for the pattern (background)
      this.patternRectElement?.setAttributeNS(null, 'transform', transform);
      this.patternRectElement?.setAttributeNS(null, 'x', (-this.translateX / this.zoom).toString());
      this.patternRectElement?.setAttributeNS(null, 'y', (-this.translateY / this.zoom).toString());
      let wh = `${100 / this.zoom}%`;
      this.patternRectElement?.setAttributeNS(null, 'width', wh);
      this.patternRectElement?.setAttributeNS(null, 'height', wh);
    }
  }

  private async justifyBgImg() {
      this.bgImgElement?.setAttributeNS(null, "href", this.board.backgroundImage);

      // set the width and height of the background image
      let rect = await getImageDimensions(this.board.backgroundImage);
      rect = {
        x: rect.x * this.board.backgroundScale,
        y: rect.y * this.board.backgroundScale,
        width: rect.width * this.board.backgroundScale,
        height: rect.height * this.board.backgroundScale
      };
      this.bgImgElement?.setAttributeNS(null, "width", rect.width.toString());
      this.bgImgElement?.setAttributeNS(null, "height", rect.height.toString());
      this.bgImgPatternElement?.setAttributeNS(null, "width", rect.width.toString());
      this.bgImgPatternElement?.setAttributeNS(null, "height", rect.height.toString());
  }

  public get svgWidth(): string {
    if (this.board.format) {
      return `${this.board.format.width}px`;
    }
    else {
      return '100%';
    }
  }

  public get svgHeight(): string {
    if (this.board.format) {
      return `${this.board.format.height}px`;
    }
    else {
      return '100%';
    }
  }

}