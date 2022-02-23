import { Board } from 'src/app/global/board/board';
import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { BasicControl } from 'src/app/global/controls/basicControl';

@Component({
  selector: 'app-back-control',
  templateUrl: './back-control.component.html',
  styleUrls: ['./back-control.component.scss']
})
export class BackControlComponent extends BasicControl implements AfterViewInit {

  @Input() board!: Board;

  @Input() enabled = true;

  public onClick = () => {
    
  }

  constructor() {
    super();
  }

  ngAfterViewInit(): void {
    this.afterViewInit.emit();
  }

}
