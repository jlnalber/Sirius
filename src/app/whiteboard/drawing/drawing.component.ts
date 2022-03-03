import { Component, Input, OnInit } from '@angular/core';
import { Board } from '../global-whiteboard/board/board';
import { WhiteboardConfig } from '../global-whiteboard/interfaces/whiteboard.config';

@Component({
  selector: 'whiteboard-drawing',
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
  }

}
