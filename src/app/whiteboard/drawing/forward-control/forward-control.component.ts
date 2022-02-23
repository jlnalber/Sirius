import { BasicControl } from 'src/app/global/controls/basicControl';
import { Board } from 'src/app/global/board/board';
import { Component, Input, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-forward-control',
  templateUrl: './forward-control.component.html',
  styleUrls: ['./forward-control.component.scss']
})
export class ForwardControlComponent extends BasicControl implements AfterViewInit {

  @Input() board!: Board;

  @Input() enabled = true;

  public onClick = () => {
    if (this.enabled) {
      
    }
  }

  constructor() {
    super();
  }

  ngAfterViewInit(): void {
    this.afterViewInit.emit();
  }

}
