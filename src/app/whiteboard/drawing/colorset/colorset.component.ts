import { Board } from 'src/app/global/board/board';
import { Component, Input, OnInit } from '@angular/core';
import { Color } from 'src/app/global/color';
import { Stroke } from 'src/app/global/stroke';

@Component({
  selector: 'app-colorset',
  templateUrl: './colorset.component.html',
  styleUrls: ['./colorset.component.scss']
})
export class ColorsetComponent implements OnInit {

  @Input() defaultColors: Color[] = [
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

  @Input() colors: Color[] = [];

  @Input() listener!: ((c: Color) => void);
  @Input() currentColor!: () => Color;

  constructor() { }

  ngOnInit(): void {
  }

}
