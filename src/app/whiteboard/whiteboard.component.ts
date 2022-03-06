import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { Board } from './global-whiteboard/board/board';
import { WhiteboardConfig } from './global-whiteboard/interfaces/whiteboard.config';
import { BoardService } from './services/board.service';

@Component({
  selector: 'whiteboard-whiteboard',
  templateUrl: './whiteboard.component.html',
  styleUrls: ['./whiteboard.component.scss']
})
export class WhiteboardComponent implements AfterViewInit {

  public board: Board;

  @Input() afterViewInit: (board: Board) => void = (b: Board) => { };

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
    enableShapeControl: true,
    enableStickyNotesControl: true
  }

  constructor(private readonly boardService: BoardService) {
    this.board = this.boardService.addBoard();
  }

  ngAfterViewInit(): void {
    // Set a timeout to trigger the function because it might change the view after it has been checked by angular
    setTimeout(() => {
      this.afterViewInit(this.board);
    }, 0);
  }

}
