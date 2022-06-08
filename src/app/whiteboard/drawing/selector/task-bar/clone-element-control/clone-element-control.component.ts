import { AfterViewInit, Component, Input } from '@angular/core';
import { Board } from 'src/app/whiteboard/global-whiteboard/board/board';
import { BasicControl } from 'src/app/whiteboard/global-whiteboard/controls/basicControl';
import { SVGElementWrapper } from '../../SVGElementWrapper';

@Component({
  selector: 'whiteboard-clone-element-control',
  templateUrl: './clone-element-control.component.html',
  styleUrls: ['./clone-element-control.component.scss']
})
export class CloneElementControlComponent extends BasicControl implements AfterViewInit {

  @Input() board!: Board;

  @Input() enabled = true;

  public onClick = () => {
    // clone the selected objects
    if (this.board.selector) {
      let svgEls: SVGElement[] = [];

      for (let svgEl of this.board.selector.svgElements) {
        if (svgEl.svgEl) {
          let newEl = svgEl.svgEl.cloneNode(true) as SVGElement;
          this.board.addElement(newEl);
          svgEls.push(newEl);

          // move the elements by the offset
          const offset = 40;
          let svg = new SVGElementWrapper(this.board, newEl);
          if (svg.translateX) {
            svg.translateX += offset;
          }
          else {
            svg.translateX = offset;
          }
          if (svg.translateY) {
            svg.translateY += offset;
          }
          else {
            svg.translateY = offset;
          }
        }
      }

      // focus on the newly cloned elements
      this.board.selector.svgEl = svgEls;

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
