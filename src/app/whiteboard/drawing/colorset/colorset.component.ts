import { Component, Input, OnInit } from '@angular/core';
import { Color } from 'src/app/global/color';
import { Stroke } from 'src/app/global/stroke';

@Component({
  selector: 'app-colorset',
  templateUrl: './colorset.component.html',
  styleUrls: ['./colorset.component.scss']
})
export class ColorsetComponent implements OnInit {

  @Input() stroke!: Stroke;
  @Input() colors: Color[] = [
    new Color(0, 0, 0),
    new Color(255, 0, 0),
    new Color(0, 255, 0),
    new Color(0, 0, 255),
    new Color(255, 255, 0),
    new Color(255, 0, 255),
    new Color(0, 255, 255),
    new Color(255, 255, 255)
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
