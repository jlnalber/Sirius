import { FaecherManagerService } from 'src/app/faecher/global/services/faecher-manager.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Component, Input, OnInit } from '@angular/core';
import { AddFileDialogComponent, DialogData } from './add-file-dialog/add-file-dialog.component';
import { ElectronService } from 'ngx-electron';

@Component({
  selector: 'faecher-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit {
  @Input()
  files: string[] | undefined = [];

  @Input()
  isAbleToAddFiles: boolean = true;

  path: string | undefined;

  constructor(private readonly dialog: MatDialog, private readonly electron: ElectronService, private readonly activeRoute: ActivatedRoute, private readonly faecherManager: FaecherManagerService) { 
    if (this.electron.isElectronApp) {
      this.activeRoute.params.subscribe((params: any) => {
        this.path = this.faecherManager.getPathForFileDir(params.fachid, params.einheitid);
      })
    }
  }

  ngOnInit(): void {
  }

  public openDialog(): void {
    const dialogRef = this.dialog.open(AddFileDialogComponent, {
      width: '500px',
      data: { 
        files: []
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined && result != "") {
        if (this.electron.isElectronApp) {
          let res = result as DialogData;
          for (let file of res.files) {
            file[1].text().then(value => {
              this.electron.ipcRenderer.invoke('write-file', this.path + file[0], value);
              this.files?.push(file[0]);
            })
          }
        }
      }
    });
  }

  public openFile(file: string) {
    if (this.electron.isElectronApp) {
      this.electron.ipcRenderer.invoke('open-file', this.path + file);
    }
  }

  public removeFile(file: string): boolean {
    const index = this.files?.indexOf(file);
    if (index != undefined && index != -1) {
      this.files?.splice(index, 1);
      return true;
    }
    return false;
  }

}
