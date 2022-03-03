import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Fach } from '../faecher/global/interfaces/fach';
import { FaecherManagerService } from '../shared/faecher-manager.service';

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

  constructor(public faecherManager: FaecherManagerService) { }

  ngOnInit(): void {
    
  }

}
