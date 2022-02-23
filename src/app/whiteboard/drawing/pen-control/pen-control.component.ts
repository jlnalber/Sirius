import { Board } from 'src/app/global/board/board';
import { Stroke } from './../../../global/stroke';
import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { BoardService, BoardModes } from 'src/app/features/board.service';
import { Control } from 'src/app/global/controls/control';

@Component({
  selector: 'app-pen-control',
  templateUrl: './pen-control.component.html',
  styleUrls: ['./pen-control.component.scss']
})
export class PenControlComponent extends Control implements AfterViewInit {

  @Input() board!: Board;

  @Input() enabled = true;

  constructor() {
    super(BoardModes.Draw);
  }

  ngAfterViewInit(): void {
    this.afterViewInit.emit();
  }

}
