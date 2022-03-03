import { Component, Input, AfterViewInit } from '@angular/core';
import { Board } from 'src/app/whiteboard/global-whiteboard/board/board';
import { BasicControl } from 'src/app/whiteboard/global-whiteboard/controls/basicControl';

@Component({
  selector: 'whiteboard-forward-control',
  templateUrl: './forward-control.component.html',
  styleUrls: ['./forward-control.component.scss']
})
export class ForwardControlComponent extends BasicControl implements AfterViewInit {

  @Input() board!: Board;

  @Input() enabled = true;

  public onClick = () => {
    this.board.goForward();
  }

  constructor() {
    super();

    this.enabledRules.addRule(() => {
      return this.board.canGoForward();
    })
  }

  ngAfterViewInit(): void {
    this.afterViewInit.emit();
  }

}
