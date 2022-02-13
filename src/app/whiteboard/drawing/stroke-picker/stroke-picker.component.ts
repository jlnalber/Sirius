import { Component, Input, OnInit } from '@angular/core';
import { Stroke } from 'src/app/global/stroke';

@Component({
  selector: 'app-stroke-picker',
  templateUrl: './stroke-picker.component.html',
  styleUrls: ['./stroke-picker.component.scss']
})
export class StrokePickerComponent implements OnInit {

  @Input() stroke!: Stroke;

  constructor() { }

  ngOnInit(): void {
  }

}
