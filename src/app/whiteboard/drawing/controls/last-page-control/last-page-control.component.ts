import { Component, Input, AfterViewInit } from '@angular/core';
import { Board } from 'src/app/whiteboard/global-whiteboard/board/board';
import { BasicControl } from 'src/app/whiteboard/global-whiteboard/controls/basicControl';

@Component({
  selector: 'whiteboard-last-page-control',
  templateUrl: './last-page-control.component.html',
  styleUrls: ['./last-page-control.component.scss']
})
export class LastPageControlComponent extends BasicControl implements AfterViewInit {

  @Input() board!: Board;

  @Input() enabled = true;

  public onClick = () => {
    this.board.currentPageIndex--;
  }

  constructor() {
    super();

    this.enabledRules.addRule(() => {
      return this.board.currentPageIndex > 0;
    });
  }

  ngAfterViewInit(): void {
    this.afterViewInit.emit();
  }

}
