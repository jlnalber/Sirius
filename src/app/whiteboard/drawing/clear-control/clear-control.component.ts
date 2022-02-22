import { BoardService } from 'src/app/features/board.service';
import { Control } from 'src/app/global/control';
import { Component, OnInit } from '@angular/core';
import { BottomControl } from 'src/app/global/bottomControl';

@Component({
  selector: 'app-clear-control',
  templateUrl: './clear-control.component.html',
  styleUrls: ['./clear-control.component.scss']
})
export class ClearControlComponent implements OnInit {

  public click() {

  }

  constructor(public boardService: BoardService) { }

  ngOnInit(): void {
  }

}
