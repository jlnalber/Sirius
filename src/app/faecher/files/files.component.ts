import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'faecher-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit {
  @Input()
  files: string[] = [];

  @Input()
  isAbleToAddFiles: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

  public openDialog(): void {
    
  }

}
