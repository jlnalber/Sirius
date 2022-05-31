import { Einheit } from './../global/interfaces/fach';
import { AddWhiteboardDialogComponent, DialogData } from './add-whiteboard-dialog/add-whiteboard-dialog.component';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ElectronService } from 'ngx-electron';
import { Fach, Whiteboard } from '../global/interfaces/fach';
import { FaecherManagerService } from '../global/services/faecher-manager.service';

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
  fach?: Fach;

  @Input()
  einheit?: Einheit;

  constructor(public readonly electron: ElectronService, public dialog: MatDialog, public readonly faecherManager: FaecherManagerService) { }

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
        this.whiteboards?.push(this.faecherManager.addWhiteboard(this.fach, this.einheit, res.name));
      }
    });
  }

  public removeWhiteboard(whiteboard: Whiteboard): boolean {
    // Delete the whiteboard
    const index = this.whiteboards?.indexOf(whiteboard);
    if (index != undefined && index != -1) {
      this.whiteboards?.splice(index, 1);

      this.faecherManager.deleteWhitebaord(this.fach, this.einheit, whiteboard);

      return true;
    }
    return false;
  }

}
