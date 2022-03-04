import { Component, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Board } from 'src/app/whiteboard/global-whiteboard/board/board';
import { Color } from 'src/app/whiteboard/global-whiteboard/essentials/color';
import { cross, karo, line, none } from 'src/app/whiteboard/global-whiteboard/board/background/backgroundImage';

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

  @Input()
  backgroundImages: string[] = [
    none, line, karo, cross
  ]

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

  isLine() {
    return this.data.board.backgroundImage == line;
  }

  isKaro() {
    return this.data.board.backgroundImage == karo;
  }

  isNone() {
    return this.data.board.backgroundImage == none;
  }

  isCross() {
    return this.data.board.backgroundImage == cross;
  }

  setLine() {
    this.data.board.backgroundImage = line;
  }

  setKaro() {
    this.data.board.backgroundImage = karo;
  }

  setNone() {
    this.data.board.backgroundImage = none;
  }

  setCross() {
    this.data.board.backgroundImage = cross;
  }
}
