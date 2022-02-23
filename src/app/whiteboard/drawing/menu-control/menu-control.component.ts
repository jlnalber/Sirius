import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { BoardService } from 'src/app/features/board.service';
import { Board } from 'src/app/global/board/board';
import { BottomControl } from 'src/app/global/controls/bottomControl';

@Component({
  selector: 'app-menu-control',
  templateUrl: './menu-control.component.html',
  styleUrls: ['./menu-control.component.scss']
})
export class MenuControlComponent extends BottomControl implements AfterViewInit {

  @Input() board!: Board;

  @Input() enabled = true;

  public openPanel: boolean = false;

  public override isOpen = () => {
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
