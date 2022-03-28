import { AfterViewInit, Component, Input } from '@angular/core';
import { Board } from 'src/app/whiteboard/global-whiteboard/board/board';
import { BasicControl } from 'src/app/whiteboard/global-whiteboard/controls/basicControl';

@Component({
  selector: 'whiteboard-mirror-element-vertically-control',
  templateUrl: './mirror-element-vertically-control.component.html',
  styleUrls: ['./mirror-element-vertically-control.component.scss']
})
export class MirrorElementVerticallyControlComponent extends BasicControl implements AfterViewInit {

  @Input() board!: Board;

  @Input() enabled = true;

  public onClick = () => {
    if (this.board.selector) {
      let outerRect = this.board.selector.getSVGElPos();

      for (let svgEl of this.board.selector.svgElements) {
        // turn the element around
        if (svgEl.scaleX != undefined) {
          svgEl.scaleX *= -1;
        }
        else {
          svgEl.scaleX = -1;
        }
        
        // then justify it
        let translateX = svgEl.translateX ?? 0;
        let offset = 2 * (outerRect.x - translateX) + outerRect.width + translateX;
        svgEl.translateX = offset;
      }

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
