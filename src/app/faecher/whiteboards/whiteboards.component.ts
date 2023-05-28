import { AddWhiteboardDialogComponent, DialogData } from './add-whiteboard-dialog/add-whiteboard-dialog.component';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ElectronService } from 'ngx-electron';
import {Gruppe, Whiteboard} from '../global/interfaces/fach';
import { MappenManagerService } from '../global/services/mappen-manager.service';

@Component({
  selector: 'faecher-whiteboards',
  templateUrl: './whiteboards.component.html',
  styleUrls: ['./whiteboards.component.scss']
})
export class WhiteboardsComponent implements OnInit {

  @Input()
  whiteboards: Whiteboard[] | undefined = [];

  @Input()
  isAbleToAddWhiteboards: boolean = true;

  @Input()
  gruppe?: Gruppe;

  constructor(public readonly electron: ElectronService, public dialog: MatDialog, public readonly faecherManager: MappenManagerService) { }

  ngOnInit(): void {
  }

  public newWhiteboard(): void {
    const dialogRef = this.dialog.open(AddWhiteboardDialogComponent, {
      width: '500px',
      data: {
        name: ''
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined && result != "") {
        let res = result as DialogData;
        this.whiteboards?.push(this.faecherManager.addWhiteboard(this.gruppe, res.name));
      }
    });
  }

  public removeWhiteboard(whiteboard: Whiteboard): boolean {
    // Delete the whiteboard
    const index = this.whiteboards?.indexOf(whiteboard);
    if (index != undefined && index != -1) {
      this.whiteboards?.splice(index, 1);

      this.faecherManager.deleteWhitebaord(this.gruppe, whiteboard);

      return true;
    }
    return false;
  }

}
