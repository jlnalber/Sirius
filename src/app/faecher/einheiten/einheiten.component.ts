import { FaecherManagerService } from 'src/app/faecher/global/services/faecher-manager.service';
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

  constructor(public dialog: MatDialog, private readonly faecherService: FaecherManagerService) { }

  ngOnInit(): void {
  }

  public addEinheit(topic: string, description: string): void {
    this.einheiten?.push(this.faecherService.getEinheitFromData(topic, description));
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

  getText(einheit: Einheit): string {

    let getUnfinishedTasksLength = (einheit: Einheit): number => {
      let counter = 0;
      for (let task of einheit.tasks) {
        if (!task.closed) counter++;
      }
      return counter;
    }
  
    let getFinishedTasksLength = (einheit: Einheit): number => {
      let counter = 0;
      for (let task of einheit.tasks) {
        if (task.closed) counter++;
      }
      return counter;
    }

    let res = '';
    let tasks = einheit.tasks.length;
    let files = einheit.files.length;
    let whiteboards = einheit.whiteboards.length;

    if (tasks == 0) {
      res += 'Keine Aufgaben, '
    }
    else if (tasks == 1) {
      if (getUnfinishedTasksLength(einheit) == 1) {
        res += 'Eine offene Aufgabe, ';
      }
      else {
        res += 'Eine abgeschlossene Aufgabe, '
      }
    }
    else {
      res += `${tasks} Aufgaben, davon ${getUnfinishedTasksLength(einheit)} noch offen und ${getFinishedTasksLength(einheit)} abgeschlossen, `;
    }
    if (files == 0) {
      res += 'keine Dateien, '
    }
    else if (files == 1) {
      res += 'eine Datei, '
    }
    else {
      res += `${files} Dateien, `;
    }
    if (whiteboards == 0) {
      res += 'keine Whiteboards.'
    }
    else if (whiteboards == 1) {
      res += 'ein Whiteboard.'
    }
    else {
      res += `${whiteboards} Whiteboards.`
    }

    return res;
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