import { FaecherManagerService } from 'src/app/faecher/global/services/faecher-manager.service';
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

  fach: string = '';
  einheit: string | undefined;


  constructor(public readonly electron: ElectronService, private readonly activeRoute: ActivatedRoute, public readonly faecherManager: FaecherManagerService) { 
    if (this.electron.isElectronApp) {
      this.activeRoute.params.subscribe((params: any) => {
        this.fach = params.fachid
        this.einheit = params.einheitid;
      })
    }
  }

  ngOnInit(): void {
  }

  public removeFile(file: FileFach): boolean {
    const index = this.files?.indexOf(file);
    if (index != undefined && index != -1) {
      this.files?.splice(index, 1);
      return true;
    }
    return false;
  }

  public openFile(file: FileFach): void {
    console.log('opening')
    this.faecherManager.openFile(this.fach, this.einheit, file);
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
    this.files?.push({ name: await this.faecherManager.addFile(this.fach, this.einheit, file) });
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
