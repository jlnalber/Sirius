import { Color } from 'src/app/whiteboard/global-whiteboard/essentials/color';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  color: Color,
  text: string
}

@Component({
  selector: 'whiteboard-sticky-notes-dialog',
  templateUrl: './sticky-notes-dialog.component.html',
  styleUrls: ['./sticky-notes-dialog.component.scss']
})
export class StickyNotesDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<StickyNotesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  listener = (c: Color) => {
    this.data.color = c;
  }

  currentColor = () => {
    return this.data.color;
  }

  ngOnInit(): void {
  }

  getTextColor(): string {
    if (this.data.color.isBright()) {
      return '#000';
    }
    return '#FFF';
  }

}
