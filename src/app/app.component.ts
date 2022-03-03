import { FaecherManagerService } from 'src/app/faecher/global/services/faecher-manager.service';
import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Sirius';
  opened = false;

  constructor() { }
}