import { Component, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { fromEvent, pairwise, switchMap, takeUntil } from 'rxjs';
import { Board } from '../../global-whiteboard/board/board';
import { Point } from '../../global-whiteboard/interfaces/point';
import { Rect } from '../../global-whiteboard/interfaces/rect';

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

  private _svgEl: SVGElement | undefined;
  public set svgEl(value: SVGElement | undefined) {
    this._svgEl = value;
    this.readTransform();
  }
  public get svgEl(): SVGElement | undefined {
    return this._svgEl;
  }

  public getCenter(): Point {
    let rect = this.rect;
    return {
      x: rect.x + rect.width / 2,
      y: rect.y + rect.height / 2
    };
  }

  //#region The transform properties
  private _translateX: number | undefined;
  public get translateX(): number | undefined {
    return this._translateX;
  }
  public set translateX(value: number | undefined) {
    this._translateX = !value || value == Infinity ? 0.00001 : value;
    this.reloadTransform();
  }

  private _translateY: number | undefined;
  public get translateY(): number | undefined {
    return this._translateY;
  }
  public set translateY(value: number | undefined) {
    this._translateY = !value || value == Infinity ? 0.00001 : value;
    this.reloadTransform();
  }

  private _scaleX: number | undefined;
  public get scaleX(): number | undefined {
    return this._scaleX;
  }
  public set scaleX(value: number | undefined) {
    this._scaleX = !value || value == Infinity ? 0 : value;
    this.reloadTransform();
  }

  private _scaleY: number | undefined;
  public get scaleY(): number | undefined {
    return this._scaleY;
  }
  public set scaleY(value: number | undefined) {
    this._scaleY = !value || value == Infinity ? 0 : value;
    this.reloadTransform();
  }

  private _rotate: number | undefined;
  public get rotate(): number | undefined {
    return this._rotate;
  }
  public set rotate(value: number | undefined) {
    this._rotate = !value || value == Infinity ? 0 : value;
    this.reloadTransform();
  }

  private reloadTransform(): void {
    if (this.svgEl) {
      let transform = '';
      if (this.translateX != undefined && this.translateY != undefined) {
        transform += `translate(${this.translateX} ${this.translateY})`;
      }
      if (this.scaleX != undefined && this.scaleY != undefined) {
        transform += ` scale(${this.scaleX} ${this.scaleY})`
      }
      if (this.rotate != undefined) {
        transform += ` rotate(${this.rotate})`;
      }
      this.svgEl.setAttributeNS(null, 'transform', transform);
    }
  }

  private readTransform(): void {
    // funktion, die die parameter einer Funktion zurückgibt
    let getFuncParams = (str: string, func: string): string[] | undefined => {
      let ind = str.indexOf(func + '(');
      if (ind != -1) {
        try {
          ind += func.length + 1;
          let indEnd = str.indexOf(')', ind);
          let substr = str.substring(ind, indEnd); // in 'substr' ist jetzt das innere von den Klammern
          return substr.split(/(?: |,)/); // Und hier wird an den ','/' ' getrennt
        } catch { }
      }
      return undefined;
    }

    if (this.svgEl) {
      let transform = this.svgEl.getAttributeNS(null, 'transform');

      if (transform != null) {
        let translate = getFuncParams(transform, 'translate');
        let scale = getFuncParams(transform, 'scale');
        let rotate = getFuncParams(transform, 'rotate');

        // set the translate properties
        if (translate) {
          if (translate.length == 1) {
            let num = Number.parseFloat(translate[0]);
            this._translateX = num;
            this._translateY = num;
          }
          else if (translate.length == 2) {
            this._translateX = Number.parseFloat(translate[0]);
            this._translateY = Number.parseFloat(translate[1]);
          }
        }
        else {
          this._translateX = 0;
          this._translateY = 0;
        }

        // set the scale properties
        if (scale) {
          if (scale.length == 1) {
            let num = Number.parseFloat(scale[0]);
            this._scaleX = num;
            this._scaleY = num;
          }
          else if (scale.length == 2) {
            this._scaleX = Number.parseFloat(scale[0]);
            this._scaleY = Number.parseFloat(scale[1]);
          }
        }
        else {
          this._scaleX = 1;
          this._scaleY = 1;
        }

        // set the rotate propertie
        if (rotate && rotate.length == 1) {
          this._rotate = Number.parseFloat(rotate[0]);
        }
        else {
          this._rotate = 0;
        }
      }
      else {
        this._translateX = 0;
        this._translateY = 0;
        this._scaleX = 1;
        this._scaleY = 1;
        this._rotate = 0;
      }
    }
  }
  //#endregion

  private getRectRealPos(rect: DOMRect): Rect {
    if (this.board.canvas && this.board.canvas.svgElement) {
      let svgRect = this.board.canvas.svgElement.getBoundingClientRect() as DOMRect;
      return {
        x: rect.left - svgRect.left,
        y: rect.top - svgRect.top,
        width: rect.width,
        height: rect.height
      };
    }
    return rect;
  }

  private getRectRealPosInCanvas(rect: DOMRect): Rect {
    return this.board.getActualRect(this.getRectRealPos(rect));
  }
  
  private getSVGElPos(): Rect {
    return this.getRectRealPosInCanvas((this.svgEl as SVGElement).getBoundingClientRect());
  }

  public get rect(): Rect {
    if (this.svgEl != undefined) {
      let rect = this.getRectRealPos(this.svgEl.getBoundingClientRect());
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

  private resize(dir: Resize, p: Point): void {
    // kann das Element größer/kleiner machen, basierend auf einer Richtung und einem Punkt (wohin)
    if (this.svgEl) {

      let rect = this.getSVGElPos();

      if (dir == Resize.Bottom && this.scaleY != undefined && this.translateY != undefined) {
        let factor =  (p.y - rect.y) / (rect.height);
        if (factor > 0) {
          this.scaleY *= factor;
          let newRect = this.getSVGElPos();
          this.translateY -= newRect.y - rect.y;
        }
      }
      else if (dir == Resize.Top && this.scaleY != undefined && this.translateY != undefined) {
        let factor =  (rect.y + rect.height - p.y) / (rect.height);
        if (factor > 0) {
          this.scaleY *= factor;
          let newRect = this.getSVGElPos();
          this.translateY -= (newRect.y + newRect.height) - (rect.y + rect.height);
        }
      }
      else if (dir == Resize.Left && this.scaleX != undefined && this.translateX != undefined) {
        let factor =  (rect.x + rect.width - p.x) / (rect.width);
        if (factor > 0) {
          this.scaleX *= factor;
          let newRect = this.getSVGElPos();
          this.translateX -= (newRect.x + newRect.width) - (rect.x + rect.width);
        }
      }
      else if (dir == Resize.Right && this.scaleX != undefined && this.translateX != undefined) {
        let factor =  (p.x - rect.x) / (rect.width);
        if (factor > 0) {
          this.scaleX *= factor;
          let newRect = this.getSVGElPos();
          this.translateX -= newRect.x - rect.x;
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
      if (this.svgEl) {
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

    if (this.svgEl && this.rotate != undefined && this.scaleX != undefined && this.scaleY != undefined && this.translateX != undefined && this.translateY != undefined) {
      // firstly, rotate the svgEl
      let center = getSVGElCenter();

      let anglePrev = getAngleByTwoPoints(prev, center);
      let angleCurr = getAngleByTwoPoints(curr, center);

      let angleDiff = (angleCurr - anglePrev) * Math.sign(this.scaleX * this.scaleY);
      let angleDeg = angleDiff * 180 / Math.PI;

      this.rotate += angleDeg;

      // secondly, move the svgEl so that it remains in its original position
      let newCenter = getSVGElCenter();
      this.translateX += center.x - newCenter.x;
      this.translateY += center.y - newCenter.y;
    }
  }

  constructor() { }

  ngAfterViewInit(): void {
    this.board.selector = this;

    // set the native elements
    this.ltrEl = this.ltr.nativeElement;
    this.lbrEl = this.lbr.nativeElement;
    this.rtrEl = this.rtr.nativeElement;
    this.rbrEl = this.rbr.nativeElement;
    this.turnEl = this.turn.nativeElement;
    this.wrapperEl = this.wrapper.nativeElement;

    // capture the events
    this.captureEvent(this.wrapperEl as HTMLDivElement, (p: Point) => {
    }, (orig: Point, prev: Point, curr: Point) => {
      if (this.translateX != undefined && this.translateY != undefined) {
        this.translateX += curr.x - prev.x;
        this.translateY += curr.y - prev.y;
      }
    }, (orig: Point, p: Point) => {
    });

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
