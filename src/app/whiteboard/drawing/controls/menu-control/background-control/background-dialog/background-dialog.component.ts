import { MatSliderChange } from '@angular/material/slider';
import { Component, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Board, pixelsToMM } from 'src/app/whiteboard/global-whiteboard/board/board';
import { Color } from 'src/app/whiteboard/global-whiteboard/essentials/color';
import { Color as IColor } from 'src/app/whiteboard/global-whiteboard/interfaces/whiteboard';
import { cross, karo, line, none, music } from 'src/app/whiteboard/global-whiteboard/board/background/backgroundImage';

export interface DialogData {
  board: Board
}

@Component({
  selector: 'whiteboard-background-dialog',
  templateUrl: './background-dialog.component.html',
  styleUrls: ['./background-dialog.component.scss']
})
export class BackgroundDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<BackgroundDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  listener = (c: Color | IColor) => {
    this.data.board.backgroundColor = c instanceof Color ? c : Color.from(c);
  }

  currentColor = () => {
    return this.data.board.backgroundColor;
  }

  get backgroundScale(): number {
    return 1 / this.data.board.backgroundScale;
  }
  set backgroundScale(value: number) {
    this.data.board.backgroundScale = 1 / value;
  }
  triggerBackgroundScale(event: MatSliderChange) {
    if (event.value != null) {
      this.backgroundScale = event.value;
    }
  }
  formatLabel(value: number): string {
    let scale = 1 / value;

    let res = Math.round(scale * 100) / 100;

    return res.toLocaleString();
  }

  @Input()
  backgroundImages: [string, number][] = [
    [none, 0],
    [line, 75],
    [karo, 20],
    [cross, 40],
    [music, 75]
  ] // the numbers indicate the size (not used)

  colors: Color[] = [
    new Color(18, 52, 19),
    new Color(0, 0, 0),
    new Color(255, 255, 255),
    new Color(38, 39, 52),
    new Color(79, 79, 255),
    new Color(255, 79, 79),
    new Color(79, 255, 79),
    new Color(255, 255, 79),
    new Color(79, 255, 255),
    new Color(255, 79, 255),
    new Color(178, 178, 178),
    new Color(178, 178, 255),
    new Color(255, 178, 178),
    new Color(178, 255, 178),
    new Color(178, 178, 45),
    new Color(45, 178, 178),
    new Color(178, 45, 178)
  ]

}
