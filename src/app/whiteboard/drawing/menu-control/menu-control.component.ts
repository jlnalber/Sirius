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

  public override isOpen = () => {
    return true;
  }

  protected override secondClick = () => { };

  constructor() {
    super();
  }

  ngAfterViewInit(): void {
    this.afterViewInit.emit();
  }

}
