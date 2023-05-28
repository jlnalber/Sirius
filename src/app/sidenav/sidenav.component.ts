import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MappenManagerService } from '../faecher/global/services/mappen-manager.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  @Input()
  opened: boolean = false;
  @Output()
  openedChange = new EventEmitter<boolean>();

  constructor(public mappenManager: MappenManagerService) { }

  ngOnInit(): void {

  }

}
