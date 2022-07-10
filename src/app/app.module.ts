import { FaecherManagerService } from './faecher/global/services/faecher-manager.service';
import { FaecherModule } from './faecher/faecher.module';
import { WhiteboardModule } from './whiteboard/whiteboard.module';
import { EditorModule } from './editor/editor.module';
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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { DragDropModule } from '@angular/cdk/drag-drop';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { NgxElectronModule } from 'ngx-electron';
import { SettingsComponent } from './settings/settings.component';
import { SearchComponent } from './search/search.component';
import { AddCategoryDialogComponent } from './settings/add-category-dialog/add-category-dialog.component';
import { LoadingScreenComponent } from './loading-screen/loading-screen.component';
import { ConfigComponent } from './settings/config/config.component';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    SidenavComponent,
    SettingsComponent,
    SearchComponent,
    AddCategoryDialogComponent,
    LoadingScreenComponent,
    ConfigComponent
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
    MatCheckboxModule,
    MatDialogModule,
    MatExpansionModule,
    MatListModule,
    MatSliderModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    DragDropModule,
    NgxElectronModule,
    WhiteboardModule,
    FaecherModule,
    EditorModule
  ],
  providers: [FaecherManagerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
