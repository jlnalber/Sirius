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
    enableClearControl: true,
    enableDeleteControl: true,
    enableMenuControl: true,
    enableFileControl: true,
    enableForwardControl: true,
    enableLastPageControl: true,
    enableMoveControl: true,
    enableNewPageControl: true,
    enableNextPageControl: true,
    enablePenControl: true,
    enableSelectControl: true,
    enableShapeControl: true
  }

  constructor(private readonly boardService: BoardService) {
    this.board = this.boardService.addBoard();
  }

  ngOnInit(): void {
  }

}
