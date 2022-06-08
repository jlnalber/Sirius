import { pixelsToMM } from './../../../global-whiteboard/board/board';
import { Point, Vector } from './../../../global-whiteboard/interfaces/point';
import { Board, svgns } from 'src/app/whiteboard/global-whiteboard/board/board';
import { Component, OnInit, AfterViewInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Tool } from '../tool';
import { Line } from '../line';
import { Geometry } from '../geometry';

@Component({
  selector: 'whiteboard-geodreieck',
  templateUrl: './geodreieck.component.html',
  styleUrls: ['./geodreieck.component.scss']
})
export class GeodreieckComponent extends Tool implements OnInit, AfterViewInit {

  @Input() board!: Board;

  @Input() length: number = 500;

  @Input() position: Vector = {
    x: 0,
    y: 0
  } 

  @ViewChild('g') g!: ElementRef;
  gElement?: SVGGElement;

  @ViewChild('gMarks') gMarks!: ElementRef;
  gMarksElement?: SVGGElement;

  @ViewChild('polygon') polygon!: ElementRef;
  polygonElement?: SVGPolygonElement;

  angleDisplayer?: SVGTextElement;

  protected override additionalInitialization = () => {
    // get the polygon element
    this.polygonElement = this.polygon.nativeElement;
    this.polygonElement?.setAttributeNS(null, 'points', `0,${this.length} ${this.length},0 0,0`);
  }

  public get isActive(): boolean {
    return this.board.geodreieckOpen;
  }

  constructor() { 
    super(Math.PI / 4, { x: 100, y: 100 });

    this.defaultPosition = {
      x: 100 + this.length / Math.SQRT2,
      y: 100
    };
  }

  ngAfterViewInit(): void {
    this.intialize();
  }

  ngOnInit(): void {
    // save myself in the board
    this.board.geodreieck = this;
    this.board.onGeodreieckToggled.addListener(() => {

      if (!this.board.geodreieckOpen) {
        this.angleDisplayer = undefined;
      }

      setTimeout(() => {
        this.intialize();
      }, 0);
    })
  }

  protected getGeometryElements(): Geometry[] {
    // Gebe die Strecken zurück, die durch das Geodreieck modelliert werden
    let ps = this.getPoints();
    let p1: Point = ps[0];
    let p2: Point = ps[1];
    let p3: Point = ps[2];
    let line12 = Line.fromPointsWithIntervals(p1, p2);
    let line23 = Line.fromPointsWithIntervals(p2, p3);
    let line31 = Line.fromPointsWithIntervals(p3, p1);
    return [ line12, line23, line31 ];
  }

  private getPoints(): [Point, Point, Point] {
    let p1: Point = {
      x: this.position.x - Math.sin(this.angle) * this.length,
      y: this.position.y + Math.cos(this.angle) * this.length
    };
    let p2: Point = {
      x: this.position.x + Math.cos(this.angle) * this.length,
      y: this.position.y + Math.sin(this.angle) * this.length
    };
    let p3: Point = this.position;

    return [
      this.board.getActualPoint(p1),
      this.board.getActualPoint(p2),
      this.board.getActualPoint(p3)
    ];
  }

  protected drawAngle(): void {
    // draw the angle
    if (!this.angleDisplayer) {
      this.angleDisplayer = document.createElementNS(svgns, 'text');

      let outerG = document.createElementNS(svgns, 'g');
      outerG.appendChild(this.angleDisplayer);
      outerG.setAttributeNS(null, 'transform', `translate(${this.length / 9 - 15} ${this.length / 9})` );

      this.gElement?.appendChild(outerG);
    }

    this.angleDisplayer.setAttributeNS(null, 'transform', `rotate(-${this.angleInDeg})`)
    this.angleDisplayer.textContent = (Math.round(((this.angleInDeg + 315) % 360) * 100) / 100).toLocaleString() + '°';
  }

  protected drawLines(): void {
    this.removeMarks();

    const jumps = this.getJumpsForMarks();
    const smallDist = pixelsToMM * this.board.zoom;
    const offsetD = 52;
    const lineLengthD = 20;
    const smallLineLengthD = 7;

    // get the marks on the bottom
    let index = 0;
    for (let i = offsetD; i <= this.length - offsetD; i += smallDist / Math.SQRT2, index++) {
      if (index % (10 * jumps) == 0) {
        this.addLineMarks(i, this.length - i, i - lineLengthD / Math.SQRT2, this.length - i - lineLengthD / Math.SQRT2)

        let text = this.addTextMarks(i * Math.SQRT2 - 7 - this.length / Math.SQRT2, this.length / Math.SQRT2 - 1.5 * lineLengthD, index / 10);
        text.setAttributeNS(null, 'transform', 'rotate(-45)');
      }
      else if (index % jumps == 0) {
        this.addLineMarks(i, this.length - i, i - smallLineLengthD / Math.SQRT2, this.length - i - smallLineLengthD / Math.SQRT2, 0.5);
      }
    }

    /*// get the lines on the two sides
    const lineLength = 10;
    const offset = 50;
    for (let i = offset; i <= this.length - offset; i += dist) {
      this.addLineMarks(i, 0, i, lineLength);
      this.addLineMarks(0, i, lineLength, i);
    }*/

    if (!this.alreadyDrawn) {
      // draw a circle ...
      let circle = document.createElementNS(svgns, 'path');
      circle.setAttributeNS(null, 'd', `M ${this.length * 3 / 4} ${this.length / 4} A ${this.length / 4} ${this.length / 4} 0 0 0 ${this.length / 4} ${this.length * 3 / 4}`);
      circle.setAttributeNS(null, 'stroke', 'black');
      circle.setAttributeNS(null, 'fill', 'none');
      this.gElement?.appendChild(circle);

      // ... and the marks
      const angleOffset = 20;
      const angleDist = 10;
      const smallAngleDist = 2;
      const innerRad = this.length * 7 / 24;
      const smallOuterRad = this.length * 10 / 27;
      const smallInnerRad = this.length / 3;
      const textRadius = this.length / 4;
      const center: Point = {
        x: this.length / 2,
        y: this.length / 2
      }
      index = 0;
      for (let a = angleOffset; a <= 180 - angleOffset; a += smallAngleDist, index++) {
        if (a != 90) {
          const angle = a / 180 * Math.PI + Math.PI * 3 / 4;
          let iRad = smallInnerRad;
          let oRad = smallOuterRad;
          let strokeWidth = 0.7;

          if (index % (angleDist / smallAngleDist) == 0) {
            iRad = innerRad;
            let newAngle = a > 90 ? 135 - a : 45 - a;
            oRad = Math.sqrt((center.x ** 2) + ((center.x * Math.tan(newAngle / 180 * Math.PI)) ** 2));
            strokeWidth = 1;

            if (index % 2 == 1) {
              let text = this.addText(- Math.cos(a / 180 * Math.PI) * textRadius - 16, this.length / Math.SQRT2 - Math.sin(a / 180 * Math.PI) * textRadius - 4, a + '°');
              text.setAttributeNS(null, 'transform', 'rotate(-45)');
            }
          }

          this.addLine(center.x + Math.cos(angle) * iRad, center.y + Math.sin(angle) * iRad, center.x + Math.cos(angle) * oRad, center.y + Math.sin(angle) * oRad, strokeWidth);
        }
      }

      // add special lines
      const distanceToLine = 40;
      this.addLine(center.x - distanceToLine, center.y - distanceToLine, this.length / 10 + 17, this.length / 10 + 17);
      this.addLine(0, 0, this.length / 10 - 20, this.length / 10 - 20);
      this.addLine(center.x, center.y - 2 * distanceToLine, center.x, 0);
      this.addLine(center.x - 2 * distanceToLine, center.y, 0, center.y);
    }
    
  }

}
