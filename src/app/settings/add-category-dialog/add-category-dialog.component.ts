import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

export interface DialogData {
  name: string
}

@Component({
  selector: 'app-add-category-dialog',
  templateUrl: 'add-category-dialog.component.html',
  styleUrls: ['add-category-dialog.component.scss']
})
export class AddCategoryDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AddCategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}