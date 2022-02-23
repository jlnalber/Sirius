import { Board } from 'src/app/global/board/board';
import { Component, Input, OnInit } from '@angular/core';
import { Color } from 'src/app/global/color';

@Component({
  selector: 'app-fill-picker',
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
