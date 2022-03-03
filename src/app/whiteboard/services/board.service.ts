import { WhiteboardModule } from './../whiteboard.module';
import { Injectable } from '@angular/core';
import { Board } from '../global-whiteboard/board/board';

@Injectable({
  providedIn: WhiteboardModule
})
export class BoardService {

  public boards: Board[] = [];

  public addBoard() {
    let board = new Board();
    this.boards.push(board);
    return board;
  }

  constructor() { }
  
}
