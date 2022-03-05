import { BoardService } from './services/board.service';
import { ShapePickerComponent } from './drawing/shape-picker/shape-picker.component';
import { StrokePickerComponent } from './drawing/stroke-picker/stroke-picker.component';
import { FillPickerComponent } from './drawing/fill-picker/fill-picker.component';
import { ColorsetComponent } from './drawing/colorset/colorset.component';
import { ColorPickerDialogComponent } from './drawing/colorset/color-picker-dialog/color-picker-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { ColorPickerComponent } from './drawing/colorset/color-picker/color-picker.component';
import { ColorComponent } from './drawing/colorset/color/color.component';
import { SelectorComponent } from './drawing/selector/selector.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CanvasComponent } from 'src/app/whiteboard/drawing/canvas/canvas.component';
import { DrawingComponent } from './drawing/drawing.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhiteboardComponent } from './whiteboard.component';
import { BackControlComponent } from './drawing/controls/back-control/back-control.component';
import { ClearControlComponent } from './drawing/controls/clear-control/clear-control.component';
import { DeleteControlComponent } from './drawing/controls/delete-control/delete-control.component';
import { FileControlComponent } from './drawing/controls/file-control/file-control.component';
import { ForwardControlComponent } from './drawing/controls/forward-control/forward-control.component';
import { LastPageControlComponent } from './drawing/controls/last-page-control/last-page-control.component';
import { NextPageControlComponent } from './drawing/controls/next-page-control/next-page-control.component';
import { NewPageControlComponent } from './drawing/controls/new-page-control/new-page-control.component';
import { MenuControlComponent } from './drawing/controls/menu-control/menu-control.component';
import { BackgroundControlComponent } from './drawing/controls/menu-control/background-control/background-control.component';
import { ExportAsPdfControlComponent } from './drawing/controls/menu-control/export-as-pdf-control/export-as-pdf-control.component';
import { SaveControlComponent } from './drawing/controls/menu-control/save-control/save-control.component';
import { MoveControlComponent } from './drawing/controls/move-control/move-control.component';
import { PenControlComponent } from './drawing/controls/pen-control/pen-control.component';
import { SelectControlComponent } from './drawing/controls/select-control/select-control.component';
import { BackgroundDialogComponent } from './drawing/controls/menu-control/background-control/background-dialog/background-dialog.component';
import { ShapeControlComponent } from './drawing/controls/shape-control/shape-control.component';
import { MatInputModule } from '@angular/material/input';
import { SaveAsPictureControlComponent } from './drawing/controls/menu-control/save-as-picture-control/save-as-picture-control.component';



@NgModule({
  declarations: [
    WhiteboardComponent,
    DrawingComponent,
    CanvasComponent,
    BackControlComponent,
    ClearControlComponent,
    DeleteControlComponent,
    FileControlComponent,
    ForwardControlComponent,
    LastPageControlComponent,
    NextPageControlComponent,
    NewPageControlComponent,
    MenuControlComponent,
    BackgroundControlComponent,
    ExportAsPdfControlComponent,
    SaveControlComponent,
    MoveControlComponent,
    PenControlComponent,
    SelectControlComponent,
    BackgroundDialogComponent,
    ShapeControlComponent,
    SelectorComponent,
    ColorComponent,
    ColorPickerComponent,
    ColorPickerDialogComponent,
    ColorsetComponent,
    FillPickerComponent,
    StrokePickerComponent,
    ShapePickerComponent,
    SaveAsPictureControlComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatSliderModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  exports: [
    WhiteboardComponent
  ],
  providers: [
    BoardService
  ]
})
export class WhiteboardModule { }
