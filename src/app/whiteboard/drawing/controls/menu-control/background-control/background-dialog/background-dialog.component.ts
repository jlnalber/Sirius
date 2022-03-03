import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BackgroundImageCross } from 'src/app/whiteboard/global-whiteboard/board/background/cross.backgroundImage';
import { BackgroundImageKaro } from 'src/app/whiteboard/global-whiteboard/board/background/karo.backgroundImage';
import { BackgroundImageLine } from 'src/app/whiteboard/global-whiteboard/board/background/line.backgroundImage';
import { BackgroundImageNone } from 'src/app/whiteboard/global-whiteboard/board/background/none.bgImage';
import { Board } from 'src/app/whiteboard/global-whiteboard/board/board';
import { Color } from 'src/app/whiteboard/global-whiteboard/essentials/color';

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

  listener = (c: Color) => {
    this.data.board.backgroundColor = c;
  }

  currentColor = () => {
    return this.data.board.backgroundColor;
  }

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

  lineBG = new BackgroundImageLine();
  karoBG = new BackgroundImageKaro();
  noneBG = new BackgroundImageNone();
  crossBG = new BackgroundImageCross();

  isLine() {
    return this.data.board.backgroundImage instanceof BackgroundImageLine;
  }

  isKaro() {
    return this.data.board.backgroundImage instanceof BackgroundImageKaro;
  }

  isNone() {
    return this.data.board.backgroundImage instanceof BackgroundImageNone;
  }

  isCross() {
    return this.data.board.backgroundImage instanceof BackgroundImageCross;
  }

  setLine() {
    this.data.board.backgroundImage = new BackgroundImageLine();
  }

  setKaro() {
    this.data.board.backgroundImage = new BackgroundImageKaro();
  }

  setNone() {
    this.data.board.backgroundImage = new BackgroundImageNone();
  }

  setCross() {
    this.data.board.backgroundImage = new BackgroundImageCross();
  }
}
