import { FormatDialogComponent } from './format-dialog/format-dialog.component';
import { AfterViewInit, Component, Input } from '@angular/core';
import { Board } from 'src/app/whiteboard/global-whiteboard/board/board';
import { BasicControl } from 'src/app/whiteboard/global-whiteboard/controls/basicControl';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'whiteboard-format-control',
  templateUrl: './format-control.component.html',
  styleUrls: ['./format-control.component.scss']
})
export class FormatControlComponent extends BasicControl implements AfterViewInit {

  @Input() board!: Board;
  @Input() enabled = true;

  public onClick = () => {
    this.dialog.open(FormatDialogComponent, {
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
