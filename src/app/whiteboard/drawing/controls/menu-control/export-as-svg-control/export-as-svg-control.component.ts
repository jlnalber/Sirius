import { Component, AfterViewInit, Input } from '@angular/core';
import { Board } from 'src/app/whiteboard/global-whiteboard/board/board';
import { BasicControl } from 'src/app/whiteboard/global-whiteboard/controls/basicControl';

@Component({
  selector: 'whiteboard-export-as-svg-control',
  templateUrl: './export-as-svg-control.component.html',
  styleUrls: ['./export-as-svg-control.component.scss']
})
export class ExportAsSvgControlComponent extends BasicControl implements AfterViewInit {

  @Input() board!: Board;
  @Input() enabled = true;

  public onClick = async () => {
    this.board.downloadSVG();
  }

  constructor() {
    super();
  }

  ngAfterViewInit(): void {
    this.afterViewInit.emit();
  }

}
