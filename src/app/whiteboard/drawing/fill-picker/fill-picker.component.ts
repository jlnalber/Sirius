import { Component, Input, OnInit } from '@angular/core';
import { BoardService } from 'src/app/features/board.service';
import { Color } from 'src/app/global/color';

@Component({
  selector: 'app-fill-picker',
  templateUrl: './fill-picker.component.html',
  styleUrls: ['./fill-picker.component.scss']
})
export class FillPickerComponent implements OnInit {

  @Input() listener: (c: Color) => void = () => {};

  currentColor = () => {
    return this.boardService.fill;
  }
  setColor = (c: Color) => {
    this.boardService.fill = c;
    this.listener(c);
  }
  colors: Color[] = [
    new Color(0, 0, 0, 0)
  ]

  constructor(public readonly boardService: BoardService) { }

  ngOnInit(): void {
  }

}
