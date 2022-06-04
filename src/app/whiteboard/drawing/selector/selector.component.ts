import { TouchController, TouchControllerEvents } from './../../global-whiteboard/essentials/touchController';
import { SVGElementWrapper, SVGElementWrapperCollection } from './SVGElementWrapper';
import { Component, Input, AfterViewInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { fromEvent, pairwise, switchMap, takeUntil } from 'rxjs';
import { Board } from '../../global-whiteboard/board/board';
import { Point } from '../../global-whiteboard/interfaces/point';
import { Rect } from '../../global-whiteboard/interfaces/rect';
import { getAngle, getTouchControllerEventsAllSame } from '../../global-whiteboard/essentials/utils';

enum Resize {
  Top,
  Bottom,
  Left,
  Right
}

const offset = 5;

@Component({
  selector: 'whiteboard-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss']
})
export class SelectorComponent implements AfterViewInit {

  @Input() board!: Board;

  @ViewChild('ltr')
  public ltr!: ElementRef;
  public ltrEl: HTMLDivElement | undefined;
  @ViewChild('lbr')
  public lbr!: ElementRef;
  public lbrEl: HTMLDivElement | undefined;
  @ViewChild('rtr')
  public rtr!: ElementRef;
  public rtrEl: HTMLDivElement | undefined;
  @ViewChild('rbr')
  public rbr!: ElementRef;
  public rbrEl: HTMLDivElement | undefined;
  @ViewChild('turn')
  public turn!: ElementRef;
  public turnEl: HTMLDivElement | undefined;
  @ViewChild('wrapper')
  public wrapper!: ElementRef;
  public wrapperEl: HTMLDivElement | undefined;
  @ViewChild('outerWrapper')
  public outerWrapper!: ElementRef;
  public outerWrapperEl: HTMLDivElement | undefined;

  private _svgElements: SVGElementWrapperCollection = new SVGElementWrapperCollection();
  public set svgEl(value: SVGElement | SVGElement[] | undefined) {
    this._svgElements.svgElementWrapper = value;
  }
  public get svgElements(): SVGElementWrapperCollection {
    return this._svgElements;
  }

  public getCenter(): Point {
    let rect = this.rect;
    return {
      x: rect.x + rect.width / 2,
      y: rect.y + rect.height / 2
    };
  }

  private getRectRealPosInCanvas(rect: Rect): Rect {
    return this.board.getRectFromBoundingClientRect(rect);
  }
  
  public getSVGElPos(): Rect {
    // difference to rect: rect returns the position without translate or zoom on the whiteboard, this method returns the (exact) rect position in the svg with the whiteboard zoom and translate etc. 
    return this.getRectRealPosInCanvas(this.svgElements.getBoundingClientRect());
  }

  public get rect(): Rect {
    if (!this.svgElements.empty) {
      let rect = this.board.getRectRealPosInCanvas(this.svgElements.getBoundingClientRect());
      rect.x -= offset;
      rect.y -= offset;
      rect.width += offset;
      rect.height += offset;
      return rect;
    }
    else {
      return {
        x: 0,
        y: 0,
        width: 0, 
        height: 0
      }
    }
  }
  
  public getStyle(): string {
    let rect = this.rect;
    return `left: ${rect.x}px; top: ${rect.y}px; width: ${rect.width}px; height: ${rect.height}px`;
  }

  public getTranslateTaskBar(): string {
    let rect = this.rect;
    return 'transform: translate(15px, ' + (rect.height - 10) + 'px);';
  }

  private resize(dir: Resize, p: Point): void {
    // kann das Element größer/kleiner machen, basierend auf einer Richtung und einem Punkt (wohin)
    if (!this.svgElements.empty) {

      let rect = this.getSVGElPos();

      if (dir == Resize.Bottom) {
        let factor =  (p.y - rect.y) / (rect.height);
        if (factor > 0) {
          this.svgElements.scaleYBy(factor);
          let newRect = this.getSVGElPos();
          this.svgElements.translateYBy(rect.y - newRect.y);
        }
      }
      else if (dir == Resize.Top) {
        let factor =  (rect.y + rect.height - p.y) / (rect.height);
        if (factor > 0) {
          this.svgElements.scaleYBy(factor);
          let newRect = this.getSVGElPos();
          this.svgElements.translateYBy((rect.y + rect.height) - (newRect.y + newRect.height));
        }
      }
      else if (dir == Resize.Left) {
        let factor =  (rect.x + rect.width - p.x) / (rect.width);
        if (factor > 0) {
          this.svgElements.scaleXBy(factor);
          let newRect = this.getSVGElPos();
          this.svgElements.translateXBy((rect.x + rect.width) - (newRect.x + newRect.width));
        }
      }
      else if (dir == Resize.Right) {
        let factor =  (p.x - rect.x) / (rect.width);
        if (factor > 0) {
          this.svgElements.scaleXBy(factor);
          let newRect = this.getSVGElPos();
          this.svgElements.translateXBy(rect.x - newRect.x);
        }
      }
    }
  }

  private zoom(factor: number, p: Point): void {
    // calculate where the point is (relative)
    let svgElRect = this.getSVGElPos();
    let percentX = (p.x - svgElRect.x) / svgElRect.width;
    let percentY = (p.y - svgElRect.y) / svgElRect.height;

    // do the transformation
    this.svgElements.scaleXBy(factor);
    this.svgElements.scaleYBy(factor);

    // calculate where the new point is
    let newSvgElRect = this.getSVGElPos();
    let newPAfterTransformation: Point = {
      x: newSvgElRect.x + newSvgElRect.width * percentX,
      y: newSvgElRect.y + newSvgElRect.height * percentY
    };

    // move the elements so that it fits again
    this.svgElements.translateXBy(p.x - newPAfterTransformation.x);
    this.svgElements.translateYBy(p.y - newPAfterTransformation.y);
  }

  private turnByPoints(prev: Point, curr: Point): void {

    // function that returns the center point of the svgEl
    let getSVGElCenter = (): Point => {
      if (!this.svgElements.empty) {
        let svgElRect = this.getSVGElPos();
        return {
          x: svgElRect.x + svgElRect.width / 2,
          y: svgElRect.y + svgElRect.height / 2
        };
      }
      return {
        x: 0,
        y: 0
      };
    }

    if (!this.svgElements.empty) {
      // firstly, rotate the svgEl
      let center = getSVGElCenter();

      let anglePrev = getAngle(prev, center);
      let angleCurr = getAngle(curr, center);

      let angleDiff = (angleCurr - anglePrev) /** Math.sign(this.scaleX * this.scaleY)*/;
      let angleDeg = angleDiff * 180 / Math.PI;

      this.svgElements.rotateBy(angleDeg);

      // secondly, move the svgEl so that it remains in its original position
      let newCenter = getSVGElCenter();
      this.svgElements.translateXBy(center.x - newCenter.x);
      this.svgElements.translateYBy(center.y - newCenter.y);
    }
  }

  private turnByAngleAndPoint(angle: number, p: Point): void {
    // calculate where the point is (relative)
    let svgElRect = this.getSVGElPos();
    let percentX = (p.x - svgElRect.x) / svgElRect.width;
    let percentY = (p.y - svgElRect.y) / svgElRect.height;

    // do the transformation
    this.svgElements.rotateBy(angle * 180 / Math.PI);

    // calculate where the new point is
    let newSvgElRect = this.getSVGElPos();
    let newPAfterTransformation: Point = {
      x: newSvgElRect.x + newSvgElRect.width * percentX,
      y: newSvgElRect.y + newSvgElRect.height * percentY
    };

    // move the elements so that it fits again
    this.svgElements.translateXBy(p.x - newPAfterTransformation.x);
    this.svgElements.translateYBy(p.y - newPAfterTransformation.y);
  }

  constructor() { }

  ngAfterViewInit(): void {
    this.board.selector = this;

    // reset the selector when there are changes to when pages are switched or the history is used
    let reset = () => {
      this.svgEl = undefined;
    }
    this.board.onPageSwitched.addListener(reset);
    this.board.onBack.addListener(reset);
    this.board.onForward.addListener(reset);

    // set the native elements
    this.ltrEl = this.ltr.nativeElement;
    this.lbrEl = this.lbr.nativeElement;
    this.rtrEl = this.rtr.nativeElement;
    this.rbrEl = this.rbr.nativeElement;
    this.turnEl = this.turn.nativeElement;
    this.wrapperEl = this.wrapper.nativeElement;
    this.outerWrapperEl = this.outerWrapper.nativeElement;

    // prevent context menu from opening
    this.outerWrapperEl?.addEventListener('contextmenu', (e: MouseEvent) => {
      e.preventDefault();
    })

    // capture the events

    let start = () => {
      this.board.onMouseStart.emit();
    }
    let move = () => {
      this.board.onMouseMove.emit();
    }
    let end = () => {
      this.board.onMouseEnd.emit();
      this.board.onInput.emit();
    }

    new TouchController(getTouchControllerEventsAllSame((p: Point) => {
      start();
    }, (prev: Point, curr: Point) => {
      curr = this.board.getActualPoint(curr);
      prev = this.board.getActualPoint(prev);
      this.svgElements.translateXBy(curr.x - prev.x);
      this.svgElements.translateYBy(curr.y - prev.y);
      move();
    }, (p: Point) => {
      end();
    }, (factor: number, p: Point) => {
      // Logik für zoomen
      p = this.board.getActualPoint(p);
      this.zoom(factor, p);
      this.board.onInput.emit();
    }, (angle: number, p: Point) => {
      // Logik für drehen
      p = this.board.getActualPoint(p);
      this.turnByAngleAndPoint(angle, p);
      this.board.onInput.emit();
    }), this.wrapperEl as HTMLDivElement, this.board.canvas?.svgElement, document);

    new TouchController(getTouchControllerEventsAllSame((p: Point) => {
      start();
      return;
    }, (prev: Point, curr: Point) => {
      prev = this.board.getActualPoint(prev);
      curr = this.board.getActualPoint(curr);
      this.turnByPoints(prev, curr);
      move();
    }, (p: Point) => {
      end();
      return;
    }), this.turnEl as HTMLDivElement, this.board.canvas?.svgElement, document)
    
    new TouchController(getTouchControllerEventsAllSame((p: Point) => {
      p = this.board.getActualPoint(p);
      this.resize(Resize.Left, p);
      this.resize(Resize.Top, p);
      start();
    }, (prev: Point, curr: Point) => {
      curr = this.board.getActualPoint(curr);
      this.resize(Resize.Left, curr);
      this.resize(Resize.Top, curr);
      move();
    }, (p: Point) => {
      p = this.board.getActualPoint(p);
      this.resize(Resize.Left, p);
      this.resize(Resize.Top, p);
      end();
    }), this.ltrEl as HTMLDivElement, this.board.canvas?.svgElement, document);

    new TouchController(getTouchControllerEventsAllSame((p: Point) => {
      p = this.board.getActualPoint(p);
      this.resize(Resize.Left, p);
      this.resize(Resize.Bottom, p);
      start();
    }, (prev: Point, curr: Point) => {
      curr = this.board.getActualPoint(curr);
      this.resize(Resize.Left, curr);
      this.resize(Resize.Bottom, curr);
      move();
    }, (p: Point) => {
      p = this.board.getActualPoint(p);
      this.resize(Resize.Left, p);
      this.resize(Resize.Bottom, p);
      end();
    }), this.lbrEl as HTMLDivElement, this.board.canvas?.svgElement, document);

    new TouchController(getTouchControllerEventsAllSame((p: Point) => {
      p = this.board.getActualPoint(p);
      this.resize(Resize.Right, p);
      this.resize(Resize.Top, p);
      start();
    }, (prev: Point, curr: Point) => {
      curr = this.board.getActualPoint(curr);
      this.resize(Resize.Right, curr);
      this.resize(Resize.Top, curr);
      move();
    }, (p: Point) => {
      p = this.board.getActualPoint(p);
      this.resize(Resize.Right, p);
      this.resize(Resize.Top, p);
      end();
    }), this.rtrEl as HTMLDivElement, this.board.canvas?.svgElement, document);

    new TouchController(getTouchControllerEventsAllSame((p: Point) => {
      p = this.board.getActualPoint(p);
      this.resize(Resize.Right, p);
      this.resize(Resize.Bottom, p);
      start();
    }, (prev: Point, curr: Point) => {
      curr = this.board.getActualPoint(curr);
      this.resize(Resize.Right, curr);
      this.resize(Resize.Bottom, curr);
      move();
    }, (p: Point) => {
      p = this.board.getActualPoint(p);
      this.resize(Resize.Right, p);
      this.resize(Resize.Bottom, p);
      end();
    }), this.rbrEl as HTMLDivElement, this.board.canvas?.svgElement, document);

  }

}
