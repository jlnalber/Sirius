import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ElectronService } from 'ngx-electron';
import {Editor, Gruppe} from '../global/interfaces/fach';
import { MappenManagerService } from '../global/services/mappen-manager.service';
import { AddEditorDialogComponent, DialogData } from './add-editor-dialog/add-editor-dialog.component';

@Component({
  selector: 'faecher-editors',
  templateUrl: './editors.component.html',
  styleUrls: ['./editors.component.scss']
})
export class EditorsComponent implements OnInit {

  @Input()
  editors: Editor[] | undefined = [];

  @Input()
  isAbleToAddEditors: boolean = true;

  @Input()
  gruppe?: Gruppe;

  constructor(public readonly electron: ElectronService, public dialog: MatDialog, public readonly faecherManager: MappenManagerService) { }

  ngOnInit(): void {
  }

  public newEditor(): void {
    const dialogRef = this.dialog.open(AddEditorDialogComponent, {
      width: '500px',
      data: {
        name: ''
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined && result != "") {
        let res = result as DialogData;
        console.log(res);
        this.editors?.push(this.faecherManager.addEditor(this.gruppe, res.name));
      }
    });
  }

  public removeEditor(editor: Editor): boolean {
    // Delete the editor
    const index = this.editors?.indexOf(editor);
    if (index != undefined && index != -1) {
      this.editors?.splice(index, 1);

      this.faecherManager.deleteEditor(this.gruppe, editor);

      return true;
    }
    return false;
  }

}
