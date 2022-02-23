import { WhiteboardConfig } from './../../interfaces/whiteboard.config';
import { Component, Input, OnInit } from '@angular/core';
import { Board } from 'src/app/global/board/board';
import { Color } from 'src/app/global/color';
import { Stroke } from 'src/app/global/stroke';

@Component({
  selector: 'app-drawing',
  templateUrl: './drawing.component.html',
  styleUrls: ['./drawing.component.scss']
})
export class DrawingComponent implements OnInit {

  @Input() board!: Board;

  @Input() whiteboardConfig!: WhiteboardConfig;
  
  @Input() width: number = 100;
  @Input() height: number = 100;

  constructor() { }

  ngOnInit(): void {
    console.log(this.whiteboardConfig)
  }

}
