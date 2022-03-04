import { Component, Input, OnInit, AfterViewInit, AfterContentInit } from '@angular/core';
import { Board } from './global-whiteboard/board/board';
import { WhiteboardConfig } from './global-whiteboard/interfaces/whiteboard.config';
import { BoardService } from './services/board.service';

@Component({
  selector: 'whiteboard-whiteboard',
  templateUrl: './whiteboard.component.html',
  styleUrls: ['./whiteboard.component.scss']
})
export class WhiteboardComponent implements AfterViewInit, AfterContentInit {

  public board: Board;

  @Input() onInit: (board: Board) => void = (b: Board) => { };

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
    //this.onInit(this.board);
  }

  ngAfterViewInit(): void {
    this.onInit(this.board);
  }

  ngAfterContentInit(): void {
    // this.onInit(this.board);
  }

}
