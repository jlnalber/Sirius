import { Component, Input, OnInit, Output } from '@angular/core';
import { Color } from 'src/app/global/color';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent implements OnInit {

  @Input() color!: Color;

  constructor() { }

  ngOnInit(): void {
  }

}
