import { Component, OnInit, Input } from '@angular/core';
import { Stroke } from 'src/app/global/stroke';
import { Color } from 'src/app/global/color';

@Component({
  selector: 'app-color',
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.scss']
})
export class ColorComponent implements OnInit {

  @Input() stroke!: Stroke;
  @Input() color!: Color;

  constructor() { }

  ngOnInit(): void {
  }

}
