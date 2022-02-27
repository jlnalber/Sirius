import { MatDialog } from '@angular/material/dialog';
import { BottomControl } from 'src/app/global/controls/bottomControl';
import { Board } from 'src/app/global/board/board';
import { BasicControl } from 'src/app/global/controls/basicControl';
import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { BackgroundDialogComponent } from './background-dialog/background-dialog.component';

@Component({
  selector: 'app-background-control',
  templateUrl: './background-control.component.html',
  styleUrls: ['./background-control.component.scss']
})
export class BackgroundControlComponent extends BasicControl implements AfterViewInit {

  @Input() board!: Board;
  @Input() enabled = true;

  public onClick = () => {
    this.dialog.open(BackgroundDialogComponent, {
      width: '500px',
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
