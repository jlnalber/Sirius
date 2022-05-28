import { FaecherManagerService } from 'src/app/faecher/global/services/faecher-manager.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  public searchResults: SearchResult[] = [
    {
      header: 'Header',
      description: 'Lorem ipsum dolor sit atem.',
      type: 'fach',
      routerLink: '/faecher/fach/einheiten/einheit',
      additionalClickAction: () => { console.log('I was clicked!'); }
    },
    {
      header: 'Header',
      description: 'Lorem ipsum dolor sit atem.',
      type: 'einheit',
      routerLink: '/faecher/fach/einheiten/einheit',
      additionalClickAction: () => { console.log('I was clicked!'); }
    },
    {
      header: 'Header',
      description: 'Lorem ipsum dolor sit atem.',
      type: 'task',
      routerLink: '/faecher/fach/einheiten/einheit',
      additionalClickAction: () => { console.log('I was clicked!'); }
    },
    {
      header: 'Header',
      description: 'Lorem ipsum dolor sit atem.',
      type: 'whiteboard',
      routerLink: '/faecher/fach/einheiten/einheit',
      additionalClickAction: () => { console.log('I was clicked!'); }
    },
    {
      header: 'Header',
      description: 'Lorem ipsum dolor sit atem.',
      type: 'file',
      routerLink: '/faecher/fach/einheiten/einheit',
      additionalClickAction: () => { console.log('I was clicked!'); }
    },
    {
      header: 'Header',
      description: 'Lorem ipsum dolor sit atem.',
      type: 'setting',
      routerLink: '/faecher/fach/einheiten/einheit',
      additionalClickAction: () => { console.log('I was clicked!'); }
    }
  ];

  private _input: string = "";
  public get input(): string {
    return this._input;
  }
  public set input(value: string) {
    this._input = value.trim();
    this.reload();
  }

  private reload(): void {
    let results: SearchResult[] = [];

    let input = this.input.toLowerCase().trim();

    // Suche in den jeweiligen Kategorien
    results.push(...this.getFaecher(input));
    results.push(...this.getEinheiten(input));
    results.push(...this.getWhiteboards(input));
    results.push(...this.getFiles(input));
    results.push(...this.getTasks(input));
    results.push(...this.getSettings(input));

    this.searchResults = results;
  }

  private getFaecher(s: string): SearchResult[] {
    // suche nach geeigneten Fächern
    let res: SearchResult[] = [];

    for (let fach of this.faecherManager.faecherData.faecher) {
      if (fach.name.toLowerCase().includes(s)) {
        res.push({
          header: fach.name, 
          description: '',
          routerLink: this.faecherManager.getLinkToFach(fach),
          type: 'fach'
        });
      }
      else if (fach.description.toLowerCase().includes(s)) {
        res.push({
          header: fach.name,
          description: fach.description,
          routerLink: this.faecherManager.getLinkToFach(fach),
          type: 'fach'
        })
      }
      else if (fach.notes.toLowerCase().includes(s)) {
        res.push({
          header: fach.name,
          description: fach.notes,
          routerLink: this.faecherManager.getLinkToFach(fach),
          type: 'fach'
        })
      }
    }

    return res;
  }

  private getEinheiten(s: string): SearchResult[] {
    // suche nach geeigneten Einheiten
    let res: SearchResult[] = [];

    for (let fach of this.faecherManager.faecherData.faecher) {
      for (let einheit of fach.einheiten) {
        if (einheit.topic.toLowerCase().includes(s)) {
          res.push({
            header: einheit.topic,
            description: `Im Fach '${fach.name}'`,
            routerLink: this.faecherManager.getLinkToEinheit(fach, einheit),
            type: 'einheit'
          });
        }
        else if (einheit.description.toLowerCase().includes(s)) {
          res.push({
            header: einheit.topic,
            description: einheit.description,
            routerLink: this.faecherManager.getLinkToEinheit(fach, einheit),
            type: 'einheit'
          })
        }
        else if (einheit.notes.toLowerCase().includes(s)) {
          res.push({
            header: einheit.topic,
            description: einheit.notes,
            routerLink: this.faecherManager.getLinkToEinheit(fach, einheit),
            type: 'einheit'
          })
        }
      }
    }

    return res;
  }

  private getWhiteboards(s: string): SearchResult[] {
    // suche nach geeigneten Whiteboards
    let res: SearchResult[] = [];

    for (let fach of this.faecherManager.faecherData.faecher) {

      // durchsuche das Fach
      for (let whiteboard of fach.whiteboards) {
        if (whiteboard.name.toLowerCase().includes(s)) {
          res.push({
            header: whiteboard.name,
            description: `Im Fach '${fach.name}'`,
            routerLink: this.faecherManager.getLinkToWhiteboard(fach, undefined, whiteboard),
            type: 'whiteboard'
          })
        }
        else if (whiteboard.categoryId && this.faecherManager.getCategoryNameToId(whiteboard.categoryId).toLowerCase().includes(s)) {
          res.push({
            header: whiteboard.name,
            description: `In ${this.faecherManager.getCategoryNameToId(whiteboard.categoryId)} im Fach '${fach.name}'`,
            routerLink: this.faecherManager.getLinkToWhiteboard(fach, undefined, whiteboard),
            type: 'whiteboard'
          })
        }
      }

      // durchsuche die Einheiten
      for (let einheit of fach.einheiten) {
        for (let whiteboard of einheit.whiteboards) {
          if (whiteboard.name.toLowerCase().includes(s)) {
            res.push({
              header: whiteboard.name,
              description: `In der Einheit '${einheit.topic}' im Fach '${fach.name}'`,
              routerLink: this.faecherManager.getLinkToWhiteboard(fach, einheit, whiteboard),
              type: 'whiteboard'
            })
          }
          else if (whiteboard.categoryId && this.faecherManager.getCategoryNameToId(whiteboard.categoryId).toLowerCase().includes(s)) {
            res.push({
              header: whiteboard.name,
              description: `In ${this.faecherManager.getCategoryNameToId(whiteboard.categoryId)} in der Einheit '${einheit.topic}' im Fach '${fach.name}'`,
              routerLink: this.faecherManager.getLinkToWhiteboard(fach, einheit, whiteboard),
              type: 'whiteboard'
            })
          }
        }
      }
    }

    return res;
  }

  private getFiles(s: string): SearchResult[] {
    // suche nach geeigneten Dateien
    let res: SearchResult[] = [];

    for (let fach of this.faecherManager.faecherData.faecher) {

      // durchsuche das Fach
      for (let file of fach.files) {
        if (file.name.toLowerCase().includes(s)) {
          res.push({
            header: file.name,
            description: `Im Fach '${fach.name}'`,
            routerLink: this.faecherManager.getLinkToFach(fach),
            type: 'file',
            additionalClickAction: () => { this.faecherManager.openFile(fach, undefined, file); }
          })
        }
        else if (file.categoryId && this.faecherManager.getCategoryNameToId(file.categoryId).toLowerCase().includes(s)) {
          res.push({
            header: file.name,
            description: `In ${this.faecherManager.getCategoryNameToId(file.categoryId)} im Fach '${fach.name}'`,
            routerLink: this.faecherManager.getLinkToFach(fach),
            type: 'file',
            additionalClickAction: () => { this.faecherManager.openFile(fach, undefined, file); }
          })
        }
      }

      // durchsuche die Einheiten
      for (let einheit of fach.einheiten) {
        for (let file of einheit.files) {
          if (file.name.toLowerCase().includes(s)) {
            res.push({
              header: file.name,
              description: `In der Einheit '${einheit.topic}' im Fach '${fach.name}'`,
              routerLink: this.faecherManager.getLinkToEinheit(fach, einheit),
              type: 'file',
              additionalClickAction: () => { this.faecherManager.openFile(fach, einheit, file); }
            })
          }
          else if (file.categoryId && this.faecherManager.getCategoryNameToId(file.categoryId).toLowerCase().includes(s)) {
            res.push({
              header: file.name,
              description: `In ${this.faecherManager.getCategoryNameToId(file.categoryId)} in der Einheit '${einheit.topic}' im Fach '${fach.name}'`,
              routerLink: this.faecherManager.getLinkToEinheit(fach, einheit),
              type: 'file',
              additionalClickAction: () => { this.faecherManager.openFile(fach, einheit, file); }
            })
          }
        }
      }
    }

    return res;
  }

  private getTasks(s: string): SearchResult[] {
    // suche nach geeigneten Tasks
    let res: SearchResult[] = [];

    for (let fach of this.faecherManager.faecherData.faecher) {

      // durchsuche das Fach
      for (let task of fach.tasks) {
        if (task.description.toLowerCase().includes(s)) {
          res.push({
            header: task.description,
            description: `Im Fach '${fach.name}'`,
            routerLink: this.faecherManager.getLinkToFach(fach),
            type: task.closed ? 'task' : 'taskOpen'
          })
        }
        else if (task.categoryId && this.faecherManager.getCategoryNameToId(task.categoryId).toLowerCase().includes(s)) {
          res.push({
            header: task.description,
            description: `In ${this.faecherManager.getCategoryNameToId(task.categoryId)} im Fach '${fach.name}'`,
            routerLink: this.faecherManager.getLinkToFach(fach),
            type: task.closed ? 'task' : 'taskOpen'
          })
        }
      }

      // durchsuche die Einheiten
      for (let einheit of fach.einheiten) {
        for (let task of einheit.tasks) {
          if (task.description.toLowerCase().includes(s)) {
            res.push({
              header: task.description,
              description: `In der Einheit '${einheit.topic}' im Fach '${fach.name}'`,
              routerLink: this.faecherManager.getLinkToEinheit(fach, einheit),
              type: task.closed ? 'task' : 'taskOpen'
            })
          }
          else if (task.categoryId && this.faecherManager.getCategoryNameToId(task.categoryId).toLowerCase().includes(s)) {
            res.push({
              header: task.description,
              description: `In ${this.faecherManager.getCategoryNameToId(task.categoryId)} in der Einheit '${einheit.topic}' im Fach '${fach.name}'`,
              routerLink: this.faecherManager.getLinkToEinheit(fach, einheit),
              type: task.closed ? 'task' : 'taskOpen'
            })
          }
        }
      }
    }

    return res;
  }

  private getSettings(s: string): SearchResult[] {
    const content = [ 'Kategorien' ];

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

    return res;
  }

  constructor(private readonly faecherManager: FaecherManagerService) { }
}

export interface SearchResult {
  header: string,
  description: string,
  type: 'fach' | 'einheit' | 'file' | 'task' | 'taskOpen' | 'whiteboard' | 'setting',
  routerLink: string,
  additionalClickAction?: () => void
}
