import { Component, Input, AfterViewInit } from '@angular/core';
import { Board } from 'src/app/whiteboard/global-whiteboard/board/board';
import { BottomControl } from 'src/app/whiteboard/global-whiteboard/controls/bottomControl';

@Component({
  selector: 'whiteboard-menu-control',
  templateUrl: './menu-control.component.html',
  styleUrls: ['./menu-control.component.scss']
})
export class MenuControlComponent extends BottomControl implements AfterViewInit {

  @Input() board!: Board;

  @Input() enabled = true;

  public openPanel: boolean = false;

  public override isActive = () => {
    return this.openPanel;
  }

  protected override secondClick = () => {
    this.openPanel = true;
  };

  protected firstClick?: () => void = () => {
    this.openPanel = false;
  }

  constructor() {
    super();
  }

  ngAfterViewInit(): void {
    this.afterViewInit.emit();
    this.board.onTouchStart.addListener(() => {
      this.openPanel = false;
    })
  }

}