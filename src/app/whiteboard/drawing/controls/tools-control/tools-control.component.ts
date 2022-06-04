import { BottomControl } from 'src/app/whiteboard/global-whiteboard/controls/bottomControl';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { BasicControl } from 'dist/whiteboard/lib/global-whiteboard/controls/basicControl';
import { Board } from 'src/app/whiteboard/global-whiteboard/board/board';

@Component({
  selector: 'whiteboard-tools-control',
  templateUrl: './tools-control.component.html',
  styleUrls: ['./tools-control.component.scss']
})
export class ToolsControlComponent extends BottomControl implements AfterViewInit {

  public isActive: () => boolean = () => {
    return this.board.linealOpen;
  };
  protected secondClick: () => void = () => {
    this.board.linealOpen = true;
  };
  protected firstClick?: () => void = () => {
    this.board.linealOpen = false;
  };

  @Input() enabled: boolean = true;

  @Input() board!: Board;

  constructor() { 
    super();
  }

  ngAfterViewInit(): void {
      this.afterViewInit.emit();
  }

}
