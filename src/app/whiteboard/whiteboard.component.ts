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
    enableStickyNotesControl: true,
    enablePagesControl: true,
    enableToolsControl: true,
    menuControls: {
      fullscreenControl: true,
      backgroundControl: true,
      formatControl: true,
      exportAsPDFControl: true,
      exportAsBitmapControl: true,
      exportAsSvgControl: true,
      saveControl: true
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

  @HostListener('dragover', ['$event']) onDragOver(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
  }

  @HostListener('dragleave', ['$event']) onDragLeave(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
  }

  @HostListener('drop', ['$event']) onDrop(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    const files = evt.dataTransfer?.files;
    this.openFiles(files);
  }

  openFiles(files?: FileList) {
    if (files) {
      for (let i in files) {
        this.board.addFile(files[i]);
      }
    }
  }

}