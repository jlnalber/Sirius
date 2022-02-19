import { Component, OnInit } from '@angular/core';
import { BoardService } from 'src/app/features/board.service';
import { BottomControl } from 'src/app/global/bottomControl';

@Component({
  selector: 'app-menu-control',
  templateUrl: './menu-control.component.html',
  styleUrls: ['./menu-control.component.scss']
})
export class MenuControlComponent extends BottomControl implements OnInit {

  constructor(boardService: BoardService) {
    super(boardService, () => { return true;}, () => {});
  }

  ngOnInit(): void {
  }

}
