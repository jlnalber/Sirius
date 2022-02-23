import { BasicControl } from 'src/app/global/controls/basicControl';
import { Board } from 'src/app/global/board/board';
import { Component, Input, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-file-control',
  templateUrl: './file-control.component.html',
  styleUrls: ['./file-control.component.scss']
})
export class FileControlComponent extends BasicControl implements AfterViewInit {

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
