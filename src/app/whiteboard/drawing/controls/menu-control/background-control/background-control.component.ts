import { MatDialog } from '@angular/material/dialog';
import { Component, Input, AfterViewInit } from '@angular/core';
import { BackgroundDialogComponent } from './background-dialog/background-dialog.component';
import { BasicControl } from 'src/app/whiteboard/global-whiteboard/controls/basicControl';
import { Board } from 'src/app/whiteboard/global-whiteboard/board/board';

@Component({
  selector: 'whiteboard-background-control',
  templateUrl: './background-control.component.html',
  styleUrls: ['./background-control.component.scss']
})
export class BackgroundControlComponent extends BasicControl implements AfterViewInit {

  @Input() board!: Board;
  @Input() enabled = true;

  public onClick = () => {
    this.dialog.open(BackgroundDialogComponent, {
      width: '530px',
      data: { 
        board: this.board
      }
    });
  }

  constructor(public dialog: MatDialog) {
    super();
  }

  ngAfterViewInit(): void {
    this.afterViewInit.emit();
  }

}
