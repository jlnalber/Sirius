import { Component, ElementRef, ViewChild, AfterViewInit, Input } from '@angular/core';
import { Board, BoardModes } from 'src/app/whiteboard/global-whiteboard/board/board';
import { Control } from 'src/app/whiteboard/global-whiteboard/controls/control';
import { Color } from 'src/app/whiteboard/global-whiteboard/essentials/color';
import { Color as IColor } from 'src/app/whiteboard/global-whiteboard/interfaces/whiteboard';
import { ShapePickerComponent } from '../../shape-picker/shape-picker.component';

@Component({
  selector: 'whiteboard-shape-control',
  templateUrl: './shape-control.component.html',
  styleUrls: ['./shape-control.component.scss']
})
export class ShapeControlComponent extends Control implements AfterViewInit {

  @Input() board!: Board;

  @Input() enabled = true;

  @ViewChild('shapePicker')
  public sPicker!: ElementRef;

  cListener = (c: Color | IColor) => {
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
