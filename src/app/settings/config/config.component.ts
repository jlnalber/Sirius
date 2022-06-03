import { MatDialog } from '@angular/material/dialog';
import { ElectronService } from 'ngx-electron';
import { SiriusConfig } from './../../faecher/global/interfaces/siriusConfig';
import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AcceptDialogComponent } from 'src/app/faecher/accept-dialog/accept-dialog.component';

const errorMessage = 'Dieser Pfad ist bereits ausgewählt!'

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {

  public config?: SiriusConfig;

  public home: string = 'HOME';

  constructor(private readonly electron: ElectronService, private readonly snackBar: MatSnackBar, private readonly dialog: MatDialog) { }

  async ngOnInit(): Promise<void> {
    if (this.electron.isElectronApp) {
      this.config = await this.electron.ipcRenderer.invoke('get-config') as SiriusConfig;

      for (let i in this.config.directories) {
        if (this.config.directories[i] == '') {
          this.config.directories[i] = this.home;
        }
      }
    }
  }
  
  drop(event: CdkDragDrop<string[]>) {
    // Logik um die Einträge umzusortieren
    if (this.config) {
      moveItemInArray(this.config.directories, event.previousIndex, event.currentIndex);

      this.save();
    }
  }

  public async openFolder(index: number): Promise<void> {
    // Versuche einen Pfad durch einen anderen zu ersetzen
    try {
      if (this.config && this.electron.isElectronApp) {
        let dir = await this.electron.ipcRenderer.invoke('open-folder-dialog', this.config.directories[index]) as string;

        if (this.config.directories.includes(dir) && this.config.directories[index] != dir) {
          this.openSnackBar();
        }
        else {
          this.config.directories[index] = dir;

          this.save();
        }
      }
    }
    catch { }
  }

  public deleteFolder(index: number): void {
    // Versuche einen Pfad zu löschen
    if (this.config && this.electron.isElectronApp) {
      // open the dialog to delete
      const dialogRef = this.dialog.open(AcceptDialogComponent, {
        data: {
          header: `Den Pfad wirklich entfernen?`,
          description: `Es kann zum Datenverlust kommen.`
        }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result != undefined && result != "" && this.config) {
          this.config.directories.splice(index, 1);

          this.save();
        }
      })
    }
  }

  public async addFolder(): Promise<void> {
    // Versuche einen Pfad hinzuzufügen
    if (this.config && this.electron.isElectronApp) {
      try {
        let dir = await this.electron.ipcRenderer.invoke('open-folder-dialog') as string;

        if (this.config.directories.includes(dir)) {
          this.openSnackBar();
        }
        else {
          this.config.directories.push(dir);

          this.save();
        }
      }
      catch { }
    }
  }

  private async save(): Promise<void> {
    // Speichere die Konfiguration ab
    if (this.electron.isElectronApp && this.config) {
      let conf: SiriusConfig = {
        directories: []
      }

      for (let d of this.config.directories) {
        conf.directories.push(d == this.home ? '' : d)
      }

      this.electron.ipcRenderer.invoke('set-config', conf);
    }
  }

  private openSnackBar(): void {
    this.snackBar.open(errorMessage, undefined, {
      duration: 5 * 1000
    })
  }

}