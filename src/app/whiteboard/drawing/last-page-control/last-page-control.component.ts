import { BasicControl } from 'src/app/global/controls/basicControl';
import { Board } from 'src/app/global/board/board';
import { Component, Input, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-last-page-control',
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
