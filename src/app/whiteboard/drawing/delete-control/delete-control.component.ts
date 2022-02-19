import { BoardModes, BoardService } from 'src/app/features/board.service';
import { Control } from 'src/app/global/control';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-delete-control',
  templateUrl: './delete-control.component.html',
  styleUrls: ['./delete-control.component.scss']
})
export class DeleteControlComponent extends Control implements OnInit {

  constructor(boardService: BoardService) {
    super(boardService, BoardModes.Delete);
  }

  ngOnInit(): void {
  }

}
