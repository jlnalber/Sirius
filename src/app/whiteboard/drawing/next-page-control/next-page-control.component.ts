import { BasicControl } from 'src/app/global/controls/basicControl';
import { Board } from 'src/app/global/board/board';
import { Component, Input, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-next-page-control',
  templateUrl: './next-page-control.component.html',
  styleUrls: ['./next-page-control.component.scss']
})
export class NextPageControlComponent extends BasicControl implements AfterViewInit {

  @Input() board!: Board;

  @Input() enabled = true;

  public onClick = () => {
    
  }

  constructor() {
    super();
  }

  ngAfterViewInit(): void {
  }

}
