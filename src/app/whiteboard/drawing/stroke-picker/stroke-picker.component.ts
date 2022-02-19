import { BoardService } from './../../../features/board.service';
import { Component, Input, OnInit } from '@angular/core';
import { Stroke } from 'src/app/global/stroke';
import { Color } from 'src/app/global/color';

@Component({
  selector: 'app-stroke-picker',
  templateUrl: './stroke-picker.component.html',
  styleUrls: ['./stroke-picker.component.scss']
})
export class StrokePickerComponent implements OnInit {

  currentColor = () => {
    return this.boardService.stroke.color;
  }
  setColor = (c: Color) => {
    this.boardService.stroke.color = c;
  }

  constructor(public readonly boardService: BoardService) { }

  ngOnInit(): void {
  }

}
