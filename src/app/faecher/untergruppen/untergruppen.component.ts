import { MappenManagerService } from '../global/services/mappen-manager.service';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {Gruppe} from "../global/interfaces/fach";

@Component({
  selector: 'faecher-untergruppen',
  templateUrl: './untergruppen.component.html',
  styleUrls: ['./untergruppen.component.scss']
})
export class UntergruppenComponent implements OnInit {
  @Input()
  oberElement: { gruppen: string[] } | undefined = undefined;

  public get untergruppenObjects(): Gruppe[] {
    return this.oberElement?.gruppen.map(s => this.faecherService.getGruppeById(s)).filter(g => g !== undefined) as Gruppe[] | undefined ?? [];
  }

  constructor(public dialog: MatDialog, private readonly faecherService: MappenManagerService) { }

  ngOnInit(): void {
  }

  public addEinheit(topic: string, description: string): void {
    if (this.oberElement) {
      this.faecherService.getGruppeFromData(this.oberElement, topic, description);
    }
  }

  public openDialog(): void {
    const dialogRef = this.dialog.open(UntergruppenDialogComponent, {
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

  getText(gruppe: Gruppe): string {

    let getUnfinishedTasksLength = (gruppe: Gruppe): number => {
      let counter = 0;
      for (let task of gruppe.tasks) {
        if (!task.closed) counter++;
      }
      return counter;
    }

    let getFinishedTasksLength = (gruppe: Gruppe): number => {
      let counter = 0;
      for (let task of gruppe.tasks) {
        if (task.closed) counter++;
      }
      return counter;
    }

    let res = '';
    let tasks = gruppe.tasks.length;
    let files = gruppe.files.length;
    let whiteboards = gruppe.whiteboards.length;
    let editors = gruppe.editors.length;

    if (tasks == 0) {
      res += 'Keine Aufgaben, '
    }
    else if (tasks == 1) {
      if (getUnfinishedTasksLength(gruppe) == 1) {
        res += 'Eine offene Aufgabe, ';
      }
      else {
        res += 'Eine abgeschlossene Aufgabe, '
      }
    }
    else {
      res += `${tasks} Aufgaben, davon ${getUnfinishedTasksLength(gruppe)} noch offen und ${getFinishedTasksLength(gruppe)} abgeschlossen, `;
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
      res += 'keine Whiteboards und '
    }
    else if (whiteboards == 1) {
      res += 'ein Whiteboard und '
    }
    else {
      res += `${whiteboards} Whiteboards und `
    }
    if (editors == 0) {
      res += 'keine Aufschriebe.'
    }
    else if (editors == 1) {
      res += 'ein Aufschrieb.'
    }
    else {
      res += `${editors} Aufschriebe.`
    }

    return res;
  }

}

export interface DialogData {
  topic: string,
  description: string,
  edit?: boolean
}

@Component({
  selector: 'faecher-untergruppen-dialog',
  templateUrl: 'untergruppen-dialog.html',
  styleUrls: ['untergruppen-dialog.scss']
})
export class UntergruppenDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<UntergruppenDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
