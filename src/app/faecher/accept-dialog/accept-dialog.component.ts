import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';

export interface DialogData {
  header: string,
  description: string
}

@Component({
  selector: 'faecher-accept-dialog',
  templateUrl: './accept-dialog.component.html',
  styleUrls: ['./accept-dialog.component.scss']
})
export class AcceptDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AcceptDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close(); 
  }

}
