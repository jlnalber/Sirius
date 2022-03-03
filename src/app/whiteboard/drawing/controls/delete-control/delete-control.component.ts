import { Component, Input, AfterViewInit } from '@angular/core';
import { Board, BoardModes } from 'src/app/whiteboard/global-whiteboard/board/board';
import { Control } from 'src/app/whiteboard/global-whiteboard/controls/control';

@Component({
  selector: 'whiteboard-delete-control',
  templateUrl: './delete-control.component.html',
  styleUrls: ['./delete-control.component.scss']
})
export class DeleteControlComponent extends Control implements AfterViewInit {

  @Input() board!: Board;

  @Input() enabled = true;

  constructor() {
    super(BoardModes.Delete);
  }

  ngAfterViewInit(): void {
    this.afterViewInit.emit();
  }

}
