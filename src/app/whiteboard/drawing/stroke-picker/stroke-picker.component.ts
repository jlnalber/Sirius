import { BoardService } from './../../../features/board.service';
import { Component, Input, OnInit } from '@angular/core';
import { Stroke } from 'src/app/global/stroke';

@Component({
  selector: 'app-stroke-picker',
  templateUrl: './stroke-picker.component.html',
  styleUrls: ['./stroke-picker.component.scss']
})
export class StrokePickerComponent implements OnInit {

  constructor(public readonly boardService: BoardService) { }

  ngOnInit(): void {
  }

}
