import { ShapePickerComponent } from './../shape-picker/shape-picker.component';
import { Control } from 'src/app/global/control';
import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, ViewChildren } from '@angular/core';
import { BoardModes, BoardService } from 'src/app/features/board.service';
import { Color } from 'src/app/global/color';

const svgns = "http://www.w3.org/2000/svg";

@Component({
  selector: 'app-shape-control',
  templateUrl: './shape-control.component.html',
  styleUrls: ['./shape-control.component.scss']
})
export class ShapeControlComponent extends Control implements OnInit {

  @ViewChild('shapePicker')
  public sPicker!: ElementRef;

  cListener = (c: Color) => {
    if (this.active && this.isOpen() && this.sPicker) {
      (this.sPicker as any as ShapePickerComponent).reloadShapes(this.boardService.stroke.getThickness())
    }
  }

  sListener = (s: number) => {
    if (this.active && this.isOpen() && this.sPicker) {
      (this.sPicker as any as ShapePickerComponent).reloadShapes(s)
    }
  }

  constructor(boardService: BoardService) {
    super(boardService, BoardModes.Shape);
  }

  ngOnInit(): void {
  }

}
