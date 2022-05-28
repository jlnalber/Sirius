import { Component, Input, OnInit } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { Board } from '../../global-whiteboard/board/board';
import { Color } from '../../global-whiteboard/essentials/color';
import { Color as IColor } from '../../global-whiteboard/interfaces/whiteboard';

@Component({
  selector: 'whiteboard-stroke-picker',
  templateUrl: './stroke-picker.component.html',
  styleUrls: ['./stroke-picker.component.scss']
})
export class StrokePickerComponent implements OnInit {
  
  @Input() board!: Board;

  @Input() listener: (c: Color | IColor) => void = () => {};
  @Input() strokeWidthListener: (strokeThickness: number) => void = () => {};

  getSliderValue(): number {
    return Math.sqrt(this.board.stroke.getThickness());
  }

  setThickness(value: number) {
    this.board.stroke.thickness = Math.pow(value, 2);
  }

  colors: Color[] = [
  ];

  currentColor = () => {
    return this.board.stroke.color;
  }
  setColor = (c: Color | IColor) => {
    this.board.stroke.color = c instanceof Color ? c : Color.from(c);
    this.listener(c);
  }

  triggerSWL(event: MatSliderChange) {
    if (event.value != null) {
      this.setThickness(event.value);
      this.strokeWidthListener(this.board.stroke.thickness ?? 1);
    }
  }

  constructor() { }

  ngOnInit(): void {
  }

}
