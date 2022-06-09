import { Component, Input, AfterViewInit } from '@angular/core';
import { Board } from 'src/app/whiteboard/global-whiteboard/board/board';
import { BottomControl } from 'src/app/whiteboard/global-whiteboard/controls/bottomControl';
import { WhiteboardMenuControlsConfig } from 'src/app/whiteboard/global-whiteboard/interfaces/whiteboard.config';

@Component({
  selector: 'whiteboard-menu-control',
  templateUrl: './menu-control.component.html',
  styleUrls: ['./menu-control.component.scss']
})
export class MenuControlComponent extends BottomControl implements AfterViewInit {

  @Input() board!: Board;

  @Input() enabled = true;
  @Input() whiteboardMenuControlsConfig: WhiteboardMenuControlsConfig = {
    fullscreenControl: true,
    backgroundControl: true,
    formatControl: true,
    exportAsPDFControl: true,
    exportAsBitmapControl: true, 
    exportAsSvgControl: true,
    saveControl: true
  };

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
    this.board.onMouse.addListener(() => {
      this.openPanel = false;
    })
    this.board.onTouch.addListener(() => {
        this.openPanel = false;
    })
    this.board.onBoardAnyModeChange.addListener(() => {
        this.openPanel = false;
    })
  }

}
