import { add, getAngleVector, scale, turnVectorByAngle } from 'src/app/whiteboard/global-whiteboard/essentials/utils';
import { CircleSegment } from './../circleSegment';
import { Point, Vector } from './../../../global-whiteboard/interfaces/point';
import { Board, pixelsToMM, svgns } from 'src/app/whiteboard/global-whiteboard/board/board';
import { Component, ElementRef, Input, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Tool } from '../tool';
import { Geometry } from '../geometry';
import { Line } from '../line';
import { Interval, ModulInterval } from '../interval';

@Component({
  selector: 'whiteboard-halbkreis',
  templateUrl: './halbkreis.component.html',
  styleUrls: ['./halbkreis.component.scss']
})
export class HalbkreisComponent extends Tool implements OnInit, AfterViewInit {

  @Input() board!: Board;

  @Input() radius: number = 300;

  @Input() position: Vector = {
    x: 0,
    y: 0
  }

  @ViewChild('g') g!: ElementRef;
  gElement?: SVGGElement;

  @ViewChild('gMarks') gMarks!: ElementRef;
  gMarksElement?: SVGGElement;

  @ViewChild('path') path!: ElementRef;
  pathElement?: SVGPathElement;

  angleDisplayer?: SVGTextElement;

  protected override additionalInitialization = () => {
    // draw the circle
    this.pathElement = this.path.nativeElement;
    this.pathElement?.setAttributeNS(null, 'd', `M 0 0 A ${this.radius} ${this.radius} 0 0 0 ${2 * this.radius} 0 z`)
  }

  public get isActive(): boolean {
    return this.board.halbkreisOpen;
  }

  constructor() {
    super(undefined, { x: 100, y: 100 });
  }

  ngOnInit(): void {
    // save myself in the board
    this.board.halbkreis = this;
    this.board.onHalbkreisToggled.addListener(() => {

      if (!this.board.halbkreisOpen) {
        this.angleDisplayer = undefined;
      }

      setTimeout(() => {
        this.intialize();
      }, 0);
    })
  }

  ngAfterViewInit(): void {
    this.intialize();
  }

  protected getGeometryElements(): Geometry[] {
    // Berechne die obere Strecke
    let ps = this.getTwoPoints();
    let p1: Point = ps[0];
    let p2: Point = ps[1];
    let line = Line.fromPointsWithIntervals(p1, p2);
    
    // Berechne den Halbkreis
    let halbkreis = new CircleSegment(this.board.getActualPoint({
      x: this.position.x + this.radius * Math.cos(this.angle),
      y: this.position.y + this.radius * Math.sin(this.angle)
    }), this.radius / this.board.zoom, new ModulInterval(2 * Math.PI, this.angle, Math.PI + this.angle));
    
    return [ line, halbkreis ];
  }

  private getTwoPoints(): [Point, Point] {
    let p1: Point = {
      x: this.position.x,
      y: this.position.y
    }
    let p2: Point = {
      x: this.position.x + Math.cos(this.angle) * 2 * this.radius,
      y: this.position.y + Math.sin(this.angle) * 2 * this.radius
    };
    return [
      this.board.getActualPoint(p1),
      this.board.getActualPoint(p2)
    ];
  }

  protected drawAngle(label: string, color: string): void {
    if (!this.angleDisplayer) {
      this.angleDisplayer = document.createElementNS(svgns, 'text');

      let outerG = document.createElementNS(svgns, 'g');
      outerG.appendChild(this.angleDisplayer);
      outerG.setAttributeNS(null, 'transform', `translate(${this.radius} ${this.radius / 2})` );

      this.gElement?.appendChild(outerG);
    }

    this.angleDisplayer.setAttributeNS(null, 'fill', color);
    this.angleDisplayer.setAttributeNS(null, 'transform', `rotate(-${this.angleInDeg})`)
    this.angleDisplayer.textContent = label;
  }

  protected drawLines(): void {

    this.removeMarks();

    const jumps = this.getJumpsForMarks();
    const smallDist = pixelsToMM * this.board.zoom;
    const offset = 20;
    const lineLength = 20;
    const smallLineLength = 7;

    // get the marks on the top
    let index = 0;
    for (let i = offset; i <= 2 * this.radius - offset; i += smallDist, index++) {
      if (index % (10 * jumps) == 0) {
        this.addLineMarks(i, 0, i, lineLength)
        this.addTextMarks(i - 7, 40, index / 10);
      }
      else if (index % jumps == 0) {
        this.addLineMarks(i, 0, i, smallLineLength, 0.5);
      }
    }

    if (!this.alreadyDrawn) {

      // the marks on the circle
      const angleOffset = 10;
      const angleDist = 10;
      const smallAngleDist = 1;
      const outerRad = this.radius;
      const innerRad = this.radius - 20;
      const smallOuterRad = this.radius;
      const smallInnerRad = this.radius - 7;
      const textRad = this.radius - 30;
      const center: Point = {
        x: this.radius,
        y: 0
      }
      index = 0;
      for (let a = angleOffset; a <= 180 - angleOffset; a += smallAngleDist, index++) {
        if (a != 90) {
          const angle = a / 180 * Math.PI;
          let iRad = smallInnerRad;
          let oRad = smallOuterRad;
          let strokeWidth = 0.5;

          if (index % (angleDist / smallAngleDist) == 0) {
            iRad = innerRad;
            oRad = outerRad;
            strokeWidth = 1;

            if (a != angleOffset && a != 180 - angleOffset) {
              this.addText(center.x + Math.cos(angle) * textRad - 7, center.y + Math.sin(angle) * textRad, Math.round(a * 100) / 100 + '°');
            }
          }

          this.addLine(center.x + Math.cos(angle) * iRad, center.y + Math.sin(angle) * iRad, center.x + Math.cos(angle) * oRad, center.y + Math.sin(angle) * oRad, strokeWidth)
        }
      }

      // add special lines
      const halfTextSpace = 50;
      const distanceLineToText = 50;
      this.addLine(this.radius, distanceLineToText, this.radius, this.radius / 2 - halfTextSpace);
      this.addLine(this.radius, this.radius / 2 + halfTextSpace, this.radius, this.radius);

      this.addLine(this.radius - distanceLineToText, distanceLineToText, this.radius - this.radius / Math.SQRT2, this.radius / Math.SQRT2);
      this.addLine(this.radius + distanceLineToText, distanceLineToText, this.radius + this.radius / Math.SQRT2, this.radius / Math.SQRT2);
      
    }

  }

  private lineIndicator1?: SVGLineElement;
  private lineIndicator2?: SVGLineElement;
  protected override drawPoints(start?: Point, end?: Point, index?: number): void {
    if (index == undefined || (!start && !end)) {
      try {
        if (this.lineIndicator1) {
          this.gElement?.removeChild(this.lineIndicator1);
        }
      } catch { }
      try {
        if (this.lineIndicator2) {
          this.gElement?.removeChild(this.lineIndicator2);
        }
      } catch { }

      this.lineIndicator1 = undefined;
      this.lineIndicator2 = undefined;
    }

    if (index == undefined || (!start && !end) || index == 0) {
      super.drawPoints(start, end, index);
    }
    else if (index == 1 && start && end) {
      if (!this.lineIndicator1) {
        this.lineIndicator1 = this.addLine(0, 0, 0, 0, 2, 'red');
      }
      if (!this.lineIndicator2) {
        this.lineIndicator2 = this.addLine(0, 0, 0, 0, 2, 'red');
      }

      let center = {
        x: this.radius,
        y: 0
      };

      this.lineIndicator1.setAttributeNS(null, 'x1', center.x.toString());
      this.lineIndicator1.setAttributeNS(null, 'y1', center.y.toString());
      this.lineIndicator2.setAttributeNS(null, 'x1', center.x.toString());
      this.lineIndicator2.setAttributeNS(null, 'y1', center.y.toString());
      this.lineIndicator1.setAttributeNS(null, 'x2', start.x.toString());
      this.lineIndicator1.setAttributeNS(null, 'y2', start.y.toString());
      this.lineIndicator2.setAttributeNS(null, 'x2', end.x.toString());
      this.lineIndicator2.setAttributeNS(null, 'y2', end.y.toString());


      let angle1 = getAngleVector(add(start, scale(center, -1)));
      let angle2 = getAngleVector(add(end, scale(center, -1)));
      let angleDiff = Math.abs(angle1 - angle2);
      angleDiff = angleDiff > Math.PI ? 2 * Math.PI - angleDiff : angleDiff;
      this.drawAngle((Math.round(angleDiff / Math.PI * 180 * 100) / 100).toLocaleString() + '°', 'red');
    }
  }

}
