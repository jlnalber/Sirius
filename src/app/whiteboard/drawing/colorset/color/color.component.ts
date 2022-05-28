import { ColorPickerDialogComponent, DialogData } from './../color-picker-dialog/color-picker-dialog.component';
import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Color } from 'src/app/whiteboard/global-whiteboard/essentials/color';
import { Color as IColor } from 'src/app/whiteboard/global-whiteboard/interfaces/whiteboard';
import { sameColorAs } from 'src/app/whiteboard/global-whiteboard/essentials/utils';

@Component({
  selector: 'whiteboard-color',
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.scss']
})
export class ColorComponent implements OnInit {

  @Input() color!: (Color | IColor);
  @Input() listener!: ((c: Color | IColor) => void);
  @Input() currentColor!: () => (Color | IColor);

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  onDblClick() {
    const dialogRef = this.dialog.open(ColorPickerDialogComponent, {
      data: {
        color: this.color instanceof Color ? this.color.copy() : this.color
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined && result != "") {
        let res = result as DialogData;
        if (this.color instanceof Color) {
          this.color.setTo(res.color);
        }
        else {
          this.color = res.color;
        }
        this.listener(this.color);
      }
    });
  }

  sameColorAs(color: IColor | Color) {
    return sameColorAs(color, this.color);
  }

}
