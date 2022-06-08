import { pixelsToMM } from './../../../../../global-whiteboard/board/board';
import { ChangeDetectorRef, Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Board } from 'src/app/whiteboard/global-whiteboard/board/board';
import { sameRect } from 'src/app/whiteboard/global-whiteboard/essentials/utils';
import { Rect } from 'src/app/whiteboard/global-whiteboard/interfaces/rect';

export interface DialogData {
  board: Board
}

const scale = pixelsToMM;
const min = 20;

type Presetting = [string, Rect | undefined, boolean];

const unlimitedPresetting: Presetting = [
  'Unbegrenzt',
  undefined,
  false
];
const customPresetting: Presetting = [
  'Benutzerdefiniertes Format',
  undefined,
  true
];

@Component({
  selector: 'whiteboard-format-dialog',
  templateUrl: './format-dialog.component.html',
  styleUrls: ['./format-dialog.component.scss']
})
export class FormatDialogComponent implements OnInit {

  public currentChosenFormat: Presetting;
  public customFormat: Rect;
  
  constructor(
    public dialogRef: MatDialogRef<FormatDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private readonly ref: ChangeDetectorRef
  ) {
    this.currentChosenFormat = customPresetting;
    this.customFormat = {
      x: this.data.board.format?.x ?? 0,
      y: this.data.board.format?.y ?? 0,
      width: (this.data.board.format?.width ?? 500) / scale,
      height: (this.data.board.format?.height ?? 500) / scale
    };

    if (this.data.board.format) {
      for (let p of this.presets) {
        if (sameRect(p[1], this.customFormat)) {
          this.currentChosenFormat = p;
        }
      }
    }
    else {
      this.currentChosenFormat = unlimitedPresetting;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

  @Input() presets: Presetting[] = [
    unlimitedPresetting,
    [
      'DIN A2',
      {
        x: 0,
        y: 0,
        width: 420,
        height: 594
      },
      false
    ],
    [
      'DIN A3',
      {
        x: 0,
        y: 0,
        width: 297,
        height: 420
      },
      false
    ],
    [
      'DIN A4',
      {
        x: 0,
        y: 0,
        width: 210,
        height: 297
      },
      false
    ],
    [
      'DIN A5',
      {
        x: 0,
        y: 0,
        width: 148,
        height: 210
      },
      false
    ],
    [
      'Legal',
      {
        x: 0,
        y: 0,
        width: 216,
        height: 356
      },
      false
    ],
    [
      'Letter',
      {
        x: 0,
        y: 0,
        width: 216,
        height: 279
      },
      false
    ],
    [
      'Executive',
      {
        x: 0,
        y: 0,
        width: 184,
        height: 267
      },
      false
    ],
    [
      'Invoice',
      {
        x: 0,
        y: 0,
        width: 140,
        height: 216
      },
      false
    ],
    customPresetting
  ]

  onAcceptClick(): void {
    
    let format = this.currentChosenFormat[1];
    if (this.currentChosenFormat[2]) {
      format = this.customFormat;
    }

    this.data.board.format = format ? {
      x: format.x,
      y: format.y,
      width: format.width * scale,
      height: format.height * scale
    } : undefined;

    this.dialogRef.close();

    this.ref.detectChanges();
  }

  isUnlimited(): boolean {
    return this.currentChosenFormat == unlimitedPresetting;
  }

  acceptCustomFormat(): boolean {
    return this.currentChosenFormat != customPresetting || (this.customFormat.width >= min && this.customFormat.height >= min);
  }

}
