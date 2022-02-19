import { BoardService } from './../../../features/board.service';
import { Component, Input, OnInit } from '@angular/core';
import { Color } from 'src/app/global/color';
import { MatSliderChange } from '@angular/material/slider';

@Component({
  selector: 'app-stroke-picker',
  templateUrl: './stroke-picker.component.html',
  styleUrls: ['./stroke-picker.component.scss']
})
export class StrokePickerComponent implements OnInit {

  @Input() listener: (c: Color) => void = () => {};
  @Input() strokeWidthListener: (strokeThickness: number) => void = () => {};

  currentColor = () => {
    return this.boardService.stroke.color;
  }
  setColor = (c: Color) => {
    this.boardService.stroke.color = c;
    this.listener(c);
  }

  triggerSWL(event: MatSliderChange) {
    if (event.value != null) {
      this.strokeWidthListener(event.value);
    }
  }

  constructor(public readonly boardService: BoardService) { }

  ngOnInit(): void {
  }

}
