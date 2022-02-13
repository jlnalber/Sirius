import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Fach } from '../interfaces/fach';
import { FaecherManagerService } from '../shared/faecher-manager.service';

@Component({
  selector: 'app-faecher',
  templateUrl: './faecher.component.html',
  styleUrls: ['./faecher.component.scss']
})
export class FaecherComponent implements OnInit {

  constructor(public faecherManager: FaecherManagerService, public dialog: MatDialog) { }

  ngOnInit(): void {
    
  }
  
  public openDialog(): void {
    const dialogRef = this.dialog.open(FaecherDialogComponent, {
      width: '500px',
      data: { 
        name: '',
        description: '' 
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined && result != "") {
        let res = result as DialogData;
        this.faecherManager.addFachWithData(res.name, res.name, res.description);
      }
    });
  }
  
}

export interface DialogData {
  name: string,
  description: string
}

@Component({
  selector: 'app-faecher-dialog',
  templateUrl: 'faecher-dialog.html',
  styleUrls: ['faecher-dialog.scss']
})
export class FaecherDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<FaecherDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}