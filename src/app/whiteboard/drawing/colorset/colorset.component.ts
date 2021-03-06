import { Component, Input, OnInit } from '@angular/core';
import { Color } from '../../global-whiteboard/essentials/color';
import { Color as IColor } from '../../global-whiteboard/interfaces/whiteboard';

@Component({
  selector: 'whiteboard-colorset',
  templateUrl: './colorset.component.html',
  styleUrls: ['./colorset.component.scss']
})
export class ColorsetComponent implements OnInit {

  @Input() defaultColors: (Color | IColor)[] = [
    new Color(0, 0, 0),
    new Color(255, 0, 0),
    new Color(0, 255, 0),
    new Color(0, 0, 255),
    new Color(0, 0, 127),
    new Color(255, 255, 0),
    new Color(255, 165, 0),
    new Color(255, 0, 255),
    new Color(0, 255, 255),
    new Color(255, 255, 255),
    new Color(171, 179, 237, 127),
    new Color(237, 171, 237, 127),
    new Color(237, 237, 71, 127),
    new Color(237, 191, 71, 127),
    new Color(71, 237, 71, 127)
  ]

  @Input() colors: (Color | IColor)[] = [];

  @Input() listener!: ((c: Color | IColor) => void);
  @Input() currentColor!: () => Color | IColor;

  constructor() { }

  ngOnInit(): void {
  }

}
