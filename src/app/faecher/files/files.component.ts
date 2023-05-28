import { MappenManagerService } from '../global/services/mappen-manager.service';
import { ActivatedRoute } from '@angular/router';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { File as FileFach } from '../global/interfaces/fach';

@Component({
  selector: 'faecher-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit {
  @Input()
  files: FileFach[] | undefined = [];

  @Input()
  isAbleToAddFiles: boolean = true;

  gruppe: string = '';


  constructor(public readonly electron: ElectronService, private readonly activeRoute: ActivatedRoute, public readonly faecherManager: MappenManagerService) {
    if (this.electron.isElectronApp) {
      this.activeRoute.params.subscribe((params: any) => {
        this.gruppe = params.fachid;
      })
    }
  }

  ngOnInit(): void {
  }

  public removeFile(file: FileFach): boolean {
    // Lösche die Datei
    const index = this.files?.indexOf(file);
    if (index != undefined && index != -1) {
      this.files?.splice(index, 1);

      this.faecherManager.deleteFile(this.gruppe, file);

      return true;
    }
    return false;
  }

  public openFile(file: FileFach): void {
    console.log('opening')
    this.faecherManager.openFile(this.gruppe, file);
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

  private async addFile(file: File | undefined): Promise<void> {
    this.files?.push({ name: await this.faecherManager.addFile(this.gruppe, file) });
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
