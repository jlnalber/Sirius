import { Component, Input, OnInit, AfterViewInit, Output, HostListener } from '@angular/core';
import { Board } from './global-whiteboard/board/board';
import { Handler } from './global-whiteboard/essentials/handler';
import { Whiteboard } from './global-whiteboard/interfaces/whiteboard';
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

  @HostListener('touchmove', ['$event'])
  onTouchMove(evt: any) {
    //In this case, the default behavior is scrolling the body, which
    //would result in an overflow.  Since we don't want that, we preventDefault.
    if(!evt._isScroller && evt.preventDefault) {
      evt.preventDefault()
    }
  }

  @HostListener('dblclick', ['$event'])
  onDblClick(evt: any) {
    if (evt.preventDefault) {
      evt.preventDefault();
    }
  }

  constructor(private readonly boardService: BoardService) {
    this.board = this.boardService.addBoard();
  }

  ngAfterViewInit(): void {
    if (this.export != undefined) {
      this.export.handler = () => {
        return this.board.export();
      }
    }

    // Set a timeout to trigger the function because it might change the view after it has been checked by angular
    setTimeout(() => {
      this.afterViewInit(this.board);
    }, 0);
  }

  @Input() export: Handler<Whiteboard> | undefined;

}
