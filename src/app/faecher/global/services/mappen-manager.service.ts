import {Category, Editor, Gruppe, Mappe, Mappen} from './../interfaces/fach';
import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { File as FileFach, Whiteboard } from '../interfaces/fach';
import { Exposer } from '../classes/exposer';
import { colorToHex, getNewId } from '../utils';
import { defaultWhiteboard, Whiteboard as WhiteboardContent } from '../../../whiteboard/global-whiteboard/interfaces/whiteboard';
import { defaultEditor, EditorContent } from '../../../editor/global/interfaces/editorContent';

const cacheVariable: string = 'mappenData';

@Injectable({
  providedIn: 'root'
})
export class MappenManagerService {

  public mappenData: Mappen = {
    gruppen: [],
    categories: [],
    mappen: []
  };

  public loaded = false;
  public closing = false;

  public readonly whiteboardSavers: Exposer<WhiteboardSaveConfig> = new Exposer<WhiteboardSaveConfig>();
  public readonly editorSavers: Exposer<EditorSaveConfig> = new Exposer<EditorSaveConfig>();

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

        /*this.editorSavers.request(r => {
          this.writeEditor(r);
        })*/

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

  //#region handling files, whiteboards and editors
  public openFile(gruppe: Gruppe | string, file: FileFach | string) {
    // Öffne die gegebene Datei
    if (this.electron.isElectronApp) {
      this.electron.ipcRenderer.invoke('open-file', this.getPathForFile(gruppe, file));
    }
  }

  public async addFile(gruppe: Gruppe | string, file: File | undefined): Promise<string> {
    if (this.electron.isElectronApp && file) {
      return await file.arrayBuffer().then(value => {
        this.electron.ipcRenderer.invoke('write-file', this.getPathForFile(gruppe, file), value);
        return file.name;
      })
    }
    return '';
  }

  public getPathForFileDir(gruppe: string | Gruppe | undefined): string {
    if (gruppe) {
      let path = `gruppen/${typeof gruppe == 'string' ? gruppe : gruppe.id}/dateien/`;
      return path;
    }
    return '';
  }

  public getPathForFile(gruppe: string | Gruppe | undefined, file : FileFach | File | string) : string {
    return this.getPathForFileDir(gruppe) + (typeof file == 'string' ? file : file.name);
  }

  public deleteFile(gruppe: Gruppe | string, file: FileFach | string): void {
    // Lösche die gegebene Datei
    if (this.electron.isElectronApp) {
      this.electron.ipcRenderer.invoke('delete', this.getPathForFile(gruppe, file));
    }
  }


  public addWhiteboard(gruppe: string | Gruppe | undefined, whiteboard: string): Whiteboard {
    // find all the ids of the whiteboard
    let ids: string[] = [];
    for (let g of this.mappenData.gruppen) {
      for (let whiteboard of g.whiteboards) {
        ids.push(whiteboard.id);
      }
    }

    let res: Whiteboard = {
      name: whiteboard,
      id: getNewId(ids)
    }

    if (this.electron.isElectronApp) {
      this.electron.ipcRenderer.invoke('write-json', this.getPathForWhiteboard(gruppe, res.id), JSON.stringify(defaultWhiteboard));
    }

    return res;
  }

  public writeWhiteboard(config: WhiteboardSaveConfig) {
    if (this.electron.isElectronApp) {
      this.electron.ipcRenderer.invoke('write-json', this.getPathForWhiteboard(config.gruppeId, config.whiteboardId), JSON.stringify(config.content));
    }
  }

  public async getWhiteboard(gruppe: string | Gruppe | undefined, whiteboard: string | Whiteboard | undefined): Promise<WhiteboardContent> {
    return JSON.parse(await this.electron.ipcRenderer.invoke('request-whiteboard', this.getPathForWhiteboard(gruppe, whiteboard))) as WhiteboardContent;
  }

  public getPathForWhiteboard(gruppe: string | Gruppe | undefined, whiteboard: string | Whiteboard | undefined): string {
    if (gruppe) {
      let path = `gruppen/${typeof gruppe == 'string' ? gruppe : gruppe.id}/`;
      if (whiteboard) {
        path += `whiteboards/${typeof whiteboard == 'string' ? whiteboard : whiteboard.id}.json`;
        return path;
      }
    }
    return '';
  }

  public getLinkToWhiteboard(gruppe: string | Gruppe | undefined, whiteboard: string | Whiteboard | undefined): string {
    if (gruppe && whiteboard) {
      return `/mappen/whiteboards/${typeof whiteboard == 'string' ? whiteboard : whiteboard.id}/`;
    }
    return '';
  }

  public deleteWhitebaord(gruppe: string | Gruppe | undefined, whiteboard: string | Whiteboard | undefined): void {
    if (this.electron.isElectronApp) {
      this.electron.ipcRenderer.invoke('delete', this.getPathForWhiteboard(gruppe, whiteboard));
    }
  }


  public addEditor(gruppe: string | Gruppe | undefined, editor: string): Editor {
    // find all of the ids of the whiteboard
    let ids: string[] = [];
    for (let gruppe of this.mappenData.gruppen) {
      for (let editor of gruppe.editors) {
        ids.push(editor.id);
      }
    }

    let res: Editor = {
      name: editor,
      id: getNewId(ids)
    }

    if (this.electron.isElectronApp) {
      this.electron.ipcRenderer.invoke('write-json', this.getPathForEditor(gruppe, res.id), JSON.stringify(defaultEditor));
    }

    return res;
  }

  public writeEditor(config: EditorSaveConfig) {
    if (this.electron.isElectronApp) {
      this.electron.ipcRenderer.invoke('write-json', this.getPathForEditor(config.gruppeId, config.editorId), JSON.stringify(config.content));
    }
  }

  public async getEditor(gruppe: string | Gruppe | undefined, editor: string | Editor | undefined): Promise<EditorContent> {
    return JSON.parse(await this.electron.ipcRenderer.invoke('request-editor', this.getPathForEditor(gruppe, editor))) as EditorContent;
  }

  public getEditorInterface(gruppeId: string, editorId: string): Editor {
    let gruppe: Gruppe | undefined;
    for (let f of this.mappenData.gruppen) {
      if (f.id === gruppeId) {
        gruppe = f;
        break;
      }
    }

    if (gruppe) {
      for (let editor of gruppe.editors) {
        if (editor.id === editorId) return editor;
      }
    }

    throw 'Editor not found!';
  }

  public getPathForEditor(gruppe: string | Gruppe | undefined, editor: string | Editor | undefined): string {
    if (gruppe) {
      let path = `gruppen/${typeof gruppe == 'string' ? gruppe : gruppe.id}/`;
      if (editor) {
        path += `editors/${typeof editor == 'string' ? editor : editor.id}.json`;
        return path;
      }
    }
    return '';
  }

  public getLinkToEditor(gruppe: string | Gruppe | undefined, editor: string | Editor | undefined): string {
    if (gruppe && editor) {
      return `/mappen/editors/${typeof editor == 'string' ? editor : editor.id}/`;
    }
    return '';
  }

  public deleteEditor(gruppe: string | Gruppe | undefined, editor: string | Editor | undefined): void {
    if (this.electron.isElectronApp) {
      this.electron.ipcRenderer.invoke('delete', this.getPathForEditor(gruppe, editor));
    }
  }
  //#endregion

  //#region handling the cache
  public async loadData() {
    if (this.electron.isElectronApp) {
      this.mappenData = JSON.parse(await this.electron.ipcRenderer.invoke('get-data')) as Mappen;
    }
    else {
      let cache = localStorage[cacheVariable];
      this.mappenData = cache ? JSON.parse(cache) : ({ gruppen: [], categories: [], mappen: [] } as Mappen);
    }

    this.loaded = true;
  }

  public saveInCache() {
    if (!this.electron.isElectronApp) {
      localStorage[cacheVariable] = JSON.stringify(this.mappenData);
    }
  }

  public saveDataElectron() {
    if (this.electron.isElectronApp) {
      this.electron.ipcRenderer.invoke('write-data', JSON.stringify(this.mappenData));
    }
  }
  //#endregion

  //#region methods for handling Gruppen and Mappen
  public addMappe(mappe: Mappe): void {
    this.mappenData.mappen.push(mappe);
  }

  public addMappeWithData(name: string, description: string): void {
    this.addMappe({
      id: getNewId(this.mappenData.gruppen.map(f => f.id)),
      title: name,
      description,
      gruppen: []
    })
  }

  public getMappeById(id: string): Mappe | undefined {
    for (let m of this.mappenData.mappen) {
      if (m.id === id) {
        return m;
      }
    }
    return undefined;
  }

  public getLinkToMappe(mappe: Mappe): string {
    return `/mappen/${mappe.id}/`
  }

  public removeMappe(mappe: Mappe): boolean {
    let index = this.mappenData.mappen.indexOf(mappe);
    if (index > -1) {
      this.mappenData.mappen.splice(index, 1);
      return true;
    }
    return false;
  }

  public addGruppe(oberElement: { gruppen: string[] }, gruppe: Gruppe): void {
    this.mappenData.gruppen.push(gruppe);
    oberElement.gruppen.push(gruppe.id);
  }

  public addGruppeWithData(mappe: Mappe, name: string, description: string): void {
    this.addGruppe(mappe, {
      id: getNewId(this.mappenData.gruppen.map(f => f.id)),
      name,
      description,
      notes: '',
      tasks: [],
      gruppen: [],
      files: [],
      whiteboards: [],
      editors: []
    })
  }

  public getGruppeById(id: string): Gruppe | undefined {
    for (let gruppe of this.mappenData.gruppen) {
      if (gruppe.id == id) return gruppe;
    }
    return undefined;
  }

  public getLinkToGruppe(gruppe: Gruppe): string {
    return `/mappen/gruppen/${gruppe.id}/`;
  }

  public removeGruppe(gruppe: Gruppe): boolean {
    let index = this.mappenData.gruppen.indexOf(gruppe);
    if (index > -1) {
      this.mappenData.gruppen.splice(index, 1);
      return true;
    }
    return false;
  }

  public getGruppeFromData(oberElement: { gruppen: string[] }, name: string, description: string): Gruppe {
    let ids: string[] = [];
    for (let gruppe of this.mappenData.gruppen) {
      ids.push(gruppe.id);
    }

    const gruppe: Gruppe = {
      id: getNewId(ids),
      name,
      description: description,
      tasks: [],
      notes: '',
      files: [],
      whiteboards: [],
      editors: [],
      gruppen: []
    };

    this.mappenData.gruppen.push(gruppe);
    oberElement.gruppen.push(gruppe.id);

    return gruppe;
  }
  //#endregion

  //#region methods for dealing with the categories
  public getCategoryNameToId(id: string | undefined): string | undefined {
    return this.getCategoryToId(id)?.name;
  }

  public getCategoryToId(id: string | undefined): Category | undefined {
    // method returns the name to the id
    for (let c of this.mappenData.categories) {
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
  gruppeId: string,
  whiteboardId: string
}

export interface EditorSaveConfig {
  content: EditorContent,
  gruppeId: string,
  editorId: string
}
