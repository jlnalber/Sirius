import { Component, Input, AfterViewInit } from '@angular/core';
import { Board, BoardModes } from 'src/app/whiteboard/global-whiteboard/board/board';
import { Control } from 'src/app/whiteboard/global-whiteboard/controls/control';

@Component({
  selector: 'whiteboard-pen-control',
  templateUrl: './pen-control.component.html',
  styleUrls: ['./pen-control.component.scss']
})
export class PenControlComponent extends Control implements AfterViewInit {

  @Input() board!: Board;

  @Input() enabled = true;

  constructor() {
    super(BoardModes.Draw);
  }

  ngAfterViewInit(): void {
    this.afterViewInit.emit();
  }

}
