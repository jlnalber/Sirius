import { Control } from 'src/app/global/control';
import { Component, OnInit } from '@angular/core';
import { BoardModes, BoardService } from 'src/app/features/board.service';

@Component({
  selector: 'app-shape-control',
  templateUrl: './shape-control.component.html',
  styleUrls: ['./shape-control.component.scss']
})
export class ShapeControlComponent extends Control implements OnInit {

  constructor(boardService: BoardService) {
    super(boardService, BoardModes.Shape);
  }

  ngOnInit(): void {
  }

}
