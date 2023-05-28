import { EditorModule } from './../editor/editor.module';
import { MatIconModule } from '@angular/material/icon';
import { UntergruppenComponent, UntergruppenDialogComponent } from './untergruppen/untergruppen.component';
import { GruppeComponent } from './gruppe/gruppe.component';
import { FilesComponent } from './files/files.component';
import { TasksComponent, TaskDialogComponent } from './tasks/tasks.component';
import { MappenComponent, MappenDialogComponent } from './mappen.component';
import { NgxElectronModule } from 'ngx-electron';
import { MatSliderModule } from '@angular/material/slider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { WhiteboardModule } from '../whiteboard/whiteboard.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AcceptDialogComponent } from './accept-dialog/accept-dialog.component';
import { Route, RouterModule } from '@angular/router';
import { WhiteboardsComponent } from './whiteboards/whiteboards.component';
import { WhiteboardWrapperComponent } from './whiteboard-wrapper/whiteboard-wrapper.component';
import { AddWhiteboardDialogComponent } from './whiteboards/add-whiteboard-dialog/add-whiteboard-dialog.component';
import { CategorySelectorComponent } from './category-selector/category-selector.component';
import { EditorsComponent } from './editors/editors.component';
import { EditorWrapperComponent } from './editor-wrapper/editor-wrapper.component';
import { AddEditorDialogComponent } from './editors/add-editor-dialog/add-editor-dialog.component';
import { MappeComponent } from './mappe/mappe.component';

const routes: Route[] = [
  {
    path: '',
    component: MappenComponent
  },
  {
    path: ':mappeid',
    component: MappeComponent
  },
  {
    path: 'gruppen',
    pathMatch: 'full',
    redirectTo: '/mappen'
  },
  {
    path: 'gruppen/:gruppeid',
    component: GruppeComponent
  },
  {
    path: 'whiteboards/:whiteboardid',
    component: WhiteboardWrapperComponent
  },
  /*{
    path: 'editors/:editorid',
    component: EditorWrapperComponent
  },*/
  {
    path: 'whiteboards',
    pathMatch: 'full',
    redirectTo: '/mappen'
  },/*
  {
    path: 'editors',
    pathMatch: 'full',
    redirectTo: '/mappen'
  },*/
]


@NgModule({
  declarations: [
    MappenComponent,
    MappenDialogComponent,
    TasksComponent,
    TaskDialogComponent,
    FilesComponent,
    GruppeComponent,
    UntergruppenComponent,
    UntergruppenDialogComponent,
    AcceptDialogComponent,
    WhiteboardsComponent,
    WhiteboardWrapperComponent,
    AddWhiteboardDialogComponent,
    CategorySelectorComponent,
    EditorsComponent,
    EditorWrapperComponent,
    AddEditorDialogComponent,
    MappeComponent
  ],
  imports: [
    CommonModule,
    WhiteboardModule,
    EditorModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatDialogModule,
    MatExpansionModule,
    MatSliderModule,
    MatIconModule,
    MatSelectModule,
    NgxElectronModule,
    RouterModule.forChild(routes)
  ],
  providers: [],
  exports: [
    MappenComponent,
    RouterModule
  ]
})
export class FaecherModule { }
