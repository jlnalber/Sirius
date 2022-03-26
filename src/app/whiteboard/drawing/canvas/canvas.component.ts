import { TouchController } from './../../global-whiteboard/essentials/touchController';
import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';

import { fromEvent } from 'rxjs';
import { switchMap, takeUntil, pairwise } from 'rxjs';
import { Board } from '../../global-whiteboard/board/board';
import { Point } from '../../global-whiteboard/interfaces/point';

@Component({
  selector: 'whiteboard-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements AfterViewInit {

  @Input() board!: Board;

  @ViewChild('canvas')
  public canvas!: ElementRef;

  @ViewChild('g')
  public g!: ElementRef;

  public svgElement: SVGSVGElement | undefined;
  public gElement: SVGGElement | undefined;

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

    /*if (this.svgElement) {
      let midY = this.svgElement?.clientHeight / 2;
      let midX = this.svgElement?.clientWidth / 2;
      let vectY = -this._translateY + midY;
      let vectX = -this._translateX + midX;
      let finalMidY = vectY * value / this._zoom;
      let finalMidX = vectX * value / this._zoom;
      let finalY = vectY - finalMidY;
      let finalX = vectX - finalMidX;
      this._translateX += finalX;
      this._translateY += finalY;
    }*/

    this._zoom = value;
    this.justify();
  }

  public zoomTo(value: number, p?: Point): void {
    // zooms by the value to p
    if (this.svgElement) {
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

    this.zoom = value;
  }

  public setZoomWithoutTranslate(value: number) {
    this._zoom = value;
    this.justify();
  }

  constructor(/*private readonly boardService: BoardService*/) {
    //this.boardService.canvas = this;
  }

  ngAfterViewInit(): void {
    this.board.canvas = this;
    this.svgElement = this.canvas.nativeElement as SVGSVGElement;
    this.gElement = this.g.nativeElement as SVGGElement;
    //this.captureEvents();
    //this.capturePinchZoomEvents();

    new TouchController({
      touchStart: (p: Point) => this.board.startTouch(p),
      touchMove: (from: Point, to: Point) => this.board.moveTouch(from, to),
      touchEnd: (p: Point) => this.board.endTouch(p),
      mouseStart: (p: Point) => this.board.startMouse(p),
      mouseMove: (from: Point, to: Point) => this.board.moveMouse (from, to),
      mouseEnd: (p: Point) => this.board.endMouse(p),
      stylusStart: (p: Point) => this.board.startMouse(p),
      stylusMove: (from: Point, to: Point) => this.board.moveMouse(from, to),
      stylusEnd: (p: Point) => this.board.endMouse(p),
      pinchZoom: (factor: number, point: Point) => this.board.zoomTo(this.board.zoom * factor, point)
    }, this.svgElement)
  }

  /*private capturePinchZoomEvents() {
    // from mdn: https://github.com/mdn/dom-examples/blob/master/pointerevents/Pinch_zoom_gestures.html 

    // Global vars to cache event state
    let evCache = new Array();
    let prevDiff = -1;

    let pointerdown_handler = (ev: any) => {
      // The pointerdown event signals the start of a touch interaction.
      // This event is cached to support 2-finger gestures
      evCache.push(ev);
    }

    let pointermove_handler = (ev: any) => {
      // This function implements a 2-pointer horizontal pinch/zoom gesture. 
      //
      // If the distance between the two pointers has increased (zoom in), 
      // the taget element's background is changed to "pink" and if the 
      // distance is decreasing (zoom out), the color is changed to "lightblue".
      //
      // This function sets the target element's border to "dashed" to visually
      // indicate the pointer's target received a move event.

      // Find this event in the cache and update its record with this event
      for (let i = 0; i < evCache.length; i++) {
        if (ev.pointerId == evCache[i].pointerId) {
            evCache[i] = ev;
        break;
        }
      }

      // If two pointers are down, check for pinch gestures
      if (evCache.length == 2) {
        // Calculate the distance between the two pointers
        let p0 = {
          x: evCache[0].clientX as number,
          y: evCache[0].clientY as number
        }
        let p1 = {
          x: evCache[1].clientX as number,
          y: evCache[1].clientY as number
        }
        let curDiff = Math.sqrt(Math.pow(p0.x - p1.x, 2) + Math.pow(p0.y - p1.y, 2));

        const rect = this.svgElement?.getBoundingClientRect() as DOMRect;
        let averageP = {
          x: (p0.x + p1.x) / 2 - rect.left,
          y: (p0.y + p1.y) / 2 - rect.top
        }

        if (prevDiff > 0 && curDiff > 0) {
          // zoom to the middle by the amount that was scrolled
          this.board.zoomTo(this.board.zoom * curDiff / prevDiff, averageP);
          /*if (curDiff > prevDiff) {
            // The distance between the two pointers has increased
          }
          if (curDiff < prevDiff) {
            // The distance between the two pointers has decreased
          }*/
        /*}

        // Cache the distance for the next move event 
        prevDiff = curDiff;
      }
    }

    let pointerup_handler = (ev: any) => {
      // Remove this pointer from the cache and reset the target's
      // background and border
      remove_event(ev);
    
      // If the number of pointers down is less than two then reset diff tracker
      if (evCache.length < 2) prevDiff = -1;
    }

    let remove_event = (ev: any) => {
      // Remove this event from the target's cache
      for (let i = 0; i < evCache.length; i++) {
        if (evCache[i].pointerId == ev.pointerId) {
          evCache.splice(i, 1);
          break;
        }
      }
    }

    if (this.svgElement) {
      this.svgElement.onpointerdown = pointerdown_handler;
      this.svgElement.onpointermove = pointermove_handler;

      // Use same handler for pointer{up,cancel,out,leave} events since
      // the semantics for these events - in this app - are the same.
      this.svgElement.onpointerup = pointerup_handler;
      this.svgElement.onpointercancel = pointerup_handler;
      this.svgElement.onpointerout = pointerup_handler;
      this.svgElement.onpointerleave = pointerup_handler;
    }

  }

  private captureEvents() {
    let getPosFromMouseEvent = (e: MouseEvent): Point => {
      const rect = this.svgElement?.getBoundingClientRect() as DOMRect;

      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }

    let getPosFromTouchEvent = (e: any): Point => {
      let res1: any = e.changedTouches[0];

      const rect = this.svgElement?.getBoundingClientRect() as DOMRect;
      
      return {
        x: res1.clientX - rect.left,
        y: res1.clientY - rect.top
      };
    }

    this.svgElement?.addEventListener('mouseup', async (e: MouseEvent) => {
      e.preventDefault();
      await this.board.endMouse(getPosFromMouseEvent(e));
    })
    this.svgElement?.addEventListener('mouseleave', async (e: MouseEvent) => {
      e.preventDefault();
      if (e.buttons != 0) {
        await this.board.endMouse(getPosFromMouseEvent(e));
      }
    })
    this.svgElement?.addEventListener('touchcancel', async (e: any) => {
      if (e.preventDefault) {
        e.preventDefault();
      }
      await this.board.endTouch(getPosFromTouchEvent(e));
    });
    this.svgElement?.addEventListener('touchend', async (e: any) => {
      if (e.preventDefault) {
        e.preventDefault();
      }
      await this.board.endTouch(getPosFromTouchEvent(e));
    });
    this.svgElement?.addEventListener('contextmenu', (e: any) => {
      if (e.preventDefault) {
        e.preventDefault();
      }
    })

    // this will capture all mousedown events from the canvas element
    fromEvent(this.svgElement as SVGSVGElement, 'mousedown')
      .pipe(
        switchMap((e: any) => {
          let m = e as MouseEvent;
          m.preventDefault();
          this.board.startMouse(getPosFromMouseEvent(m));

          // after a mouse down, we'll record all mouse moves
          return fromEvent(this.svgElement as SVGSVGElement, 'mousemove')
            .pipe(
              // we'll stop (and unsubscribe) once the user releases the mouse
              // this will trigger a 'mouseup' event    
              takeUntil(fromEvent(this.svgElement as SVGSVGElement, 'mouseup')),
              // we'll also stop (and unsubscribe) once the mouse leaves the canvas (mouseleave event)
              takeUntil(fromEvent(this.svgElement as SVGSVGElement, 'mouseleave')),
              // pairwise lets us get the previous value to draw a line from
              // the previous point to the current point    
              pairwise()
            )
        })
      )
      .subscribe(async (res: any) => {
        res[0].preventDefault();
        res[1].preventDefault();
        
        const rect = this.svgElement?.getBoundingClientRect() as DOMRect;
  
        // previous and current position with the offset
        const prevPos = {
          x: res[0].clientX - rect.left,
          y: res[0].clientY - rect.top
        };
  
        const currentPos = {
          x: res[1].clientX - rect.left,
          y: res[1].clientY - rect.top
        };
  
        await this.board.moveMouse(prevPos, currentPos);
      });
      
      // this will capture all mousedown events from the canvas element
      fromEvent(this.svgElement as SVGSVGElement, 'touchstart')
        .pipe(
          switchMap((e) => {
            e.preventDefault();
            this.board.startTouch(getPosFromTouchEvent(e));
  
            // after a mouse down, we'll record all mouse moves
            return fromEvent(this.svgElement as SVGSVGElement, 'touchmove')
              .pipe(
                // we'll stop (and unsubscribe) once the user releases the mouse
                // this will trigger a 'mouseup' event    
                takeUntil(fromEvent(this.svgElement as SVGSVGElement, 'touchend')),
                // we'll also stop (and unsubscribe) once the mouse leaves the canvas (mouseleave event)
                takeUntil(fromEvent(this.svgElement as SVGSVGElement, 'touchcancel')),
                // pairwise lets us get the previous value to draw a line from
                // the previous point to the current point    
                pairwise()
              )
          })
        )
        .subscribe(async (res: any) => {
          res[0].preventDefault();
          res[1].preventDefault();
          let res1: any = res[0].changedTouches[0];
          let res2: any = res[1].changedTouches[0];

          const rect = this.svgElement?.getBoundingClientRect() as DOMRect;
    
          // previous and current position with the offset
          const prevPos = {
            x: res1.clientX - rect.left,
            y: res1.clientY - rect.top
          };
    
          const currentPos = {
            x: res2.clientX - rect.left,
            y: res2.clientY - rect.top
          };
    
          await this.board.moveTouch(prevPos, currentPos);
        });
  }*/

  private justify() {
    this.gElement?.setAttribute('transform', `translate(${this.translateX} ${this.translateY}) scale(${this.zoom})`)
  }

}
