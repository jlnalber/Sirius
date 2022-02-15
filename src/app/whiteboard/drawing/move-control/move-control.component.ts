import { MatSliderChange, MatSliderModule } from '@angular/material/slider';
import { Component, OnInit } from '@angular/core';
import { BoardModes, BoardService } from 'src/app/features/board.service';

@Component({
  selector: 'app-move-control',
  templateUrl: './move-control.component.html',
  styleUrls: ['./move-control.component.scss']
})
export class MoveControlComponent implements OnInit {

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
      let realValue = 1 / (Math.sqrt(event.value) / 20);
      this.boardService.canvas.zoom = realValue;
    }
  }

}
