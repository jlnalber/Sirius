import { Component, Input, AfterViewInit } from '@angular/core';
import { Board } from 'src/app/whiteboard/global-whiteboard/board/board';
import { BasicControl } from 'src/app/whiteboard/global-whiteboard/controls/basicControl';

@Component({
  selector: 'whiteboard-new-page-control',
  templateUrl: './new-page-control.component.html',
  styleUrls: ['./new-page-control.component.scss']
})
export class NewPageControlComponent extends BasicControl implements AfterViewInit {

  @Input() board!: Board;

  @Input() enabled = true;

  public onClick = () => {
    this.board.addPage();
  }

  constructor() {
    super();
  }

  ngAfterViewInit(): void {
    this.afterViewInit.emit();
  }

}
