import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Color } from 'src/app/whiteboard/global-whiteboard/essentials/color';
import { Color as IColor } from 'src/app/whiteboard/global-whiteboard/interfaces/whiteboard';

export interface DialogData {
  color: Color | IColor
}

@Component({
  selector: 'whiteboard-color-picker-dialog',
  templateUrl: './color-picker-dialog.component.html',
  styleUrls: ['./color-picker-dialog.component.scss']
})
export class ColorPickerDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ColorPickerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) { }

  ngOnInit(): void {
  }

  onNoClick() {
    this.dialogRef.close();
  }

}
