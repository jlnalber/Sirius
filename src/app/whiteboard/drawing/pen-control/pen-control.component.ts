import { Stroke } from './../../../global/stroke';
import { Component, Input, OnInit } from '@angular/core';
import { BoardService, BoardModes } from 'src/app/features/board.service';
import { Control } from 'src/app/global/control';

@Component({
  selector: 'app-pen-control',
  templateUrl: './pen-control.component.html',
  styleUrls: ['./pen-control.component.scss']
})
export class PenControlComponent extends Control implements OnInit {

  constructor(boardService: BoardService) {
    super(boardService, BoardModes.Draw);
  }

  ngOnInit(): void {
  }

}
