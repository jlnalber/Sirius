import { BackgroundImageCross } from './../../../../../global/board/background/cross.backgroundImage copy';
import { BackgroundImageNone } from './../../../../../global/board/background/none.bgImage';
import { BackgroundImageKaro } from './../../../../../global/board/background/karo.backgroundImage';
import { BackgroundImageLine } from './../../../../../global/board/background/line.backgroundImage';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Board } from 'src/app/global/board/board';
import { Color } from 'src/app/global/color';

export interface DialogData {
  board: Board
}

@Component({
  selector: 'app-background-dialog',
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
