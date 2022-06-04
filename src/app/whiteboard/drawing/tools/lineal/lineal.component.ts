import { Interval } from './../line';
import { Component, OnInit, Input, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Board, svgns } from 'src/app/whiteboard/global-whiteboard/board/board';
import { Point, Vector } from 'src/app/whiteboard/global-whiteboard/interfaces/point';
import { DOMRectToRect, getDistance, getTouchControllerEventsAllSame, inRangeWithOrder } from 'src/app/whiteboard/global-whiteboard/essentials/utils';
import { TouchController } from 'src/app/whiteboard/global-whiteboard/essentials/touchController';
import { Line } from '../line';
import { Tool } from '../tool';

@Component({
  selector: 'whiteboard-lineal',
  templateUrl: './lineal.component.html',
  styleUrls: ['./lineal.component.scss']
})
export class LinealComponent extends Tool implements OnInit, AfterViewInit {

  @Input() board!: Board;

  @Input() length: number = 800;
  @Input() thickness: number = 130;

  private _angle: number = 0;
  @Input() set angle(value: number) {
    this._angle = (value + 2 * Math.PI) % (Math.PI * 2);
    this.drawAngle();
    this._lineCache = undefined;
  }
  get angle(): number {
    return this._angle;
  }

  @Input() position: Vector = {
    x: 0,
    y: 0
  }

  @ViewChild('g') g!: ElementRef;
  gElement?: SVGGElement;

  angleDisplayer?: SVGTextElement;

  protected additionalInitialization = () => {
    this.drawLines();
    this.drawAngle();
  }

  constructor() { 
    super();
  }

  ngOnInit(): void {
    // save myself in the board
    this.board.lineal = this;
    this.board.onLinealToggled.addListener(() => {

      if (!this.board.linealOpen) {
        this.angleDisplayer = undefined;
      }

      setTimeout(() => {
        this.intialize();
      }, 0);
    })

    this.board.onWhiteboardViewChange.addListener(() => {
      this._lineCache = undefined;
    })
  }

  ngAfterViewInit(): void {
    this.intialize();
  }

  protected _lineCache?: Line;

  private getLine(): Line {
    if (this._lineCache) return this._lineCache;

    let ps = this.getTwoPoints();
    let p1: Point = ps[0];
    let p2: Point = ps[1];
    let line = Line.fromPoints(p1, p2, new Interval(p1.x, p2.x));
    this._lineCache = line;
    return line;
  }

  private getTwoPoints(): [Point, Point] {
    return [
      this.board.getActualPoint(this.position),
      this.board.getActualPoint({
        x: this.position.x + Math.cos(this.angle) * this.length,
        y: this.position.y + Math.sin(this.angle) * this.length
      })
    ]
  }
  
  public correctPoint(p: Point): Point {
    if (this.board.linealOpen) {
        let line = this.getLine();
        let closestP = line.getClosestPointOnLineTo(p);

        if (this.angle == Math.PI / 2 || this.angle == Math.PI * 3 / 2) {
          let ps = this.getTwoPoints();
          if (!inRangeWithOrder(closestP.y, ps[0].y, ps[1].y)) {
            closestP = {
              x: Number.MAX_VALUE,
              y: Number.MAX_VALUE
            }
          }
        }

        const maxDistance = 40 / this.board.zoom;

        if (getDistance(p, closestP) <= maxDistance) {
            return closestP;
        }
    }
    return p;
  }

  private drawAngle(): void {
    if (!this.angleDisplayer) {
      this.angleDisplayer = document.createElementNS(svgns, 'text');

      let outerG = document.createElementNS(svgns, 'g');
      outerG.appendChild(this.angleDisplayer);
      outerG.setAttributeNS(null, 'transform', `translate(${this.length / 2} ${this.thickness / 1.6})` );

      this.gElement?.appendChild(outerG);
    }

    this.angleDisplayer.setAttributeNS(null, 'transform', `rotate(-${this.angleInDeg})`)
    this.angleDisplayer.textContent = (Math.round(this.angleInDeg * 100) / 100).toLocaleString() + '°';
  }

  private drawLines(): void {
    const offset = 25;
    const dist = 50;

    for (let i = offset; i <= this.length - offset; i += dist) {
      let line = document.createElementNS(svgns, 'line');
      line.setAttributeNS(null, 'x1', i.toString());
      line.setAttributeNS(null, 'x2', i.toString());
      line.setAttributeNS(null, 'y1', '0');
      line.setAttributeNS(null, 'y2', '30');
      line.setAttributeNS(null, 'stroke', 'black');

      let text = document.createElementNS(svgns, 'text');
      text.textContent = ((i - offset) / 50).toString();
      text.setAttributeNS(null, 'x', (i - 7).toString());
      text.setAttributeNS(null, 'y', '50');

      this.gElement?.appendChild(line);
      this.gElement?.appendChild(text);

    }
  }

}
