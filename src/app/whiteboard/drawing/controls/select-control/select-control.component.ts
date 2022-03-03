import { Component, Input, AfterViewInit } from '@angular/core';
import { Board, BoardModes } from 'src/app/whiteboard/global-whiteboard/board/board';
import { Control } from 'src/app/whiteboard/global-whiteboard/controls/control';

@Component({
  selector: 'whiteboard-select-control',
  templateUrl: './select-control.component.html',
  styleUrls: ['./select-control.component.scss']
})
export class SelectControlComponent extends Control implements AfterViewInit {

  @Input() board!: Board;

  @Input() enabled = true;

  constructor() {
    super(BoardModes.Select);
  }

  ngAfterViewInit(): void {
    this.afterViewInit.emit();
  }

}
