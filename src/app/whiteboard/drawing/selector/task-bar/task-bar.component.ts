import { Board } from './../../../global-whiteboard/board/board';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'whiteboard-task-bar',
  templateUrl: './task-bar.component.html',
  styleUrls: ['./task-bar.component.scss']
})
export class TaskBarComponent implements OnInit {

  @Input() board!: Board;

  constructor() { }

  ngOnInit(): void {
  }

}
