import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  name: string
}

@Component({
  selector: 'app-add-whiteboard-dialog',
  templateUrl: './add-whiteboard-dialog.component.html',
  styleUrls: ['./add-whiteboard-dialog.component.scss']
})
export class AddWhiteboardDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AddWhiteboardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}