import { BasicControl } from 'src/app/whiteboard/global-whiteboard/controls/basicControl';
import { Component, AfterViewInit, Input } from '@angular/core';
import { Board } from 'src/app/whiteboard/global-whiteboard/board/board';

@Component({
  selector: 'whiteboard-delete-element-control',
  templateUrl: './delete-element-control.component.html',
  styleUrls: ['./delete-element-control.component.scss']
})
export class DeleteElementControlComponent extends BasicControl implements AfterViewInit {

  @Input() board!: Board;

  @Input() enabled = true;

  public onClick = () => {
    if (this.board.selector) {
      for (let svgEl of this.board.selector.svgElements) {
        if (svgEl.svgEl) {
          this.board.removeElement(svgEl.svgEl);
        }
      }

      this.board.selector.svgEl = undefined;
      this.board.markChange();
    }
  }

  constructor() {
    super();
  }

  ngAfterViewInit(): void {
    this.afterViewInit.emit();
  }

}
