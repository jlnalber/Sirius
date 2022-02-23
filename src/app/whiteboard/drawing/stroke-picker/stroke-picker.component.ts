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

  currentColor = () => {
    return this.board.stroke.color;
  }
  setColor = (c: Color) => {
    this.board.stroke.color = c;
    this.listener(c);
  }

  triggerSWL(event: MatSliderChange) {
    if (event.value != null) {
      this.strokeWidthListener(event.value);
    }
  }

  constructor() { }

  ngOnInit(): void {
  }

}
