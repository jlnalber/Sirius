import { Category, Whiteboard } from './../faecher/global/interfaces/fach';
import { AddCategoryDialogComponent, DialogData } from './add-category-dialog/add-category-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FaecherManagerService } from 'src/app/faecher/global/services/faecher-manager.service';
import { Component, OnInit } from '@angular/core';
import { getNewId } from '../faecher/global/utils';
import { Color as WhiteboardColor } from '../whiteboard/global-whiteboard/essentials/color';
import { Color } from '../whiteboard/global-whiteboard/interfaces/whiteboard';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(public readonly faecherManager: FaecherManagerService, public readonly dialog: MatDialog) { }

  ngOnInit(): void {
  }

  addCategory(): void {
    const dialogRef = this.dialog.open(AddCategoryDialogComponent, {
      width: '500px',
      data: { 
        name: ''
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined && result != "") {
        let res = result as DialogData;
        this.faecherManager.faecherData.categories.push({
          name: res.name,
          id: getNewId(this.faecherManager.faecherData.categories.map(c => c.id)),
          color: { r: 255, g: 0, b: 0 }
        })
      }
    });
  }

  removeCategory(category: Category): boolean {
    const index = this.faecherManager.faecherData.categories.indexOf(category);
    if (index >= 0) {
      this.faecherManager.faecherData.categories.splice(index, 1);
      return true;
    }
    return false;
  }

  defaultColors: WhiteboardColor[] = [
    new WhiteboardColor(126, 237, 148),
    new WhiteboardColor(26, 44, 121),
    new WhiteboardColor(230, 162, 110),
    new WhiteboardColor(110, 166, 234),
    new WhiteboardColor(161, 99, 162),
    new WhiteboardColor(241, 196, 15),
    new WhiteboardColor(231, 76, 60)
  ]

  currentColor = (category: Category): () => WhiteboardColor | Color => {
    return () => {
      return category.color;
    }
  }

  colorListener = (category: Category): (color: WhiteboardColor | Color) => void => {
    return (color: WhiteboardColor | Color) => {
      if (color instanceof WhiteboardColor) {
        color = color.export();
      }
      category.color = color;
    }
  }

}
