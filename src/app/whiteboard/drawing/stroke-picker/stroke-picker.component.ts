import { BoardService } from './../../../features/board.service';
import { Component, Input, OnInit } from '@angular/core';
import { Color } from 'src/app/global/color';
import { MatSliderChange } from '@angular/material/slider';
import { Board } from 'src/app/global/board/board';

@Component({
  selector: 'app-stroke-picker',
  templateUrl: './stroke-picker.component.html',
  styleUrls: ['./stroke-picker.component.scss']
})
export class StrokePickerComponent implements OnInit {
  
  @Input() board!: Board;

  @Input() listener: (c: Color) => void = () => {};
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
  setColor = (c: Color) => {
    this.board.stroke.color = c;
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
