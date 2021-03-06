import { EditorModule } from './../editor/editor.module';
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
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { WhiteboardModule } from '../whiteboard/whiteboard.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AcceptDialogComponent } from './accept-dialog/accept-dialog.component';
import { EinheitComponent } from './einheit/einheit.component';
import { Route, RouterModule } from '@angular/router';
import { WhiteboardsComponent } from './whiteboards/whiteboards.component';
import { WhiteboardWrapperComponent } from './whiteboard-wrapper/whiteboard-wrapper.component';
import { AddWhiteboardDialogComponent } from './whiteboards/add-whiteboard-dialog/add-whiteboard-dialog.component';
import { CategorySelectorComponent } from './category-selector/category-selector.component';
import { EditorsComponent } from './editors/editors.component';
import { EditorWrapperComponent } from './editor-wrapper/editor-wrapper.component';
import { AddEditorDialogComponent } from './editors/add-editor-dialog/add-editor-dialog.component';

const routes: Route[] = [
  {
    path: '',
    component: FaecherComponent
  },
  {
    path: ':fachid',
    component: FachComponent
  },
  {
    path: ':fachid/einheiten/:einheitid',
    component: EinheitComponent
  },
  {
    path: ':fachid/einheiten',
    pathMatch: 'full',
    redirectTo: ':fachid'
  },
  {
    path: ':fachid/whiteboards/:whiteboardid',
    component: WhiteboardWrapperComponent
  },
  {
    path: ':fachid/einheiten/:einheitid/whiteboards/:whiteboardid',
    component: WhiteboardWrapperComponent
  },
  {
    path: ':fachid/editors/:editorid',
    component: EditorWrapperComponent
  },
  {
    path: ':fachid/einheiten/:einheitid/editors/:editorid',
    component: EditorWrapperComponent
  },
  {
    path: ':fachid/whiteboards',
    pathMatch: 'full',
    redirectTo: ':fachid'
  },
  {
    path: ':fachid/einheiten/:einheitid/whiteboards',
    pathMatch: 'full',
    redirectTo: ':fachid/einheiten/:einheitid'
  },
  {
    path: ':fachid/editors',
    pathMatch: 'full',
    redirectTo: ':fachid'
  },
  {
    path: ':fachid/einheiten/:einheitid/editors',
    pathMatch: 'full',
    redirectTo: ':fachid/einheiten/:einheitid'
  }
]


@NgModule({
  declarations: [
    FaecherComponent,
    FaecherDialogComponent,
    TasksComponent,
    TaskDialogComponent,
    FilesComponent,
    FachComponent,
    EinheitenComponent,
    EinheitenDialogComponent,
    AcceptDialogComponent,
    EinheitComponent,
    WhiteboardsComponent,
    WhiteboardWrapperComponent,
    AddWhiteboardDialogComponent,
    CategorySelectorComponent,
    EditorsComponent,
    EditorWrapperComponent,
    AddEditorDialogComponent
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
    FaecherComponent,
    RouterModule
  ]
})
export class FaecherModule { }
