import { pixelsToMM } from './../../../global-whiteboard/board/board';
import { Interval } from './../interval';
import { Component, OnInit, Input, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Board, svgns } from 'src/app/whiteboard/global-whiteboard/board/board';
import { Point, Vector } from 'src/app/whiteboard/global-whiteboard/interfaces/point';
import { Line } from '../line';
import { Tool } from '../tool';
import { Geometry } from '../geometry';
import { turnVectorByAngle } from 'src/app/whiteboard/global-whiteboard/essentials/utils';

@Component({
  selector: 'whiteboard-lineal',
  templateUrl: './lineal.component.html',
  styleUrls: ['./lineal.component.scss']
})
export class LinealComponent extends Tool implements OnInit, AfterViewInit {

  @Input() board!: Board;

  @Input() length: number = 800;
  @Input() thickness: number = 130;

  @Input() position: Vector = {
    x: 0,
    y: 0
  }

  @ViewChild('g') g!: ElementRef;
  gElement?: SVGGElement;

  @ViewChild('gMarks') gMarks!: ElementRef;
  gMarksElement?: SVGGElement;

  angleDisplayer?: SVGTextElement;

  public get isActive(): boolean {
    return this.board.linealOpen;
  }

  constructor() { 
    super(undefined, { x: 100, y: 100 });
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
  }

  ngAfterViewInit(): void {
    this.intialize();
  }

  protected getGeometryElements(): Geometry[] {
    // Gebe die Strecke zurück, die durch das Lineal modelliert wird
    let ps = this.getPoints();
    let p1: Point = ps[0];
    let p2: Point = ps[1];
    let p3: Point = ps[2];
    let p4: Point = ps[3];
    let line12 = Line.fromPointsWithIntervals(p1, p2);
    let line23 = Line.fromPointsWithIntervals(p2, p3);
    let line34 = Line.fromPointsWithIntervals(p3, p4);
    let line41 = Line.fromPointsWithIntervals(p4, p1);
    return [ line12, line23, line34, line41 ];
  }

  private getPoints(): [Point, Point, Point, Point] {
    return [
      this.board.getActualPoint({
        x: this.position.x - Math.sin(this.angle) * this.thickness,
        y: this.position.y + Math.cos(this.angle) * this.thickness
      }),
      this.board.getActualPoint({
        x: this.position.x - Math.sin(this.angle) * this.thickness + Math.cos(this.angle) * this.length,
        y: this.position.y + Math.cos(this.angle) * this.thickness + Math.sin(this.angle) * this.length
      }),
      this.board.getActualPoint({
        x: this.position.x + Math.cos(this.angle) * this.length,
        y: this.position.y + Math.sin(this.angle) * this.length
      }),
      this.board.getActualPoint(this.position)
    ]
  }

  protected drawAngle(label: string, color: string): void {
    if (!this.angleDisplayer) {
      this.angleDisplayer = document.createElementNS(svgns, 'text');

      let outerG = document.createElementNS(svgns, 'g');
      outerG.appendChild(this.angleDisplayer);
      outerG.setAttributeNS(null, 'transform', `translate(${this.length / 2} ${this.thickness / 1.6})` );

      this.gElement?.appendChild(outerG);
    }

    this.angleDisplayer.setAttributeNS(null, 'fill', color);
    this.angleDisplayer.setAttributeNS(null, 'transform', `rotate(-${this.angleInDeg})`)
    this.angleDisplayer.textContent = label;
  }

  protected drawLines(): void {
    this.removeMarks();

    const jumps = this.getJumpsForMarks();
    const offset = 20;
    const dist = pixelsToMM * 10 * this.board.zoom;
    const smallDist = pixelsToMM * this.board.zoom;
    const lineLength = 30;
    const smallLineLength = 10;

    let index = 0;
    for (let i = offset; i <= this.length - offset; i += smallDist, index++) {
      if (index % (jumps * 10) == 0) {
        this.addLineMarks(i, 0, i, lineLength);
        this.addTextMarks(i - 7, 50, Math.round((i - offset) / dist * 100) / 100);
      }
      else if (index % jumps == 0) {
        this.addLineMarks(i, 0, i, smallLineLength, 0.5);
      }
    }
  }

}
