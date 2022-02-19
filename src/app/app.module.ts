import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatSliderModule } from '@angular/material/slider';

import { FaecherDialogComponent, FaecherComponent } from './faecher/faecher.component';
import { FachComponent } from './faecher/fach/fach.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { TaskDialogComponent, TasksComponent } from './faecher/tasks/tasks.component';
import { FilesComponent } from './faecher/files/files.component';
import { EinheitenDialogComponent, EinheitenComponent } from './faecher/einheiten/einheiten.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { NgxElectronModule } from 'ngx-electron';
import { WhiteboardComponent } from './whiteboard/whiteboard.component';
import { DrawingComponent } from './whiteboard/drawing/drawing.component';
import { CanvasComponent } from './whiteboard/drawing/canvas/canvas.component';
import { PenControlComponent } from './whiteboard/drawing/pen-control/pen-control.component';
import { StrokePickerComponent } from './whiteboard/drawing/stroke-picker/stroke-picker.component';
import { ColorsetComponent } from './whiteboard/drawing/colorset/colorset.component';
import { ColorComponent } from './whiteboard/drawing/colorset/color/color.component';
import { MoveControlComponent } from './whiteboard/drawing/move-control/move-control.component';
import { ShapeControlComponent } from './whiteboard/drawing/shape-control/shape-control.component';
import { FillPickerComponent } from './whiteboard/drawing/fill-picker/fill-picker.component';
import { ShapePickerComponent } from './whiteboard/drawing/shape-picker/shape-picker.component';
import { DeleteControlComponent } from './whiteboard/drawing/delete-control/delete-control.component';

@NgModule({
  declarations: [
    AppComponent,
    FaecherComponent,
    FaecherDialogComponent,
    FachComponent,
    PageNotFoundComponent,
    TasksComponent,
    FilesComponent,
    TaskDialogComponent,
    EinheitenComponent,
    EinheitenDialogComponent,
    SidenavComponent,
    WhiteboardComponent,
    DrawingComponent,
    CanvasComponent,
    PenControlComponent,
    StrokePickerComponent,
    ColorsetComponent,
    ColorComponent,
    MoveControlComponent,
    ShapeControlComponent,
    FillPickerComponent,
    ShapePickerComponent,
    DeleteControlComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatDialogModule,
    MatExpansionModule,
    MatListModule,
    MatSliderModule,
    NgxElectronModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
