import { BoardModes, BoardService } from 'src/app/features/board.service';
import { Control } from 'src/app/global/controls/control';
import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { Board } from 'src/app/global/board/board';

@Component({
  selector: 'app-select-control',
  templateUrl: './select-control.component.html',
  styleUrls: ['./select-control.component.scss']
})
export class SelectControlComponent extends Control implements AfterViewInit {

  @Input() board!: Board;

  @Input() enabled = true;

  constructor() {
    super(BoardModes.Select);
  }

  ngAfterViewInit(): void {
    this.afterViewInit.emit();
  }

}
