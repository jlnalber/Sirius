import { Component, Input, OnInit } from '@angular/core';
import { Color } from '../global/color';
import { Stroke } from '../global/stroke';

@Component({
  selector: 'app-whiteboard',
  templateUrl: './whiteboard.component.html',
  styleUrls: ['./whiteboard.component.scss']
})
export class WhiteboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
