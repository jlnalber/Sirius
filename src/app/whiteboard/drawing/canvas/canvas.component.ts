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

    if (this.svgElement) {
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
    }

    this._zoom = value;
    this.justify();
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
    this.captureEvents();

    this.board.onImport.addListener(() => {
    })
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
      await this.board.endTouch(getPosFromMouseEvent(e));
    })
    this.svgElement?.addEventListener('mouseleave', async (e: MouseEvent) => {
      e.preventDefault();
      if (e.buttons != 0) {
        await this.board.endTouch(getPosFromMouseEvent(e));
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

    // this will capture all mousedown events from the canvas element
    fromEvent(this.svgElement as SVGSVGElement, 'mousedown')
      .pipe(
        switchMap((e: any) => {
          let m = e as MouseEvent;
          m.preventDefault();
          this.board.startTouch(getPosFromMouseEvent(m));

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
  
        await this.board.moveTouch(prevPos, currentPos);
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
  }

  private justify() {
    this.gElement?.setAttribute('transform', `translate(${this.translateX} ${this.translateY}) scale(${this.zoom})`)
  }

}
