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

import { FaecherDialogComponent, FaecherComponent } from './faecher/faecher.component';
import { FachComponent } from './faecher/fach/fach.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { TaskDialogComponent, TasksComponent } from './faecher/tasks/tasks.component';
import { FilesComponent } from './faecher/files/files.component';
import { EinheitenDialogComponent, EinheitenComponent } from './faecher/einheiten/einheiten.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { NgxElectronModule } from 'ngx-electron';

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
    SidenavComponent
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
    NgxElectronModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
