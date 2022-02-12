import { FaecherManagerService } from 'src/app/shared/faecher-manager.service';
import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Sirius';
  opened = false;

  @HostListener('window:beforeunload', [ '$event' ])
  beforeUnloadHandler(_event: any) {
    this.faecherManager.saveInCache();
  }

  constructor(private readonly faecherManager: FaecherManagerService) { }
}