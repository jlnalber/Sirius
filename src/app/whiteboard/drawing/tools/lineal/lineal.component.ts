import { Component, OnInit, Input, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Board, svgns } from 'src/app/whiteboard/global-whiteboard/board/board';
import { Vector } from 'src/app/whiteboard/global-whiteboard/interfaces/point';

@Component({
  selector: 'whiteboard-lineal',
  templateUrl: './lineal.component.html',
  styleUrls: ['./lineal.component.scss']
})
export class LinealComponent implements OnInit, AfterViewInit {

  @Input() board!: Board;

  @Input() length: number = 800;
  @Input() thickness: number = 130;

  private _angle: number = Math.PI / 8;
  @Input() set angle(value: number) {
    this._angle = value;
    this.drawAngle();
  }
  get angle(): number {
    return this._angle;
  }

  @Input() position: Vector = {
    x: 50,
    y: 90
  }

  @ViewChild('g') g!: ElementRef;
  gElement?: SVGGElement;

  angleDisplayer?: SVGTextElement;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.gElement = this.g.nativeElement;

    this.drawLines();
    this.drawAngle();
  }

  drawAngle(): void {
    if (!this.angleDisplayer) {
      this.angleDisplayer = document.createElementNS(svgns, 'text');

      let outerG = document.createElementNS(svgns, 'g');
      outerG.appendChild(this.angleDisplayer);
      outerG.setAttributeNS(null, 'transform', `translate(${this.length / 2} ${this.thickness / 1.5})` );

      this.gElement?.appendChild(outerG);
    }

    this.angleDisplayer.setAttributeNS(null, 'transform', `rotate(-${this.angleInDeg})`)
    this.angleDisplayer.textContent = (Math.round(this.angleInDeg * 100) / 100).toLocaleString() + '°';
  }

  drawLines(): void {
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

  get totalWidth(): number {
    console.log('Hello!')
    return Math.cos(this.angle) * this.length + Math.sin(this.angle) * this.thickness;
  }

  get totalHeight(): number {
    console.log('Blubbber')
    return Math.sin(this.angle) * this.length + Math.cos(this.angle) * this.thickness;
  }

  public get angleInDeg(): number {
    console.log('Hey!')
    return this.angle / Math.PI * 180;
  }

}
