import { Component, Input, OnInit } from '@angular/core';
import { Board } from '../../global-whiteboard/board/board';
import { Color } from '../../global-whiteboard/essentials/color';

@Component({
  selector: 'whiteboard-fill-picker',
  templateUrl: './fill-picker.component.html',
  styleUrls: ['./fill-picker.component.scss']
})
export class FillPickerComponent implements OnInit {

  @Input() board!: Board;

  @Input() listener: (c: Color) => void = () => {};

  currentColor = () => {
    return this.board.fill;
  }
  setColor = (c: Color) => {
    this.board.fill = c;
    this.listener(c);
  }
  colors: Color[] = [
    new Color(0, 0, 0, 0)
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
