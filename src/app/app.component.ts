import { SearchService } from './global/services/search.service';
import { ActiveService } from './global/services/active-whiteboard-service.service';
import { FaecherManagerService } from 'src/app/faecher/global/services/faecher-manager.service';
import { Component, HostListener, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Sirius';
  opened = false;

  constructor(private readonly location: Location, public readonly activeWhiteboardService: ActiveService, public readonly searchService: SearchService, public readonly faecherManager: FaecherManagerService) {
    /*this.location.onUrlChange((url: string, state: unknown) => {
      console.log(url, state);
    })*/
  }

  goBackUrl(): string {
    let path = this.location.path();
    let index = path.lastIndexOf('/')
    if (index > -1) {
      return path.substring(0, index);
    }
    return '..';
    //this.location.go('..');
    //console.log(this.location.path())
  }
}