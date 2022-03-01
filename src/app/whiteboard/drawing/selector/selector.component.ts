import { CanvasComponent } from 'src/app/whiteboard/drawing/canvas/canvas.component';
import { Board } from 'src/app/global/board/board';
import { Rect } from './../../../interfaces/rect';
import { Component, OnInit, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Point } from 'src/app/global/canvasElements/canvasElement';
import { fromEvent, fromEventPattern, pairwise, switchMap, takeUntil } from 'rxjs';

enum Resize {
  Top,
  Bottom,
  Left,
  Right
}

@Component({
  selector: 'app-selector',
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

  private reloadTransform(): void {
    if (this.svgEl) {
      let transform = '';
      if (this.translateX != undefined && this.translateY != undefined) {
        transform += `translate(${this.translateX} ${this.translateY})`;
      }
      if (this.scaleX != undefined && this.scaleY != undefined) {
        transform += ` scale(${this.scaleX} ${this.scaleY})`
      }
      this.svgEl.setAttributeNS(null, 'transform', transform);
    }
  }

  private readTransform(): void {
    let getFuncParams = (str: string, func: string): string | undefined => {
      let ind = str.indexOf(func + '(');
      if (ind != -1) {
        try {
          ind += func.length + 1;
          let indEnd = str.indexOf(')', ind);
          return str.substring(ind, indEnd);
        } catch { }
      }
      return undefined;
    }

    if (this.svgEl) {
      let transform = this.svgEl.getAttributeNS(null, 'transform');

      if (transform != null) {
        let translate = getFuncParams(transform, 'translate');
        let scale = getFuncParams(transform, 'scale');

        // set the translate properties
        if (translate) {
          let params = translate.split(' ');
          if (params.length == 1) {
            let num = Number.parseInt(params[0]);
            this._translateX = num;
            this._translateY = num;
          }
          else if (params.length == 2) {
            this._translateX = Number.parseInt(params[0]);
            this._translateY = Number.parseInt(params[1]);
          }
        }
        else {
          this._translateX = 0;
          this._translateY = 0;
        }

        // set the scale properties
        if (scale) {
          let params = scale.split(' ');
          if (params.length == 1) {
            let num = Number.parseInt(params[0]);
            this._scaleX = num;
            this._scaleY = num;
          }
          else if (params.length == 2) {
            this._scaleX = Number.parseInt(params[0]);
            this._scaleY = Number.parseInt(params[1]);
          }
        }
        else {
          this._scaleX = 1;
          this._scaleY = 1;
        }
      }
      else {
        this._translateX = 0;
        this._translateY = 0;
        this._scaleX = 1;
        this._scaleY = 1;
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

  public get rect(): Rect {
    if (this.svgEl != undefined) {
      return this.getRectRealPos(this.svgEl.getBoundingClientRect());
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
      let getSVGElPos: () => Rect = () => {
        return this.getRectRealPosInCanvas((this.svgEl as SVGElement).getBoundingClientRect());
      }

      let rect = getSVGElPos();

      if (dir == Resize.Bottom && this.scaleY != undefined && this.translateY != undefined) {
        let factor =  (p.y - rect.y) / (rect.height);
        if (factor > 0) {
          this.scaleY *= factor;
          let newRect = getSVGElPos();
          this.translateY -= newRect.y - rect.y;
        }
      }
      else if (dir == Resize.Top && this.scaleY != undefined && this.translateY != undefined) {
        let factor =  (rect.y + rect.height - p.y) / (rect.height);
        if (factor > 0) {
          this.scaleY *= factor;
          let newRect = getSVGElPos();
          this.translateY -= (newRect.y + newRect.height) - (rect.y + rect.height);
        }
      }
      else if (dir == Resize.Left && this.scaleX != undefined && this.translateX != undefined) {
        let factor =  (rect.x + rect.width - p.x) / (rect.width);
        if (factor > 0) {
          this.scaleX *= factor;
          let newRect = getSVGElPos();
          this.translateX -= (newRect.x + newRect.width) - (rect.x + rect.width);
        }
      }
      else if (dir == Resize.Right && this.scaleX != undefined && this.translateX != undefined) {
        let factor =  (p.x - rect.x) / (rect.width);
        if (factor > 0) {
          this.scaleX *= factor;
          let newRect = getSVGElPos();
          this.translateX -= newRect.x - rect.x;
        }
      }
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

    }, (orig: Point, prev: Point, curr: Point) => {
      
    }, (orig: Point, p: Point) => {

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

        this.board.onTouchEnd.emit();
      }
    };

    document.addEventListener('mouseup', endMouse);
    document.addEventListener('mouseleave', endMouse);

    // this will capture all mousedown events from the canvas element
    fromEvent(el, 'mousedown')
      .pipe(
        switchMap((e: any) => {
          let m = e as MouseEvent;
          m.preventDefault();
          let origPos = this.board.getActualPoint(getPosFromMouseEvent(m));
          if (!activeTouch) {
            this.board.onTouch.emit();
            start(origPos);
            activeTouch = true;
            this.board.onTouchStart.emit();
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

          this.board.onTouchMove.emit();
        }
      });
  }

}
