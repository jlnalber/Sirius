import { Component, Input, OnInit } from '@angular/core';
import { Color } from 'src/app/whiteboard/global-whiteboard/essentials/color';
import { Color as IColor } from 'src/app/whiteboard/global-whiteboard/interfaces/whiteboard';

@Component({
  selector: 'whiteboard-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent implements OnInit {

  @Input() color!: (Color | IColor);

  constructor() { }

  ngOnInit(): void {
  }

}
