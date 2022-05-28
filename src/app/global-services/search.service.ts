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
            description: '',
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
            description: '',
            routerLink: this.faecherManager.getLinkToWhiteboard(fach, undefined, whiteboard),
            type: 'whiteboard'
          })
        }
        else if (whiteboard.categoryId && this.faecherManager.getCategoryNameToId(whiteboard.categoryId).toLowerCase().includes(s)) {
          res.push({
            header: whiteboard.name,
            description: `In: ${this.faecherManager.getCategoryNameToId(whiteboard.categoryId)}`,
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
              description: '',
              routerLink: this.faecherManager.getLinkToWhiteboard(fach, einheit, whiteboard),
              type: 'whiteboard'
            })
          }
          else if (whiteboard.categoryId && this.faecherManager.getCategoryNameToId(whiteboard.categoryId).toLowerCase().includes(s)) {
            res.push({
              header: whiteboard.name,
              description: `In: ${this.faecherManager.getCategoryNameToId(whiteboard.categoryId)}`,
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
    return [];
  }

  private getTasks(s: string): SearchResult[] {
    return [];
  }

  private getSettings(s: string): SearchResult[] {
    return [];
  }

  constructor(private readonly faecherManager: FaecherManagerService) { }
}

export interface SearchResult {
  header: string,
  description: string,
  type: 'fach' | 'einheit' | 'file' | 'task' | 'whiteboard' | 'setting',
  routerLink: string,
  additionalClickAction?: () => void
}
