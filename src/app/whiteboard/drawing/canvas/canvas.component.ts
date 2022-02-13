import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

import { fromEvent } from 'rxjs';
import { switchMap, takeUntil, pairwise } from 'rxjs';
import { Color } from 'src/app/global/color';
import { Path } from 'src/app/global/path';
import { Stroke } from 'src/app/global/stroke';

const svgns = "http://www.w3.org/2000/svg";

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements AfterViewInit {

  @ViewChild('canvas')
  public canvas!: ElementRef;

  @Input() public stroke: Stroke = new Stroke(new Color(0, 0, 0));

  constructor() { }

  ngAfterViewInit(): void {
    let svgElement = this.canvas.nativeElement as SVGSVGElement;
    this.captureEvents(svgElement);
  }

  private currentPath: Path = new Path(document.createElementNS(svgns, 'path'), this.stroke);
  
  private captureEvents(canvasEl: SVGSVGElement) {
    canvasEl.addEventListener('mouseup', () => {
      this.currentPath.finalize();
    })
    canvasEl.addEventListener('mouseleave', () => {
      this.currentPath.finalize();
    })

    // this will capture all mousedown events from the canvas element
    fromEvent(canvasEl, 'mousedown')
      .pipe(
        switchMap((e) => {
          //this.currentPath.finalize();
          let pathEl = document.createElementNS(svgns, 'path');
          canvasEl.appendChild(pathEl);
          this.currentPath = new Path(pathEl, this.stroke);

          // after a mouse down, we'll record all mouse moves
          return fromEvent(canvasEl, 'mousemove')
            .pipe(
              // we'll stop (and unsubscribe) once the user releases the mouse
              // this will trigger a 'mouseup' event    
              takeUntil(fromEvent(canvasEl, 'mouseup')),
              // we'll also stop (and unsubscribe) once the mouse leaves the canvas (mouseleave event)
              takeUntil(fromEvent(canvasEl, 'mouseleave')),
              // pairwise lets us get the previous value to draw a line from
              // the previous point to the current point    
              pairwise()
            )
        })
      )
      .subscribe((res: any) => {
        const rect = canvasEl.getBoundingClientRect();
  
        // previous and current position with the offset
        const prevPos = {
          x: res[0].clientX - rect.left,
          y: res[0].clientY - rect.top
        };
  
        const currentPos = {
          x: res[1].clientX - rect.left,
          y: res[1].clientY - rect.top
        };
  
        // this method we'll implement soon to do the actual drawing
        this.currentPath.addPoint(currentPos);/*.drawOnCanvas(prevPos, currentPos, canvasEl);*/
      });
  }

}
