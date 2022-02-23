import { BasicControl } from 'src/app/global/controls/basicControl';
import { BoardService } from 'src/app/features/board.service';
import { Control } from 'src/app/global/controls/control';
import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { Board } from 'src/app/global/board/board';

@Component({
  selector: 'app-clear-control',
  templateUrl: './clear-control.component.html',
  styleUrls: ['./clear-control.component.scss']
})
export class ClearControlComponent extends BasicControl implements AfterViewInit {

  @Input() board!: Board;

  @Input() enabled = true;

  public onClick = () => {
    
  }

  constructor() {
    super();
  }

  ngAfterViewInit(): void {
    this.afterViewInit.emit();
  }

}
