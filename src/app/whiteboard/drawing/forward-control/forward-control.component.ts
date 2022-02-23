import { BasicControl } from 'src/app/global/controls/basicControl';
import { Board } from 'src/app/global/board/board';
import { Component, Input, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-forward-control',
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
