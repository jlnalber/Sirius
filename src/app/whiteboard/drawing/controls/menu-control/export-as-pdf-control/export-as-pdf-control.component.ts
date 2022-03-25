import { jsPDF } from 'jspdf';
import { Component, Input, AfterViewInit } from '@angular/core';
import { Board } from 'src/app/whiteboard/global-whiteboard/board/board';
import { BasicControl } from 'src/app/whiteboard/global-whiteboard/controls/basicControl';
import { Canvg, presets, RenderingContext2D } from 'canvg';

@Component({
  selector: 'whiteboard-export-as-pdf-control',
  templateUrl: './export-as-pdf-control.component.html',
  styleUrls: ['./export-as-pdf-control.component.scss']
})
export class ExportAsPdfControlComponent extends BasicControl implements AfterViewInit {

  @Input() board!: Board;
  @Input() enabled = true;

  public onClick = async () => {
    this.board.downloadPDF();
  }

  constructor() {
    super();
  }

  ngAfterViewInit(): void {
    this.afterViewInit.emit();
  }

}
