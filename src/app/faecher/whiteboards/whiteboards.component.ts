import { AddWhiteboardDialogComponent, DialogData } from './add-whiteboard-dialog/add-whiteboard-dialog.component';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

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

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  public newWhiteboard(): void {
    const dialogRef = this.dialog.open(AddWhiteboardDialogComponent, {
      width: '500px',
      data: { 
        name: ''
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined && result != "") {
        let res = result as DialogData;
        this.whiteboards?.push(res.name);
      }
    });
  }

  public removeWhiteboard(whiteboard: string): boolean {
    const index = this.whiteboards?.indexOf(whiteboard);
    if (index != undefined && index != -1) {
      this.whiteboards?.splice(index, 1);
      return true;
    }
    return false;
  }

}
