import { BoardService, Shapes } from 'src/app/features/board.service';
import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, Input } from '@angular/core';
import { Board } from 'src/app/global/board/board';

@Component({
  selector: 'app-shape-picker',
  templateUrl: './shape-picker.component.html',
  styleUrls: ['./shape-picker.component.scss']
})
export class ShapePickerComponent implements AfterViewInit {
  
  @Input() board!: Board;
  
  @ViewChild('line')
  public line!: ElementRef;
  @ViewChild('circle')
  public circle!: ElementRef;
  @ViewChild('rect')
  public rect!: ElementRef;
  @ViewChild('ellipse')
  public ellipse!: ElementRef;

  constructor() { }

  public isLine(): boolean {
    return this.board.shapeMode == Shapes.Line;
  }
  public setLine(): void {
    this.board.shapeMode = Shapes.Line;
  }

  public isCircle(): boolean {
    return this.board.shapeMode == Shapes.Circle;
  }
  public setCircle(): void {
    this.board.shapeMode = Shapes.Circle;
  }

  public isRect(): boolean {
    return this.board.shapeMode == Shapes.Rectangle;
  }
  public setRect(): void {
    this.board.shapeMode = Shapes.Rectangle;
  }

  public isEllipse(): boolean {
    return this.board.shapeMode == Shapes.Ellipse;
  }
  public setEllipse(): void {
    this.board.shapeMode = Shapes.Ellipse;
  }

  ngAfterViewInit(): void {
    this.reloadShapes(this.board.stroke.getThickness());
  }

  public reloadShapes(strokeWidth: number) {
    let line = this.line.nativeElement as SVGLineElement;
    let ellipse = this.ellipse.nativeElement as SVGLineElement;
    let circle = this.circle.nativeElement as SVGLineElement;
    let rectangle = this.rect.nativeElement as SVGLineElement;

    let stroke = this.board.stroke.color.toString();
    let fill = this.board.fill.toString();

    line.setAttributeNS(null, 'stroke', stroke);
    rectangle.setAttributeNS(null, 'stroke', stroke);
    circle.setAttributeNS(null, 'stroke', stroke);
    ellipse.setAttributeNS(null, 'stroke', stroke);

    line.setAttributeNS(null, 'stroke-width', strokeWidth.toString());
    rectangle.setAttributeNS(null, 'stroke-width', strokeWidth.toString());
    circle.setAttributeNS(null, 'stroke-width', strokeWidth.toString());
    ellipse.setAttributeNS(null, 'stroke-width', strokeWidth.toString());
    
    rectangle.setAttributeNS(null, 'fill', fill);
    circle.setAttributeNS(null, 'fill', fill);
    ellipse.setAttributeNS(null, 'fill', fill);

    line.setAttributeNS(null, 'stroke-linecap', this.board.stroke.strokeLineCap);
  }

}
