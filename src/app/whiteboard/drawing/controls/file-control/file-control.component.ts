import { ImportDialogComponent } from './import-dialog/import-dialog.component';
import { Component, Input, AfterViewInit } from '@angular/core';
import { BasicControl } from 'src/app/whiteboard/global-whiteboard/controls/basicControl';
import { Board } from 'src/app/whiteboard/global-whiteboard/board/board';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'whiteboard-file-control',
  templateUrl: './file-control.component.html',
  styleUrls: ['./file-control.component.scss']
})
export class FileControlComponent extends BasicControl implements AfterViewInit {

  @Input() board!: Board;

  @Input() enabled = true;

  public onClick = () => {
    const dialogRef = this.dialog.open(ImportDialogComponent, {
      data: { 
        board: this.board
      }
    });
  }

  /*public openFile() {
    try {
      let inp = document.getElementById('inp') as HTMLInputElement;
      const file = inp.files?.item(0);
      this.board.addFile(file);
    }
    catch { }
  }*/

  constructor(private readonly dialog: MatDialog) {
    super();
  }

  ngAfterViewInit(): void {
    this.afterViewInit.emit();
  }

}
