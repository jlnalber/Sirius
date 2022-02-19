import { BoardService } from './../../../../features/board.service';
import { Component, OnInit, Input } from '@angular/core';
import { Stroke } from 'src/app/global/stroke';
import { Color } from 'src/app/global/color';

@Component({
  selector: 'app-color',
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.scss']
})
export class ColorComponent implements OnInit {

  @Input() color!: Color;
  @Input() listener!: ((c: Color) => void);
  @Input() currentColor!: () => Color;

  constructor() { }

  ngOnInit(): void {
  }

}
