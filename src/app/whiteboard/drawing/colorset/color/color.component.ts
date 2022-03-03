import { ColorPickerDialogComponent, DialogData } from './../color-picker-dialog/color-picker-dialog.component';
import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Color } from 'src/app/whiteboard/global-whiteboard/essentials/color';

@Component({
  selector: 'whiteboard-color',
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.scss']
})
export class ColorComponent implements OnInit {

  @Input() color!: Color;
  @Input() listener!: ((c: Color) => void);
  @Input() currentColor!: () => Color;

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  onDblClick() {
    const dialogRef = this.dialog.open(ColorPickerDialogComponent, {
      data: {
        color: this.color.copy()
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined && result != "") {
        let res = result as DialogData;
        this.color.setTo(res.color);
        this.listener(this.color);
      }
    });
  }

}
