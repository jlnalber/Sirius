import { Board } from 'src/app/global/board/board';
import { BoardModes, BoardService } from 'src/app/features/board.service';
import { Control } from 'src/app/global/controls/control';
import { Component, Input, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-delete-control',
  templateUrl: './delete-control.component.html',
  styleUrls: ['./delete-control.component.scss']
})
export class DeleteControlComponent extends Control implements AfterViewInit {

  @Input() board!: Board;

  @Input() enabled = true;

  constructor() {
    super(BoardModes.Delete);
  }

  ngAfterViewInit(): void {
    this.afterViewInit.emit();
  }

}
