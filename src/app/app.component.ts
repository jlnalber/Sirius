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

  constructor(private readonly location: Location) {
    /*this.location.onUrlChange((url: string, state: unknown) => {
      console.log(url, state);
    })*/
  }

  goBackUrl(): string {
    let path = this.location.path();
    let index = path.lastIndexOf('/')
    if (index > -1) {
      console.log(path.substring(0, index));
      return path.substring(0, index);
    }
    return '..';
    //this.location.go('..');
    //console.log(this.location.path())
  }
}