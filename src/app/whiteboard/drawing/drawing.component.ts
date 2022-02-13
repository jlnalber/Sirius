import { Component, Input, OnInit } from '@angular/core';
import { Color } from 'src/app/global/color';
import { Stroke } from 'src/app/global/stroke';

@Component({
  selector: 'app-drawing',
  templateUrl: './drawing.component.html',
  styleUrls: ['./drawing.component.scss']
})
export class DrawingComponent implements OnInit {

  @Input() width: number = 100;
  @Input() height: number = 100;

  @Input() stroke!: Stroke;

  constructor() { }

  ngOnInit(): void {
  }

}
