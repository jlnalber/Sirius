import { MatSliderChange } from '@angular/material/slider';
import { Component, Input, AfterViewInit } from '@angular/core';
import { Control } from 'src/app/whiteboard/global-whiteboard/controls/control';
import { Board, BoardModes } from 'src/app/whiteboard/global-whiteboard/board/board';

const multiplier = 220;
const addition = 250;

@Component({
  selector: 'whiteboard-move-control',
  templateUrl: './move-control.component.html',
  styleUrls: ['./move-control.component.scss']
})
export class MoveControlComponent extends Control implements AfterViewInit {

  @Input() board!: Board;

  @Input() enabled = true;

  public zoomToSlider(zoom: number): number {
    return (Math.pow(Math.E, zoom) * multiplier - addition);
    // return Math.pow(20 / zoom, 2);
  }

  public getSliderValue(): number {
    if (this.board.canvas) {
      return this.zoomToSlider(this.board.zoom);
    }
    return 1;
  }

  public sliderToZoom(slider: number): number {
    //return 20 / Math.sqrt(slider);
    return Math.log((slider + addition) / multiplier)
  }

  constructor() {
    super(BoardModes.Move);
  }

  ngAfterViewInit(): void {
    this.afterViewInit.emit();
  }

  public onSliderChange(event: MatSliderChange): void {
    if (event.value) {
      let realValue = this.sliderToZoom(event.value);
      this.board.zoomTo(realValue);
    }
  }

}
