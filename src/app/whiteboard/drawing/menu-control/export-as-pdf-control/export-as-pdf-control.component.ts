import { Board } from 'src/app/global/board/board';
import { BasicControl } from 'src/app/global/controls/basicControl';
import { Component, Input, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-export-as-pdf-control',
  templateUrl: './export-as-pdf-control.component.html',
  styleUrls: ['./export-as-pdf-control.component.scss']
})
export class ExportAsPdfControlComponent extends BasicControl implements AfterViewInit {

  @Input() board!: Board;
  @Input() enabled = true;

  public onClick = () => {
    this.board.downloadPDF();
  }

  constructor() {
    super();
  }

  ngAfterViewInit(): void {
    this.afterViewInit.emit();
  }

}
