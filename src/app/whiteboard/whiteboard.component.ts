import { WhiteboardConfig } from './../interfaces/whiteboard.config';
import { BoardService } from 'src/app/features/board.service';
import { Component, Input, OnInit, enableProdMode } from '@angular/core';
import { Color } from '../global/color';
import { Stroke } from '../global/stroke';
import { Board } from '../global/board/board';

@Component({
  selector: 'app-whiteboard',
  templateUrl: './whiteboard.component.html',
  styleUrls: ['./whiteboard.component.scss']
})
export class WhiteboardComponent implements OnInit {

  public board: Board;

  @Input() whiteboardConfig: WhiteboardConfig = {
    showBottomBar: true,
    enableBackControl: true,
    enableClearControl: false,
    enableDeleteControl: true,
    enableMenuControl: true,
    enableFileControl: false,
    enableForwardControl: true,
    enableLastPageControl: false,
    enableMoveControl: true,
    enableNewPageControl: false,
    enableNextPageControl: false,
    enablePenControl: true,
    enableSelectControl: false,
    enableShapeControl: true
  }

  constructor(private readonly boardService: BoardService) {
    this.board = this.boardService.addBoard();
  }

  ngOnInit(): void {
  }

}
