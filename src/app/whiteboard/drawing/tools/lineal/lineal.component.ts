import { Interval } from './../line';
import { Component, OnInit, Input, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Board, svgns } from 'src/app/whiteboard/global-whiteboard/board/board';
import { Point, Vector } from 'src/app/whiteboard/global-whiteboard/interfaces/point';
import { Line } from '../line';
import { PolygonTool } from '../polygonTool';

@Component({
  selector: 'whiteboard-lineal',
  templateUrl: './lineal.component.html',
  styleUrls: ['./lineal.component.scss']
})
export class LinealComponent extends PolygonTool implements OnInit, AfterViewInit {

  @Input() board!: Board;

  @Input() length: number = 800;
  @Input() thickness: number = 130;

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
  protected angleSet = () => {
    this.drawAngle();
  }

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

  protected getLines(): Line[] {
    // Gebe die Strecke zurück, die durch das Lineal modelliert wird
    let ps = this.getTwoPoints();
    let p1: Point = ps[0];
    let p2: Point = ps[1];
    let line = Line.fromPoints(p1, p2, new Interval(p1.x, p2.x), new Interval(p1.y, p2.y));
    return [ line ];
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
      this.addLine(i, 0, i, 30);

      let text = document.createElementNS(svgns, 'text');
      text.textContent = ((i - offset) / 50).toString();
      text.setAttributeNS(null, 'x', (i - 7).toString());
      text.setAttributeNS(null, 'y', '50');
      this.gElement?.appendChild(text);

    }
  }

}
