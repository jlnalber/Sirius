import { ShapePickerComponent } from './../shape-picker/shape-picker.component';
import { Control } from 'src/app/global/controls/control';
import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, ViewChildren, Input } from '@angular/core';
import { BoardModes, BoardService } from 'src/app/features/board.service';
import { Color } from 'src/app/global/color';
import { Board } from 'src/app/global/board/board';

const svgns = "http://www.w3.org/2000/svg";

@Component({
  selector: 'app-shape-control',
  templateUrl: './shape-control.component.html',
  styleUrls: ['./shape-control.component.scss']
})
export class ShapeControlComponent extends Control implements AfterViewInit {

  @Input() board!: Board;

  @Input() enabled = true;

  @ViewChild('shapePicker')
  public sPicker!: ElementRef;

  cListener = (c: Color) => {
    if (this.cardOpen && this.isActive() && this.sPicker) {
      (this.sPicker as any as ShapePickerComponent).reloadShapes(this.board.stroke.getThickness())
    }
  }

  sListener = (s: number) => {
    if (this.cardOpen && this.isActive() && this.sPicker) {
      (this.sPicker as any as ShapePickerComponent).reloadShapes(s)
    }
  }

  constructor() {
    super(BoardModes.Shape);
  }

  ngAfterViewInit(): void {
    this.afterViewInit.emit();
  }

}
