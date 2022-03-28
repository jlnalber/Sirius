import { AfterViewInit, Component, Input } from '@angular/core';
import { Board } from 'src/app/whiteboard/global-whiteboard/board/board';
import { BasicControl } from 'src/app/whiteboard/global-whiteboard/controls/basicControl';

@Component({
  selector: 'whiteboard-mirror-element-horizontally-control',
  templateUrl: './mirror-element-horizontally-control.component.html',
  styleUrls: ['./mirror-element-horizontally-control.component.scss']
})
export class MirrorElementHorizontallyControlComponent extends BasicControl implements AfterViewInit {

  @Input() board!: Board;

  @Input() enabled = true;

  public onClick = () => {
    if (this.board.selector) {
      let outerRect = this.board.selector.getSVGElPos();

      for (let svgEl of this.board.selector.svgElements) {
        // turn the element around
        if (svgEl.scaleY != undefined) {
          svgEl.scaleY *= -1;
        }
        else {
          svgEl.scaleY = -1;
        }
        
        // then justify it
        let translateY = svgEl.translateY ?? 0;
        let offset = 2 * (outerRect.y - translateY) + outerRect.height + translateY;
        svgEl.translateY = offset;
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
