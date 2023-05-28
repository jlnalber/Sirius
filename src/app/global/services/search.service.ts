import { MappenManagerService } from '../../faecher/global/services/mappen-manager.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  public searchResults: SearchResult[] = [];

  private _input: string = "";
  public get input(): string {
    return this._input;
  }
  public set input(value: string) {
    this._input = value.trim();
    this.reload();
  }

  public reload(): void {
    let results: SearchResult[] = [];

    let input = this.input.toLowerCase().trim();

    // Suche in den jeweiligen Kategorien
    results.push(...this.getMappen(input));
    results.push(...this.getGruppen(input));
    results.push(...this.getEditors(input));
    results.push(...this.getWhiteboards(input));
    results.push(...this.getFiles(input));
    results.push(...this.getTasks(input));
    results.push(...this.getSettings(input));
    results.push(...this.getAdditionalPlaces(input));

    this.searchResults = results;
  }

  private getMappen(s: string): SearchResult[] {
    // suche nach geeigneten Fächern
    let res: SearchResult[] = [];

    for (let mappe of this.faecherManager.mappenData.mappen) {
      if (mappe.title.toLowerCase().includes(s)) {
        res.push({
          header: mappe.title,
          description: '',
          routerLink: this.faecherManager.getLinkToMappe(mappe),
          type: 'mappe'
        });
      }
      else if (mappe.description.toLowerCase().includes(s)) {
        res.push({
          header: mappe.title,
          description: mappe.description,
          routerLink: this.faecherManager.getLinkToMappe(mappe),
          type: 'mappe'
        })
      }
    }

    return res;
  }

  private getGruppen(s: string): SearchResult[] {
    // suche nach geeigneten Fächern
    let res: SearchResult[] = [];

    for (let gruppe of this.faecherManager.mappenData.gruppen) {
      if (gruppe.name.toLowerCase().includes(s)) {
        res.push({
          header: gruppe.name,
          description: '',
          routerLink: this.faecherManager.getLinkToGruppe(gruppe),
          type: 'gruppe'
        });
      }
      else if (gruppe.description.toLowerCase().includes(s)) {
        res.push({
          header: gruppe.name,
          description: gruppe.description,
          routerLink: this.faecherManager.getLinkToGruppe(gruppe),
          type: 'gruppe'
        })
      }
      else if (gruppe.notes.toLowerCase().includes(s)) {
        res.push({
          header: gruppe.name,
          description: gruppe.notes,
          routerLink: this.faecherManager.getLinkToGruppe(gruppe),
          type: 'gruppe'
        })
      }
    }

    return res;
  }

  private getEditors(s: string): SearchResult[] {
    // suche nach geeigneten Whiteboards
    let res: SearchResult[] = [];

    for (let gruppe of this.faecherManager.mappenData.gruppen) {

      // durchsuche das Fach
      for (let editor of gruppe.editors) {
        if (editor.name.toLowerCase().includes(s)) {
          res.push({
            header: editor.name,
            description: `Im Fach '${gruppe.name}'`,
            routerLink: this.faecherManager.getLinkToEditor(gruppe, editor),
            type: 'editor'
          })
        }
        else if (editor.categoryId && this.faecherManager.getCategoryNameToId(editor.categoryId)?.toLowerCase().includes(s)) {
          res.push({
            header: editor.name,
            description: `In '${this.faecherManager.getCategoryNameToId(editor.categoryId)}' im Fach '${gruppe.name}'`,
            routerLink: this.faecherManager.getLinkToEditor(gruppe, editor),
            type: 'editor'
          })
        }
      }
    }

    return res;
  }

  private getWhiteboards(s: string): SearchResult[] {
    // suche nach geeigneten Whiteboards
    let res: SearchResult[] = [];

    for (let gruppe of this.faecherManager.mappenData.gruppen) {

      // durchsuche das Fach
      for (let whiteboard of gruppe.whiteboards) {
        if (whiteboard.name.toLowerCase().includes(s)) {
          res.push({
            header: whiteboard.name,
            description: `Im Fach '${gruppe.name}'`,
            routerLink: this.faecherManager.getLinkToWhiteboard(gruppe, whiteboard),
            type: 'whiteboard'
          })
        }
        else if (whiteboard.categoryId && this.faecherManager.getCategoryNameToId(whiteboard.categoryId)?.toLowerCase().includes(s)) {
          res.push({
            header: whiteboard.name,
            description: `In '${this.faecherManager.getCategoryNameToId(whiteboard.categoryId)}' im Fach '${gruppe.name}'`,
            routerLink: this.faecherManager.getLinkToWhiteboard(gruppe, whiteboard),
            type: 'whiteboard'
          })
        }
      }
    }

    return res;
  }

  private getFiles(s: string): SearchResult[] {
    // suche nach geeigneten Dateien
    let res: SearchResult[] = [];

    for (let gruppe of this.faecherManager.mappenData.gruppen) {

      // durchsuche das Fach
      for (let file of gruppe.files) {
        if (file.name.toLowerCase().includes(s)) {
          res.push({
            header: file.name,
            description: `Im Fach '${gruppe.name}'`,
            routerLink: this.faecherManager.getLinkToGruppe(gruppe),
            type: 'file',
            additionalClickAction: () => { this.faecherManager.openFile(gruppe, file); }
          })
        }
        else if (file.categoryId && this.faecherManager.getCategoryNameToId(file.categoryId)?.toLowerCase().includes(s)) {
          res.push({
            header: file.name,
            description: `In '${this.faecherManager.getCategoryNameToId(file.categoryId)}' im Fach '${gruppe.name}'`,
            routerLink: this.faecherManager.getLinkToGruppe(gruppe),
            type: 'file',
            additionalClickAction: () => { this.faecherManager.openFile(gruppe, file); }
          })
        }
      }
    }

    return res;
  }

  private getTasks(s: string): SearchResult[] {
    // suche nach geeigneten Tasks
    let res: SearchResult[] = [];

    const open = 'offen'.toLowerCase();

    for (let gruppe of this.faecherManager.mappenData.gruppen) {

      // durchsuche das Fach
      for (let task of gruppe.tasks) {
        if (task.description.toLowerCase().includes(s)) {
          res.push({
            header: task.description,
            description: `Im Fach '${gruppe.name}'`,
            routerLink: this.faecherManager.getLinkToGruppe(gruppe),
            type: task.closed ? 'task' : 'taskOpen'
          })
        }
        else if (task.categoryId && this.faecherManager.getCategoryNameToId(task.categoryId)?.toLowerCase().includes(s)) {
          res.push({
            header: task.description,
            description: `In '${this.faecherManager.getCategoryNameToId(task.categoryId)}' im Fach '${gruppe.name}'`,
            routerLink: this.faecherManager.getLinkToGruppe(gruppe),
            type: task.closed ? 'task' : 'taskOpen'
          })
        }
        else if (!task.closed && open.includes(s)) {
          res.push({
            header: task.description,
            description: `Offene Aufgabe im Fach '${gruppe.name}'`,
            routerLink: this.faecherManager.getLinkToGruppe(gruppe),
            type: task.closed ? 'task' : 'taskOpen'
          })
        }
      }
    }

    return res;
  }

  private getSettings(s: string): SearchResult[] {
    // Durchsuche die Einstellungen
    const content = [ 'Kategorien', 'Konfiguration' ];

    let res: SearchResult[] = [];

    for (let c of content) {
      if (c.toLowerCase().includes(s)) {
        res.push({
          header: c,
          description: 'In den Einstellungen',
          routerLink: '/settings/',
          type: 'setting'
        })
      }
    }

    for (let c of this.faecherManager.mappenData.categories) {
      if (c.name.toLowerCase().includes(s)) {
        res.push({
          header: c.name,
          description: 'Kategorie',
          routerLink: '/settings/',
          type: 'setting'
        });
      }
    }

    return res;
  }

  private getAdditionalPlaces(s: string): SearchResult[] {
    // Suche nach besonderen Plätzen
    const places: { name: string, link: string }[] = [
      {
        name: 'Übersicht',
        link: '/mappen/'
      },
      {
        name: 'Einstellungen',
        link: '/settings/'
      }
    ];

    let res: SearchResult[] = [];

    for (let place of places) {
      if (place.name.toLowerCase().includes(s)) {
        res.push({
          header: place.name,
          description: '',
          routerLink: place.link,
          type: 'place'
        })
      }
    }

    return res;
  }

  constructor(private readonly faecherManager: MappenManagerService) { }
}

export interface SearchResult {
  header: string,
  description: string,
  type: 'mappe' | 'gruppe' | 'file' | 'task' | 'taskOpen' | 'whiteboard' | 'setting' | 'place' | 'editor',
  routerLink: string,
  additionalClickAction?: () => void
}
