import { Component, Input, AfterViewInit } from '@angular/core';
import { Board } from 'src/app/whiteboard/global-whiteboard/board/board';
import { BasicControl } from 'src/app/whiteboard/global-whiteboard/controls/basicControl';

@Component({
  selector: 'whiteboard-clear-control',
  templateUrl: './clear-control.component.html',
  styleUrls: ['./clear-control.component.scss']
})
export class ClearControlComponent extends BasicControl implements AfterViewInit {

  @Input() board!: Board;

  @Input() enabled = true;

  public onClick = () => {
    this.board.clear();
  }

  constructor() {
    super();
  }

  ngAfterViewInit(): void {
    this.afterViewInit.emit();
  }

}
