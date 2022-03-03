import { Component, Input, AfterViewInit } from '@angular/core';
import { Board } from 'src/app/whiteboard/global-whiteboard/board/board';
import { BasicControl } from 'src/app/whiteboard/global-whiteboard/controls/basicControl';

@Component({
  selector: 'whiteboard-next-page-control',
  templateUrl: './next-page-control.component.html',
  styleUrls: ['./next-page-control.component.scss']
})
export class NextPageControlComponent extends BasicControl implements AfterViewInit {

  @Input() board!: Board;

  @Input() enabled = true;

  public onClick = () => {
    this.board.currentPageIndex++;
  }

  constructor() {
    super();

    this.enabledRules.addRule(() => {
      return this.board.currentPageIndex < this.board.pages.length - 1;
    })
  }

  ngAfterViewInit(): void {
  }

}
