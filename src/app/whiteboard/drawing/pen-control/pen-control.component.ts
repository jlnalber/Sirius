import { Stroke } from './../../../global/stroke';
import { Component, Input, OnInit } from '@angular/core';
import { BoardService, BoardModes } from 'src/app/features/board.service';

@Component({
  selector: 'app-pen-control',
  templateUrl: './pen-control.component.html',
  styleUrls: ['./pen-control.component.scss']
})
export class PenControlComponent implements OnInit {

  active: boolean = false;

  public isDrawing(): boolean {
    let res = this.boardService.mode == BoardModes.Draw;
    if (!res && !this.active) this.active = true;
    return res;
  }

  public click(): void {
    this.active = !this.active;
    this.boardService.mode = BoardModes.Draw;
  }

  constructor(public readonly boardService: BoardService) { }

  ngOnInit(): void {
  }

}
