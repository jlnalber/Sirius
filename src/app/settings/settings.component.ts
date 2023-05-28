import { Category } from './../faecher/global/interfaces/fach';
import { AddCategoryDialogComponent, DialogData } from './add-category-dialog/add-category-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MappenManagerService } from '../faecher/global/services/mappen-manager.service';
import { Component, OnInit } from '@angular/core';
import { getNewId } from '../faecher/global/utils';
import { Color as WhiteboardColor } from '../whiteboard/global-whiteboard/essentials/color';
import { Color } from '../whiteboard/global-whiteboard/interfaces/whiteboard';
import { AcceptDialogComponent } from '../faecher/accept-dialog/accept-dialog.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(public readonly faecherManager: MappenManagerService, public readonly dialog: MatDialog) { }

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
        this.faecherManager.mappenData.categories.push({
          name: res.name,
          id: getNewId(this.faecherManager.mappenData.categories.map(c => c.id)),
          color: this.defaultColors[0].export()
        })
      }
    });
  }

  removeCategory(category: Category): void {
    // open the dialog to delete
    const dialogRef = this.dialog.open(AcceptDialogComponent, {
      data: {
        header: `Kategorie '${category.name}' wirklich löschen?`,
        description: `Alle Elemente in dieser Kategorie verlieren ihr Label.`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined && result != "") {
        const index = this.faecherManager.mappenData.categories.indexOf(category);
        if (index >= 0) {
          this.faecherManager.mappenData.categories.splice(index, 1);
        }
      }
    })
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
