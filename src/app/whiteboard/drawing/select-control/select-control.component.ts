import { BoardModes, BoardService } from 'src/app/features/board.service';
import { Control } from 'src/app/global/control';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-select-control',
  templateUrl: './select-control.component.html',
  styleUrls: ['./select-control.component.scss']
})
export class SelectControlComponent extends Control implements OnInit {

  constructor(boardService: BoardService) {
    super(boardService, BoardModes.Select);
  }

  ngOnInit(): void {
  }

}
