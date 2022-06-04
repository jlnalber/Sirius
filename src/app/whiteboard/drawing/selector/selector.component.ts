import { TouchController } from './../../global-whiteboard/essentials/touchController';
import { SVGElementWrapper, SVGElementWrapperCollection } from './SVGElementWrapper';
import { Component, Input, AfterViewInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { fromEvent, pairwise, switchMap, takeUntil } from 'rxjs';
import { Board } from '../../global-whiteboard/board/board';
import { Point } from '../../global-whiteboard/interfaces/point';
import { Rect } from '../../global-whiteboard/interfaces/rect';
import { getTouchControllerEventsAllSame } from '../../global-whiteboard/essentials/utils';

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

  private turnByPoints(prev: Point, curr: Point): void {

    // function, that calculates the angle of a vector between two points --> with respecting the flip at pi
    let getAngleByTwoPoints = (p1: Point, p2: Point): number => {
      let deltaY = p1.y - p2.y;
      let deltaX = p1.x - p2.x;
      let firstAngle = Math.atan(deltaY / deltaX); // first angle, that is only calculated by atan (no flip yet)
      let finalAngle = firstAngle + (deltaX < 0 ? Math.PI : 0); // now with flip

      return finalAngle;
    }

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

      let anglePrev = getAngleByTwoPoints(prev, center);
      let angleCurr = getAngleByTwoPoints(curr, center);

      let angleDiff = (angleCurr - anglePrev) /** Math.sign(this.scaleX * this.scaleY)*/;
      let angleDeg = angleDiff * 180 / Math.PI;

      this.svgElements.rotateBy(angleDeg);

      // secondly, move the svgEl so that it remains in its original position
      let newCenter = getSVGElCenter();
      this.svgElements.translateXBy(center.x - newCenter.x);
      this.svgElements.translateYBy(center.y - newCenter.y);
    }
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
    let startWrapper = (p: Point) => {};
    let moveWrapper = (prev: Point, curr: Point) => {
      curr = this.board.getActualPoint(curr);
      prev = this.board.getActualPoint(prev);
      this.svgElements.translateXBy(curr.x - prev.x);
      this.svgElements.translateYBy(curr.y - prev.y);
    }
    let endWrapper = (p: Point) => {};

    new TouchController(getTouchControllerEventsAllSame(startWrapper, moveWrapper, endWrapper), this.wrapperEl as HTMLDivElement, this.board.canvas?.svgElement, document); 

    /*this.captureEvent(this.wrapperEl as HTMLDivElement, (p: Point) => {
    }, (orig: Point, prev: Point, curr: Point) => {
      this.svgElements.translateXBy(curr.x - prev.x);
      this.svgElements.translateYBy(curr.y - prev.y);
    }, (orig: Point, p: Point) => {
    });*/

    this.captureEvent(this.turnEl as HTMLDivElement, (p: Point) => {
      return;
    }, (orig: Point, prev: Point, curr: Point) => {
      this.turnByPoints(prev, curr);
    }, (orig: Point, p: Point) => {
      return;
    })

    this.captureEvent(this.ltrEl as HTMLDivElement, (p: Point) => {
      this.resize(Resize.Left, p);
      this.resize(Resize.Top, p);
    }, (orig: Point, prev: Point, curr: Point) => {
      this.resize(Resize.Left, curr);
      this.resize(Resize.Top, curr);
    }, (orig: Point, p: Point) => {
      this.resize(Resize.Left, p);
      this.resize(Resize.Top, p);
    })

    this.captureEvent(this.lbrEl as HTMLDivElement, (p: Point) => {
      this.resize(Resize.Left, p);
      this.resize(Resize.Bottom, p);
    }, (orig: Point, prev: Point, curr: Point) => {
      this.resize(Resize.Left, curr);
      this.resize(Resize.Bottom, curr);
    }, (orig: Point, p: Point) => {
      this.resize(Resize.Left, p);
      this.resize(Resize.Bottom, p);
    })

    this.captureEvent(this.rtrEl as HTMLDivElement, (p: Point) => {
      this.resize(Resize.Right, p);
      this.resize(Resize.Top, p);
    }, (orig: Point, prev: Point, curr: Point) => {
      this.resize(Resize.Right, curr);
      this.resize(Resize.Top, curr);
    }, (orig: Point, p: Point) => {
      this.resize(Resize.Right, p);
      this.resize(Resize.Top, p);
    })

    this.captureEvent(this.rbrEl as HTMLDivElement, (p: Point) => {
      this.resize(Resize.Right, p);
      this.resize(Resize.Bottom, p);
    }, (orig: Point, prev: Point, curr: Point) => {
      this.resize(Resize.Right, curr);
      this.resize(Resize.Bottom, curr);
    }, (orig: Point, p: Point) => {
      this.resize(Resize.Right, p);
      this.resize(Resize.Bottom, p);
    })
  }

  captureEvent(el: HTMLElement, start: (p: Point) => void, move: (orig: Point, prev: Point, curr: Point) => void, end: (orig: Point, p: Point) => void) {
    let origPos: Point = {
      x: 0,
      y: 0
    }
    let activeTouch: boolean = false;

    let getPosFromMouseEvent = (e: MouseEvent): Point => {
      const rect = this.board.canvas?.svgElement?.getBoundingClientRect() as DOMRect;

      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }

    let getPosFromTouchEvent = (e: any): Point => {
      let res1: any = e.changedTouches[0];

      const rect = this.board.canvas?.svgElement?.getBoundingClientRect() as DOMRect;
      
      return {
        x: res1.clientX - rect.left,
        y: res1.clientY - rect.top
      };
    }

    let endMouse = (e: MouseEvent) => {
      if (activeTouch) {
        activeTouch = false;
        end(origPos, this.board.getActualPoint(getPosFromMouseEvent(e)));

        this.board.onMouseEnd.emit();
        this.board.onInput.emit();
      }
    };

    let endTouch = (e: any) => {
      if (activeTouch) {
        activeTouch = false;
        end(origPos, this.board.getActualPoint(getPosFromTouchEvent(e)));

        this.board.onMouseEnd.emit();
        this.board.onInput.emit();
      }
    }

    document.addEventListener('mouseup', endMouse);
    document.addEventListener('mouseleave', endMouse);
    document.addEventListener('touchcancel', endTouch);
    document.addEventListener('touchend', endTouch);

    // this will capture all mousedown events from the canvas element
    fromEvent(el, 'mousedown')
      .pipe(
        switchMap((e: any) => {
          let m = e as MouseEvent;
          m.preventDefault();
          let origPos = this.board.getActualPoint(getPosFromMouseEvent(m));
          if (!activeTouch) {
            this.board.onMouse.emit();
            start(origPos);
            activeTouch = true;
            this.board.onMouseStart.emit();
          }

          // after a mouse down, we'll record all mouse moves
          return fromEvent(document, 'mousemove')
            .pipe(
              // we'll stop (and unsubscribe) once the user releases the mouse
              // this will trigger a 'mouseup' event    
              takeUntil(fromEvent(document, 'mouseup')),
              // we'll also stop (and unsubscribe) once the mouse leaves the canvas (mouseleave event)
              takeUntil(fromEvent(document, 'mouseleave')),
              // pairwise lets us get the previous value to draw a line from
              // the previous point to the current point    
              pairwise()
            )
        })
      )
      .subscribe(async (res: any) => {
        if (activeTouch) {
          res[0].preventDefault();
          res[1].preventDefault();
          
          const rect = this.board.canvas?.svgElement?.getBoundingClientRect() as DOMRect;
    
          // previous and current position with the offset
          const prevPos = {
            x: res[0].clientX - rect.left,
            y: res[0].clientY - rect.top
          };
    
          const currentPos = {
            x: res[1].clientX - rect.left,
            y: res[1].clientY - rect.top
          };
    
          await move(origPos, this.board.getActualPoint(prevPos), this.board.getActualPoint(currentPos));

          this.board.onMouseMove.emit();
        }
      });

    // this will capture all touchdown events from the canvas element
    fromEvent(el, 'touchstart')
      .pipe(
        switchMap((e: any) => {
          e.preventDefault();
          let origPos = this.board.getActualPoint(getPosFromTouchEvent(e));
          if (!activeTouch) {
            this.board.onMouse.emit();
            start(origPos);
            activeTouch = true;
            this.board.onMouseStart.emit();
          }

          // after a touch start, we'll record all touch moves
          return fromEvent(document, 'touchmove')
            .pipe(
              // we'll stop (and unsubscribe) once the user releases the touch
              // this will trigger a 'touchend' event    
              takeUntil(fromEvent(document, 'touchend')),
              // we'll also stop (and unsubscribe) once the touch is cancelled (touchcancel event)
              takeUntil(fromEvent(document, 'touchcancel')),
              // pairwise lets us get the previous value to draw a line from
              // the previous point to the current point 
              pairwise()
            )
        })
      )
      .subscribe(async (res: any) => {
        if (activeTouch) {
          res[0].preventDefault();
          res[1].preventDefault();
          let res1: any = res[0].changedTouches[0];
          let res2: any = res[1].changedTouches[0];
          
          const rect = this.board.canvas?.svgElement?.getBoundingClientRect() as DOMRect;
    
          // previous and current position with the offset
          const prevPos = {
            x: res1.clientX - rect.left,
            y: res1.clientY - rect.top
          };
    
          const currentPos = {
            x: res2.clientX - rect.left,
            y: res2.clientY - rect.top
          };
    
          await move(origPos, this.board.getActualPoint(prevPos), this.board.getActualPoint(currentPos));

          this.board.onMouseMove.emit();
        }
      });
  }

}
