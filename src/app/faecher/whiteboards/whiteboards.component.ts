import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'faecher-whiteboards',
  templateUrl: './whiteboards.component.html',
  styleUrls: ['./whiteboards.component.scss']
})
export class WhiteboardsComponent implements OnInit {
  
  @Input()
  whiteboards: string[] | undefined = [];

  @Input()
  isAbleToAddWhiteboards: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

  public newWhiteboard(): void {
    
  }

}
