import { AfterViewInit, Component, Input, ChangeDetectorRef } from '@angular/core';
import { Board } from 'src/app/whiteboard/global-whiteboard/board/board';
import { BasicControl } from 'src/app/whiteboard/global-whiteboard/controls/basicControl';

@Component({
  selector: 'whiteboard-fullscreen-control',
  templateUrl: './fullscreen-control.component.html',
  styleUrls: ['./fullscreen-control.component.scss']
})
export class FullscreenControlComponent extends BasicControl implements AfterViewInit {

  @Input() board!: Board;
  @Input() enabled = true;

  public get fullscreen(): boolean {
    return document.fullscreenElement != null;
  }

  public onClick = () => {
    if (this.fullscreen) {
      document.exitFullscreen();
    }
    else {
      document.documentElement.requestFullscreen();
    }
    setTimeout(() => this.ref.detectChanges(), 0);
  }

  constructor(private readonly ref: ChangeDetectorRef) {
    super();
  }

  ngAfterViewInit(): void {
    this.afterViewInit.emit();
  }

}