import { FaecherManagerService } from 'src/app/faecher/global/services/faecher-manager.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Component, HostListener, Input, OnInit } from '@angular/core';
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

  constructor(private readonly electron: ElectronService, private readonly activeRoute: ActivatedRoute, private readonly faecherManager: FaecherManagerService) { 
    if (this.electron.isElectronApp) {
      this.activeRoute.params.subscribe((params: any) => {
        this.path = this.faecherManager.getPathForFileDir(params.fachid, params.einheitid);
      })
    }
  }

  ngOnInit(): void {
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

  @HostListener('dragover', ['$event']) onDragOver(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
  }

  @HostListener('dragleave', ['$event']) onDragLeave(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
  }

  @HostListener('drop', ['$event']) onDrop(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    const files = evt.dataTransfer?.files;
    this.openFiles(files);
  }

  public openFilesInput() {
    try {
      let inp = document.getElementById('inp') as HTMLInputElement;
      const files = inp.files;
      this.openFiles(files);
    }
    catch { }
  }

  private addFile(file: File | undefined): void {
    if (this.electron.isElectronApp && file) {
      file.arrayBuffer().then(value => {
        this.electron.ipcRenderer.invoke('write-file', this.path + file.name, value);
        this.files?.push(file.name);
      })
    }
    else if (file) {
      file.text().then(value => {
        // console.log(value);
      })
      file.arrayBuffer().then((value) => {
        const enc = new TextDecoder('utf-8');
        console.log(enc.decode(value));
        console.log(value);
      })
      this.files?.push(file.name);
    }
  }
  
  private openFiles(files: FileList | null | undefined): void {
    try {
      if (files) {
        for (let i = 0; i < files.length; i++) {
          const file = files.item(i);

          if (file) {
            this.addFile(file); 
          }
        }
      }    
    }
    catch { }
  }

}
