import { MatIconModule } from '@angular/material/icon';
import { EinheitenComponent, EinheitenDialogComponent } from './einheiten/einheiten.component';
import { FachComponent } from './fach/fach.component';
import { FilesComponent } from './files/files.component';
import { TasksComponent, TaskDialogComponent } from './tasks/tasks.component';
import { FaecherComponent, FaecherDialogComponent } from './faecher.component';
import { NgxElectronModule } from 'ngx-electron';
import { MatSliderModule } from '@angular/material/slider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { WhiteboardModule } from './../whiteboard/whiteboard.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaecherManagerService } from '../shared/faecher-manager.service';
import { AppRoutingModule } from '../app-routing.module';



@NgModule({
  declarations: [
    FaecherComponent,
    FaecherDialogComponent,
    TasksComponent,
    TaskDialogComponent,
    FilesComponent,
    FachComponent,
    EinheitenComponent,
    EinheitenDialogComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    WhiteboardModule,
    FormsModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatDialogModule,
    MatExpansionModule,
    MatSliderModule,
    MatIconModule,
    NgxElectronModule,
    AppRoutingModule
  ],
  providers: [
    FaecherManagerService
  ],
  exports: [
    FaecherComponent
  ]
})
export class FaecherModule { }
