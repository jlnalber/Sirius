import { BasicControl } from 'src/app/whiteboard/global-whiteboard/controls/basicControl';
import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { Board } from 'src/app/whiteboard/global-whiteboard/board/board';

@Component({
  selector: 'whiteboard-save-as-picture-control',
  templateUrl: './save-as-picture-control.component.html',
  styleUrls: ['./save-as-picture-control.component.scss']
})
export class SaveAsPictureControlComponent extends BasicControl implements AfterViewInit {

  @Input() board!: Board;
  @Input() enabled = true;

  public onClick = () => {
    this.board.downloadSVG();
  }

  constructor() {
    super();
  }

  ngAfterViewInit(): void {
    this.afterViewInit.emit();
  }

}
