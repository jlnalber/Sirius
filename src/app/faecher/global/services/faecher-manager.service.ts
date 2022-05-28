import { Category } from './../interfaces/fach';
import { SiriusConfig } from '../interfaces/sirius.config';
import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { Einheit, Fach, Faecher, File as FileFach, Whiteboard } from '../interfaces/fach';
import { Event } from '../../../whiteboard/global-whiteboard/essentials/event';
import { colorToHex } from '../utils';

const siriusConfigPath: string = 'sirius.config.json';
const onSiriusConfigFileChannel: string = 'siriusConfigFile';
const faecherFilePath: string = 'faecher.json';
const onGetFileChannel: string = 'fileRequester';
const cacheVariable: string = 'faecherData';

@Injectable({
  providedIn: 'root'
})
export class FaecherManagerService {
  private siriusConfig: SiriusConfig = { directories: [] };

  public faecherData: Faecher = {
    faecher: [],
    categories: []
  };

  public readonly whiteboardSavers: Event = new Event();

  constructor(private readonly electron: ElectronService) {
    //load the sirius.config.json file
    /*if (this.electron.isElectronApp) {
      this.loadSiriusConfig();
    }*/

    window.addEventListener('beforeunload', () => {
      try {
        this.whiteboardSavers.emit();
      }
      catch { }
      
      this.saveInCache();
    })

    window.addEventListener('popstate', () => {
      this.saveInCache();
    })

    //setTimeout(() => this.loadFromCache(), 2000)
    this.loadFromCache();
  }

  public loadFromCache() {
    let cache = localStorage[cacheVariable];
    this.faecherData = cache ? JSON.parse(cache) : { faecher: [], categories: [] };
  }

  public saveInCache() {
    localStorage[cacheVariable] = JSON.stringify(this.faecherData);
  }

  private loadSiriusConfig() {
    this.electron.ipcRenderer.once(onSiriusConfigFileChannel, (event, arg) => {
      if (arg) {
        try {
          this.siriusConfig = JSON.parse(arg as string) as SiriusConfig;
        }
        catch {
          this.createSiriusConfig();
        }
      }
      else {
        this.createSiriusConfig();
      }

      console.log(this.siriusConfig);

      this.loadFaecher();
    });
    this.electron.ipcRenderer.sendSync('readFile', [ siriusConfigPath, onSiriusConfigFileChannel ]);
  }

  private loadFaecher() {
    this.getFile(faecherFilePath, (file: string | Buffer | undefined) => {
      if (file) {
        this.faecherData = JSON.parse(file as string);
      }
      else {
        this.createFaecher();
      }
    });
  }

  private createFaecher() {
    this.faecherData = { 
      faecher: [],
      categories: []
    };
    this.postFile(faecherFilePath, JSON.stringify(this.faecherData));
  }

  private createSiriusConfig() {
    this.siriusConfig = {
      directories: [
        'C:\\Users\\Julian Alber\\OneDrive\\Sirius\\',
        ''
      ]
    };

    this.electron.ipcRenderer.sendSync('writeFile', [ siriusConfigPath, JSON.stringify(this.siriusConfig) ]);
  }

  public save(): void {
    let str = JSON.stringify(this.faecherData);
    for (let path of this.siriusConfig.directories) {
      this.electron.ipcRenderer.sendSync('writeFile', [ path + faecherFilePath, str ])
    }
  }

  public postFile(path: string, content: string): void {
    for (let d of this.siriusConfig.directories) {
      this.electron.ipcRenderer.sendSync('writeFile', [ d + path, content ]);
    }
  }

  public getFile(path: string, callback: (file: string | Buffer | undefined) => void): void {
    let foundSomething: boolean = false;
    let counter2: number = 0;// will count how many response were received in order to make a last callback
    for (let counter: number = 0; foundSomething || counter < this.siriusConfig.directories.length; counter++) {
      this.electron.ipcRenderer.once(onGetFileChannel, (event, arg) => {
        counter2++;
        if (!foundSomething && arg) {
          foundSomething = true;

          try {
            callback(arg as string | Buffer);
          }
          catch { }
        }

        if (counter2 == this.siriusConfig.directories.length && !foundSomething) {
          callback(undefined);// make last callback
        }
      })
      this.electron.ipcRenderer.sendSync('readFile', [ this.siriusConfig.directories[counter] + path, onGetFileChannel ]);
      
    }
  }

  public getFachById(id: string): Fach | undefined {
    for (let fach of this.faecherData.faecher) {
      if (fach.id == id) return fach;
    }
    return undefined;
  }

  public getEinheitById(fachId: string, einheitId: string): Einheit | undefined {
    let fach = this.getFachById(fachId);
    if (fach != undefined) {
      for (let einheit of fach.einheiten) {
        if (einheit.id == einheitId) return einheit;
      }
    }
    return undefined;
  }

  public addFach(fach: Fach): void {
    this.faecherData.faecher.push(fach);
  }

  public addFachWithData(id: string, name: string, description: string): void {
    this.addFach({
      id: this.toID(id),
      name: name,
      description: description,
      notes: '',
      tasks: [],
      einheiten: [],
      files: [],
      whiteboards: []
    })
  }

  private static replaceAll(str: string, what: string[], by: string): string {
    for (let w of what) {
      while (str.indexOf(w) != -1) {
        str = str.replace(w, by);
      }
    }
    return str;
  }

  private toID(str: string): string {
    return FaecherManagerService.replaceAll(str.trim().toLowerCase(), [' ', '\r', '\n', '\\', '/', '&', '.', ',', '\'', '"', ';', ':'], '');
  }

  public addEinheitWithData(fach: Fach, topic: string, description: string): void {
    fach.einheiten.push(this.getEinheitFromData(topic, description));
  }

  public getEinheitFromData(topic: string, description: string): Einheit {
    return {
      id: this.toID(topic),
      topic: topic,
      description: description,
      tasks: [],
      notes: '',
      files: [],
      whiteboards: []
    };
  }

  public removeFach(fach: Fach): boolean {
    let index = this.faecherData.faecher.indexOf(fach);
    if (index > -1) {
      this.faecherData.faecher.splice(index, 1);
      return true;
    }
    return false;
  }

  public removeEinheit(fach: Fach, einheit: Einheit): boolean {
    let index = fach.einheiten.indexOf(einheit);
    if (index > -1) {
      fach.einheiten.splice(index, 1);
      return true;
    }
    return false;
  }

  public getPathForFileDir(fach: string | Fach | undefined, einheit: string | Einheit | undefined): string {
    if (fach) {
      let path = `faecher/${typeof fach == 'string' ? fach : fach.id}/`;
      if (einheit) {
        path += `einheiten/${typeof einheit == 'string' ? einheit : einheit.id}/`;
      }
      path += 'dateien/'
      return path;
    }
    return '';
  }

  public openFile(fach: Fach | string, einheit: Einheit | string | undefined, file: FileFach | string) {
    // Öffne die gegebene Datei
    if (this.electron.isElectronApp) {
      this.electron.ipcRenderer.invoke('open-file', this.getPathForFileDir(fach, einheit) + (typeof file == 'string' ? file : file.name));
    }
  }

  public async addFile(fach: Fach | string, einheit: Einheit | string | undefined, file: File | undefined): Promise<string> {
    if (this.electron.isElectronApp && file) {
      return await file.arrayBuffer().then(value => {
        this.electron.ipcRenderer.invoke('write-file', this.getPathForFileDir(fach, einheit) + file.name, value);
        return file.name;
      })
    }
    return '';
  }

  public getPathForWhiteboard(fach: string | Fach | undefined, einheit: string | Einheit | undefined, whiteboard: string | Whiteboard | undefined): string {
    if (fach) {
      let path = `faecher/${typeof fach == 'string' ? fach : fach.id}/`;
      if (einheit) {
        path += `einheiten/${typeof einheit == 'string' ? einheit : einheit.id}/`;
      }
      if (whiteboard) {
        path += `whiteboards/${typeof whiteboard == 'string' ? whiteboard : whiteboard.name}.json`;
        return path;
      }
    }
    return '';
  }

  public getCategoryNameToId(id: string | undefined): string | undefined {
    return this.getCategoryToId(id)?.name;
  }

  public getCategoryToId(id: string | undefined): Category | undefined {
    // method returns the name to the id
    for (let c of this.faecherData.categories) {
      if (c.id == id) return c;
    }
    return undefined;
  }

  public getLinkToFach(fach: Fach): string {
    return `/faecher/${fach.id}/`;
  }

  public getLinkToEinheit(fach: Fach, einheit: Einheit): string {
    return `/faecher/${fach.id}/einheiten/${einheit.id}/`;
  }

  public getLinkToWhiteboard(fach: string | Fach | undefined, einheit: string | Einheit | undefined, whiteboard: string | Whiteboard | undefined): string {
    if (fach) {
      let path = `/faecher/${typeof fach == 'string' ? fach : fach.id}/`;
      if (einheit) {
        path += `einheiten/${typeof einheit == 'string' ? einheit : einheit.id}/`;
      }
      if (whiteboard) {
        path += `whiteboards/${typeof whiteboard == 'string' ? whiteboard : whiteboard.name}/`;
        return path;
      }
    }
    return '';
  }

  public getColorOfCategory(cId?: string): string {
    const defaultColor: string = '#FFFFFFFF'

    if (!cId) return defaultColor;

    let c = this.getCategoryToId(cId);

    if (!c) return defaultColor;
    
    return colorToHex(c.color);
  }
}
