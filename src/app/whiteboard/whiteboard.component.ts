import { Component, Input, OnInit } from '@angular/core';
import { Color } from '../global/color';
import { Stroke } from '../global/stroke';

@Component({
  selector: 'app-whiteboard',
  templateUrl: './whiteboard.component.html',
  styleUrls: ['./whiteboard.component.scss']
})
export class WhiteboardComponent implements OnInit {

  @Input() stroke: Stroke = new Stroke(new Color(255, 0, 0, 255), 3, 'round');

  constructor() { }

  ngOnInit(): void {
  }

}
