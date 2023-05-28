import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MappenManagerService } from './global/services/mappen-manager.service';

@Component({
  selector: 'faecher-mappe',
  templateUrl: './mappen.component.html',
  styleUrls: ['./mappen.component.scss']
})
export class MappenComponent {

  constructor(public mappenManager: MappenManagerService, public dialog: MatDialog) { }

  public openDialog(): void {
    const dialogRef = this.dialog.open(MappenDialogComponent, {
      width: '500px',
      data: {
        name: '',
        description: ''
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined && result != "") {
        let res = result as DialogData;
        this.mappenManager.addMappeWithData(res.name, res.description);
      }
    });
  }

}

export interface DialogData {
  name: string,
  description: string,
  edit?: boolean
}

@Component({
  selector: 'faecher-mappen-dialog',
  templateUrl: 'mappen-dialog.html',
  styleUrls: ['mappen-dialog.scss']
})
export class MappenDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<MappenDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
