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

  private _svgElements: SVGElementWrapperCollection = new SVGElementWrapperCollection(() => { return this.board });
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
          this.svgElements.scaleBy(1, factor, rect);
        }
      }
      else if (dir == Resize.Top) {
        let factor =  (rect.y + rect.height - p.y) / (rect.height);
        if (factor > 0) {
          this.svgElements.scaleBy(1, factor, {
            x: rect.x,
            y: rect.y + rect.height
          });
        }
      }
      else if (dir == Resize.Left) {
        let factor =  (rect.x + rect.width - p.x) / (rect.width);
        if (factor > 0) {
          this.svgElements.scaleBy(factor, 1, {
            x: rect.x + rect.width,
            y: rect.y
          });
        }
      }
      else if (dir == Resize.Right) {
        let factor =  (p.x - rect.x) / (rect.width);
        if (factor > 0) {
          this.svgElements.scaleBy(factor, 1, rect);
        }
      }
    }
  }

  private zoom(factor: number, p: Point): void {
    // do the transformation
    this.svgElements.scaleBy(factor, factor, p);
  }

  private center?: Point;
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
      if (!this.center) this.center = getSVGElCenter();

      let anglePrev = getAngle(prev, this.center);
      let angleCurr = getAngle(curr, this.center);
      let angleDiff = (angleCurr - anglePrev);

      this.svgElements.rotateBy(angleDiff, (this.center));
    }
  }

  private turnByAngleAndPoint(angle: number, p: Point): void {
    // do the transformation
    this.svgElements.rotateBy(angle, p);
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

    this.startTouchControllers();

    this.board.onFormatChanged.addListener(() => {
      this.startTouchControllers();
    })

  }


  private wrapperTouchController?: TouchController;
  private turnTouchController?: TouchController;
  private tlTouchController?: TouchController;
  private trTouchController?: TouchController;
  private blTouchController?: TouchController;
  private brTouchController?: TouchController;

  startTouchControllers(): void {
    // capture the events and start the touchControllers

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

    // the wrapper
    if (this.wrapperTouchController) this.wrapperTouchController.stop();

    this.wrapperTouchController = this.getTouchController(getTouchControllerEventsAllSame((p: Point) => {
      start();
    }, (prev: Point, curr: Point) => {
      curr = this.board.getActualPoint(curr);
      prev = this.board.getActualPoint(prev);
      this.svgElements.moveBy(curr.x - prev.x, curr.y - prev.y);
      move();
    }, (p: Point) => {
      end();
    }, (factor: number, p: Point) => {
      // Logik für zoomen
      p = this.board.getActualPoint(p);
      this.zoom(factor, p);
    }, (angle: number, p: Point) => {
      // Logik für drehen
      p = this.board.getActualPoint(p);
      this.turnByAngleAndPoint(angle, p);
    }, () => {
      this.board.onInput.emit();
    }), this.wrapperEl as HTMLDivElement);


    // the turn control
    if (this.turnTouchController) this.turnTouchController.stop();

    this.turnTouchController = this.getTouchController(getTouchControllerEventsAllSame((p: Point) => {
      start();
      return;
    }, (prev: Point, curr: Point) => {
      prev = this.board.getActualPoint(prev);
      curr = this.board.getActualPoint(curr);
      this.turnByPoints(prev, curr);
      move();
    }, (p: Point) => {
      end();
      this.center = undefined;
      return;
    }), this.turnEl as HTMLDivElement)
    

    // the top left control
    if (this.tlTouchController) this.tlTouchController.stop();

    this.tlTouchController = this.getTouchController(getTouchControllerEventsAllSame((p: Point) => {
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
    }), this.ltrEl as HTMLDivElement);


    // the bottom left control
    if (this.blTouchController) this.blTouchController.stop();

    this.blTouchController = this.getTouchController(getTouchControllerEventsAllSame((p: Point) => {
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
    }), this.lbrEl as HTMLDivElement);


    // the top right control
    if (this.trTouchController) this.trTouchController.stop();

    this.trTouchController = this.getTouchController(getTouchControllerEventsAllSame((p: Point) => {
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
    }), this.rtrEl as HTMLDivElement);


    // the bottom right control
    if (this.brTouchController) this.brTouchController.stop();

    this.brTouchController = this.getTouchController(getTouchControllerEventsAllSame((p: Point) => {
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
    }), this.rbrEl as HTMLDivElement);
  }

  private getTouchController(events: TouchControllerEvents, el: HTMLDivElement): TouchController {
    if (this.board.format) {
      return new TouchController(events, el, this.board.canvas?.svgWrapperElement, document);
    }
    else {
      return new TouchController(events, el, this.board.canvas?.svgElement, document);
    }
  }

}
