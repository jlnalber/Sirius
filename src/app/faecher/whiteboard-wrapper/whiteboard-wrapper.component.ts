import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-whiteboard-wrapper',
  templateUrl: './whiteboard-wrapper.component.html',
  styleUrls: ['./whiteboard-wrapper.component.scss']
})
export class WhiteboardWrapperComponent implements OnInit {

  @Input()
  whiteboard: string | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
