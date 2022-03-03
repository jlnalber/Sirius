import { Component, Input, AfterViewInit } from '@angular/core';
import { Board } from 'src/app/whiteboard/global-whiteboard/board/board';
import { BasicControl } from 'src/app/whiteboard/global-whiteboard/controls/basicControl';

@Component({
  selector: 'whiteboard-back-control',
  templateUrl: './back-control.component.html',
  styleUrls: ['./back-control.component.scss']
})
export class BackControlComponent extends BasicControl implements AfterViewInit {

  @Input() board!: Board;

  @Input() enabled = true;

  public onClick = () => {
    this.board.goBack();
  }

  constructor() {
    super();
    
    this.enabledRules.addRule(() => {
      return this.board.canGoBack();
    })
  }

  ngAfterViewInit(): void {
    this.afterViewInit.emit();
  }

}
