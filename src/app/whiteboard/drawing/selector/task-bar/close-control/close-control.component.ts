import { Board } from './../../../../global-whiteboard/board/board';
import { BasicControl } from 'src/app/whiteboard/global-whiteboard/controls/basicControl';
import { Component, AfterViewInit, Input } from '@angular/core';

@Component({
  selector: 'whiteboard-close-control',
  templateUrl: './close-control.component.html',
  styleUrls: ['./close-control.component.scss']
})
export class CloseControlComponent extends BasicControl implements AfterViewInit {

  @Input() board!: Board;

  @Input() enabled = true;

  public onClick = () => {
    if (this.board.selector) {
      this.board.selector.svgEl = undefined;
    }
  }


  constructor() {
    super();
  }
  
  ngAfterViewInit(): void {
      this.afterViewInit.emit();
  }

}
