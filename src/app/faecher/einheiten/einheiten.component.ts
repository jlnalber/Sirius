import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Einheit } from 'src/app/faecher/global/interfaces/fach';

@Component({
  selector: 'faecher-einheiten',
  templateUrl: './einheiten.component.html',
  styleUrls: ['./einheiten.component.scss']
})
export class EinheitenComponent implements OnInit {
  @Input()
  einheiten: Einheit[] | undefined = [];

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  public addEinheit(topic: string, description: string): void {
    this.einheiten?.push({
      id: topic,
      topic: topic,
      description: description,
      tasks: [],
      notes: '',
      files: []
    });
  }

  public removeEinheit(einheit: Einheit): boolean {
    const index = this.einheiten?.indexOf(einheit, 0);
    if (index != undefined && index > -1) {
      this.einheiten?.splice(index, 1);
      return true;
    }
    return false;
  }
  
  public openDialog(): void {
    const dialogRef = this.dialog.open(EinheitenDialogComponent, {
      width: '500px',
      data: { 
        topic: '',
        description: '' 
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined && result != "") {
        let res = result as DialogData;
        this.addEinheit(res.topic, res.description);
      }
    });
  }

}

export interface DialogData {
  topic: string,
  description: string
}

@Component({
  selector: 'faecher-einheiten-dialog',
  templateUrl: 'einheiten-dialog.html',
  styleUrls: ['einheiten-dialog.scss']
})
export class EinheitenDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EinheitenDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}