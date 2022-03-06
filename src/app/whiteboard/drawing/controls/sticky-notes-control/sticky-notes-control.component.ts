import { MatDialog } from '@angular/material/dialog';
import { AfterViewInit, Component, Input } from '@angular/core';
import { Board } from 'src/app/whiteboard/global-whiteboard/board/board';
import { BasicControl } from 'src/app/whiteboard/global-whiteboard/controls/basicControl';
import { DialogData, StickyNotesDialogComponent } from './sticky-notes-dialog/sticky-notes-dialog.component';
import { Color } from 'src/app/whiteboard/global-whiteboard/essentials/color';

@Component({
  selector: 'whiteboard-sticky-notes-control',
  templateUrl: './sticky-notes-control.component.html',
  styleUrls: ['./sticky-notes-control.component.scss']
})
export class StickyNotesControlComponent extends BasicControl implements AfterViewInit {

  @Input() board!: Board;

  @Input() enabled = true;

  public onClick = () => {
    const dialogRef = this.dialog.open(StickyNotesDialogComponent, {
      width: '500px',
      data: { 
        color: new Color(255, 255, 255),
        text: ''
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined && result != "") {
        let res = result as DialogData;
        let textColor = res.color.isBright() ? new Color(0, 0, 0) : new Color(255, 255, 255);
        this.board.addStickyNote(res.text, res.color, textColor);
      }
    });
  }

  constructor(private readonly dialog: MatDialog) {
    super();
  }

  ngAfterViewInit(): void {
    this.afterViewInit.emit();
  }

}