import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DialogData {
  name: string
}

@Component({
  selector: 'faecher-add-editor-dialog',
  templateUrl: './add-editor-dialog.component.html',
  styleUrls: ['./add-editor-dialog.component.scss']
})
export class AddEditorDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AddEditorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
