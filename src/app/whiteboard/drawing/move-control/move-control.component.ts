import { MatSliderChange } from '@angular/material/slider';
import { Component, OnInit } from '@angular/core';
import { BoardModes, BoardService } from 'src/app/features/board.service';

const multiplier = 220;
const addition = 250;

@Component({
  selector: 'app-move-control',
  templateUrl: './move-control.component.html',
  styleUrls: ['./move-control.component.scss']
})
export class MoveControlComponent implements OnInit {

  public zoomToSlider(zoom: number): number {
    return (Math.pow(Math.E, zoom) * multiplier - addition);
    // return Math.pow(20 / zoom, 2);
  }

  public getSliderValue(): number {
    if (this.boardService.canvas) {
      return this.zoomToSlider(this.boardService.canvas.zoom);
    }
    return 1;
  }

  public sliderToZoom(slider: number): number {
    //return 20 / Math.sqrt(slider);
    return Math.log((slider + addition) / multiplier)
  }

  active: boolean = false;

  public isMoving(): boolean {
    let res = this.boardService.mode == BoardModes.Move;
    if (!res && !this.active) this.active = true;
    return res;
  }

  public click(): void {;
    this.active = !this.active;
    this.boardService.mode = BoardModes.Move;
  }

  constructor(public readonly boardService: BoardService) { }

  ngOnInit(): void {
  }

  public onSliderChange(event: MatSliderChange): void {
    if (event.value && this.boardService.canvas) {
      let realValue = this.sliderToZoom(event.value);
      this.boardService.canvas.zoom = realValue;
    }
  }

}
