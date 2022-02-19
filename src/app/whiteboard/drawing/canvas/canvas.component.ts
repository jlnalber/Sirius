import { Point } from './../../../global/canvasElements/canvasElement';
import { BoardService } from './../../../features/board.service';
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

import { fromEvent } from 'rxjs';
import { switchMap, takeUntil, pairwise } from 'rxjs';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements AfterViewInit {

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

  constructor(private readonly boardService: BoardService) {
    this.boardService.canvas = this;
  }

  ngAfterViewInit(): void {
    this.svgElement = this.canvas.nativeElement as SVGSVGElement;
    this.gElement = this.g.nativeElement as SVGGElement;
    this.captureEvents();
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

    this.svgElement?.addEventListener('mouseup', (e: MouseEvent) => {
      this.boardService.endTouch(getPosFromMouseEvent(e));
    })
    this.svgElement?.addEventListener('mouseleave', (e: MouseEvent) => {
      if (e.buttons != 0) {
        this.boardService.endTouch(getPosFromMouseEvent(e));
      }
    })
    this.svgElement?.addEventListener('touchcancel', (e: any) => {
      this.boardService.endTouch(getPosFromTouchEvent(e));
    });
    this.svgElement?.addEventListener('touchend', (e: any) => {
      this.boardService.endTouch(getPosFromTouchEvent(e));
    });

    // this will capture all mousedown events from the canvas element
    fromEvent(this.svgElement as SVGSVGElement, 'mousedown')
      .pipe(
        switchMap((e: any) => {
          this.boardService.startTouch(getPosFromMouseEvent(e as MouseEvent));

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
      .subscribe((res: any) => {
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
  
        this.boardService.moveTouch(prevPos, currentPos);
      });
      
      // this will capture all mousedown events from the canvas element
      fromEvent(this.svgElement as SVGSVGElement, 'touchstart')
        .pipe(
          switchMap((e) => {
            this.boardService.startTouch(getPosFromTouchEvent(e));
  
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
        .subscribe((res: any) => {
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
    
          this.boardService.moveTouch(prevPos, currentPos);
        });
  }

  private justify() {
    this.gElement?.setAttribute('transform', `translate(${this.translateX} ${this.translateY}) scale(${this.zoom})`)
  }

}
