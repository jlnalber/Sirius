import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Board } from 'src/app/global/board/board';
import { BasicControl } from 'src/app/global/controls/basicControl';

@Component({
  selector: 'app-save-control',
  templateUrl: './save-control.component.html',
  styleUrls: ['./save-control.component.scss']
})
export class SaveControlComponent extends BasicControl implements AfterViewInit {

  @Input() board!: Board;
  @Input() enabled = true;

  public onClick = () => {
    this.board.downloadWhiteboard();
  }

  constructor() {
    super();
  }

  ngAfterViewInit(): void {
    this.afterViewInit.emit();
  }

}
