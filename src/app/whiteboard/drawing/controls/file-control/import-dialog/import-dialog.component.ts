import { Board } from './../../../../global-whiteboard/board/board';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Event } from 'src/app/whiteboard/global-whiteboard/essentials/event';

export interface DialogData {
  board: Board
}

@Component({
  selector: 'app-import-dialog',
  templateUrl: './import-dialog.component.html',
  styleUrls: ['./import-dialog.component.scss']
})
export class ImportDialogComponent implements OnInit {

  reloadEvent: Event = new Event();

  constructor(
    public dialogRef: MatDialogRef<ImportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
  }

  addPhoto = (photo: string) => {
    this.data.board.addPhoto(photo);
    this.dialogRef.close(this.data);
  }

  tabSelectionChanged() {
    this.reloadEvent.emit();
  }
  
  public openFile() {
    try {
      let inp = document.getElementById('inp') as HTMLInputElement;

      if (inp.files) {
        for (let i = 0; i < inp.files.length; i++) {
          const file = inp.files.item(i);
          this.data.board.addFile(file);
        }

        this.dialogRef.close();
      }
    }
    catch { }
  }

}
