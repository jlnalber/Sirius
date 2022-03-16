import { AfterViewInit, Component, Input } from '@angular/core';
import { Board } from 'src/app/whiteboard/global-whiteboard/board/board';
import { BottomControl } from 'src/app/whiteboard/global-whiteboard/controls/bottomControl';

@Component({
  selector: 'whiteboard-pages-control',
  templateUrl: './pages-control.component.html',
  styleUrls: ['./pages-control.component.scss']
})
export class PagesControlComponent extends BottomControl implements AfterViewInit {

  @Input() board!: Board;

  @Input() enabled = true;

  public openPanel: boolean = false;

  public override isActive = () => {
    return this.openPanel;
  }

  protected override secondClick = () => {
    this.openPanel = true;
  };

  protected firstClick?: () => void = () => {
    this.openPanel = false;
  }

  constructor() {
    super();
  }

  ngAfterViewInit(): void {
    this.afterViewInit.emit();
    this.board.onMouseStart.addListener(() => {
      this.openPanel = false;
    })
  }

}
