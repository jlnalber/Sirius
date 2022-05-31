import { Category } from './../interfaces/fach';
import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { Einheit, Fach, Faecher, File as FileFach, Whiteboard } from '../interfaces/fach';
import { Exposer } from '../classes/exposer';
import { colorToHex, getNewId } from '../utils';
import { defaultWhiteboard, Whiteboard as WhiteboardContent } from '../../../whiteboard/global-whiteboard/interfaces/whiteboard';

const cacheVariable: string = 'faecherData';

@Injectable({
  providedIn: 'root'
})
export class FaecherManagerService {

  public faecherData: Faecher = {
    faecher: [],
    categories: []
  };

  public loaded = false;
  public closing = false;

  public readonly whiteboardSavers: Exposer<WhiteboardSaveConfig> = new Exposer<WhiteboardSaveConfig>();

  constructor(private readonly electron: ElectronService) {
    //load the sirius.config.json file
    /*if (this.electron.isElectronApp) {
      this.loadSiriusConfig();
    }*/

    if (this.electron.isElectronApp) {
      this.electron.ipcRenderer.on('closing', () => {
        this.closing = true;

        this.saveDataElectron();

        this.whiteboardSavers.request(t => {
          this.writeWhiteboard(t);
        })

        this.electron.ipcRenderer.sendSync('please_close');
      })
    }
    

    window.addEventListener('beforeunload', () => {
      /*try {
        this.whiteboardSavers.emit();
      }
      catch { }*/
      
      this.saveInCache();
    })

    window.addEventListener('popstate', () => {
      this.saveInCache();
    })

    //setTimeout(() => this.loadFromCache(), 2000)
    this.loadData();
  }

  //#region handling files and whiteboards
  public openFile(fach: Fach | string, einheit: Einheit | string | undefined, file: FileFach | string) {
    // Öffne die gegebene Datei
    if (this.electron.isElectronApp) {
      this.electron.ipcRenderer.invoke('open-file', this.getPathForFile(fach, einheit, file));
    }
  }

  public async addFile(fach: Fach | string, einheit: Einheit | string | undefined, file: File | undefined): Promise<string> {
    if (this.electron.isElectronApp && file) {
      return await file.arrayBuffer().then(value => {
        this.electron.ipcRenderer.invoke('write-file', this.getPathForFile(fach, einheit, file), value);
        return file.name;
      })
    }
    return '';
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

  public getPathForFile(fach: string | Fach | undefined, einheit: string | Einheit | undefined, file : FileFach | File | string) : string {
    return this.getPathForFileDir(fach, einheit) + (typeof file == 'string' ? file : file.name);
  }

  public deleteFile(fach: Fach | string, einheit: Einheit | string | undefined, file: FileFach | string): void {
    // Lösche die gegebene Datei
    if (this.electron.isElectronApp) {
      this.electron.ipcRenderer.invoke('delete', this.getPathForFile(fach, einheit, file));
    }
  }


  public addWhiteboard(fach: string | Fach | undefined, einheit: string | Einheit | undefined, whiteboard: string): Whiteboard {
    // find all of the ids of the whiteboard
    let ids: string[] = [];
    for (let fach of this.faecherData.faecher) {
      for (let whiteboard of fach.whiteboards) {
        ids.push(whiteboard.id);
      }

      for (let einheit of fach.einheiten) {
        for (let whiteboard of einheit.whiteboards) {
          ids.push(whiteboard.id);
        }
      }
    }

    let res: Whiteboard = {
      name: whiteboard,
      id: getNewId(ids)
    }

    if (this.electron.isElectronApp) {
      this.electron.ipcRenderer.invoke('write-whiteboard', this.getPathForWhiteboard(fach, einheit, res.id), JSON.stringify(defaultWhiteboard));
    }

    return res;
  }

  public writeWhiteboard(config: WhiteboardSaveConfig) {
    if (this.electron.isElectronApp) {
      this.electron.ipcRenderer.invoke('write-whiteboard', this.getPathForWhiteboard(config.fachId, config.einheitId, config.whiteboardId), JSON.stringify(config.content));
    }
  }

  public async getWhiteboard(fach: string | Fach | undefined, einheit: string | Einheit | undefined, whiteboard: string | Whiteboard | undefined): Promise<WhiteboardContent> {
    return JSON.parse(await this.electron.ipcRenderer.invoke('request-whiteboard', this.getPathForWhiteboard(fach, einheit, whiteboard))) as WhiteboardContent;
  }

  public getPathForWhiteboard(fach: string | Fach | undefined, einheit: string | Einheit | undefined, whiteboard: string | Whiteboard | undefined): string {
    if (fach) {
      let path = `faecher/${typeof fach == 'string' ? fach : fach.id}/`;
      if (einheit) {
        path += `einheiten/${typeof einheit == 'string' ? einheit : einheit.id}/`;
      }
      if (whiteboard) {
        path += `whiteboards/${typeof whiteboard == 'string' ? whiteboard : whiteboard.id}.json`;
        return path;
      }
    }
    return '';
  }

  public getLinkToWhiteboard(fach: string | Fach | undefined, einheit: string | Einheit | undefined, whiteboard: string | Whiteboard | undefined): string {
    if (fach) {
      let path = `/faecher/${typeof fach == 'string' ? fach : fach.id}/`;
      if (einheit) {
        path += `einheiten/${typeof einheit == 'string' ? einheit : einheit.id}/`;
      }
      if (whiteboard) {
        path += `whiteboards/${typeof whiteboard == 'string' ? whiteboard : whiteboard.id}/`;
        return path;
      }
    }
    return '';
  }

  public deleteWhitebaord(fach: string | Fach | undefined, einheit: string | Einheit | undefined, whiteboard: string | Whiteboard | undefined): void {
    if (this.electron.isElectronApp) {
      this.electron.ipcRenderer.invoke('delete', this.getPathForWhiteboard(fach, einheit, whiteboard));
    }
  }
  //#endregion

  //#region handling the cache
  public async loadData() {
    if (this.electron.isElectronApp) {
      this.faecherData = JSON.parse(await this.electron.ipcRenderer.invoke('get-data')) as Faecher;
    }
    else {
      let cache = localStorage[cacheVariable];
      this.faecherData = cache ? JSON.parse(cache) : { faecher: [], categories: [] };
    }

    this.loaded = true;
  }

  public saveInCache() {
    if (!this.electron.isElectronApp) {
      localStorage[cacheVariable] = JSON.stringify(this.faecherData);
    }
  }

  public saveDataElectron() {
    if (this.electron.isElectronApp) {
      this.electron.ipcRenderer.invoke('write-data', JSON.stringify(this.faecherData));
    }
  }
  //#endregion

  //#region methods for handling Faecher and Einheiten
  public addFach(fach: Fach): void {
    this.faecherData.faecher.push(fach);
  }

  public addFachWithData(name: string, description: string): void {
    this.addFach({
      id: getNewId(this.faecherData.faecher.map(f => f.id)),
      name: name,
      description: description,
      notes: '',
      tasks: [],
      einheiten: [],
      files: [],
      whiteboards: []
    })
  }

  public getFachById(id: string): Fach | undefined {
    for (let fach of this.faecherData.faecher) {
      if (fach.id == id) return fach;
    }
    return undefined;
  }

  public getLinkToFach(fach: Fach): string {
    return `/faecher/${fach.id}/`;
  }

  public removeFach(fach: Fach): boolean {
    let index = this.faecherData.faecher.indexOf(fach);
    if (index > -1) {
      this.faecherData.faecher.splice(index, 1);
      return true;
    }
    return false;
  }


  public addEinheit(fach: Fach, einheit: Einheit): void {
    fach.einheiten.push(einheit);
  }

  public addEinheitWithData(fach: Fach, topic: string, description: string): void {
    this.addEinheit(fach, this.getEinheitFromData(topic, description));
  }

  public getEinheitFromData(topic: string, description: string): Einheit {
    let ids: string[] = [];
    for (let fach of this.faecherData.faecher) {
      ids.push(...fach.einheiten.map(e => e.id));
    }

    return {
      id: getNewId(ids),
      topic: topic,
      description: description,
      tasks: [],
      notes: '',
      files: [],
      whiteboards: []
    };
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

  public getLinkToEinheit(fach: Fach, einheit: Einheit): string {
    return `/faecher/${fach.id}/einheiten/${einheit.id}/`;
  }

  public removeEinheit(fach: Fach, einheit: Einheit): boolean {
    let index = fach.einheiten.indexOf(einheit);
    if (index > -1) {
      fach.einheiten.splice(index, 1);
      return true;
    }
    return false;
  }
  //#endregion

  //#region methods for dealing with the categories
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

  public getColorOfCategory(cId?: string): string | undefined {
    if (!cId) return undefined;

    let c = this.getCategoryToId(cId);

    if (!c) return undefined;
    
    return colorToHex(c.color);
  }

  public getBorderStyle(cId?: string): string {
    let color = this.getColorOfCategory(cId);
    return `6px solid ${color ? color : 'transparent'}`;
  }
  //#endregion

}

export interface WhiteboardSaveConfig {
  content: WhiteboardContent,
  fachId: string,
  einheitId?: string,
  whiteboardId: string
}