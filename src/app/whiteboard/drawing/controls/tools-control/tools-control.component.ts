import { BottomControl } from 'src/app/whiteboard/global-whiteboard/controls/bottomControl';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { BasicControl } from 'dist/whiteboard/lib/global-whiteboard/controls/basicControl';
import { Board } from 'src/app/whiteboard/global-whiteboard/board/board';

type Part = [() => void, () => boolean, string];

@Component({
  selector: 'whiteboard-tools-control',
  templateUrl: './tools-control.component.html',
  styleUrls: ['./tools-control.component.scss']
})
export class ToolsControlComponent extends BottomControl implements AfterViewInit {

  public isActive: () => boolean = () => {
    return this.board.linealOpen || this.board.geodreieckOpen || this.board.halbkreisOpen;
  };
  protected secondClick: () => void = () => {
    this.board.linealOpen = true;
  };
  protected firstClick?: () => void = () => {
    for (let part of this.parts) {
      if (part[1]()) {
        this.selected = part;
      }
    }
  };

  @Input() enabled: boolean = true;

  @Input() board!: Board;

  constructor() { 
    super();
  }

  ngAfterViewInit(): void {
    this.afterViewInit.emit();
  }

  onChange() {
    if (this.selected) {
      this.selected[0]();
    }
  }

  selected?: Part;

  parts: Part[] = [

    [() => {
      this.board.linealOpen = false;
      this.board.geodreieckOpen = false;
      this.board.halbkreisOpen = false;
    }, () => {
      return !this.board.linealOpen && !this.board.geodreieckOpen && !this.board.halbkreisOpen;
    }, 'Keine'],

    [() => {
      this.board.linealOpen = true;
      this.board.geodreieckOpen = false;
      this.board.halbkreisOpen = false;
    }, () => {
      return this.board.linealOpen;
    }, 'Lineal'],

    [() => {
      this.board.geodreieckOpen = true;
      this.board.linealOpen = false;
      this.board.halbkreisOpen = false;
    }, () => {
      return this.board.geodreieckOpen;
    }, 'Geodreieck'],

    [() => {
      this.board.halbkreisOpen = true;
      this.board.linealOpen = false;
      this.board.geodreieckOpen = false;
    }, () => {
      return this.board.halbkreisOpen;
    }, 'Halbkreis']

  ];

}
