import { SearchComponent } from './search/search.component';
import { SettingsComponent } from './settings/settings.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { WhiteboardComponent } from './whiteboard/whiteboard.component';
import { CameraComponent } from './whiteboard/drawing/controls/file-control/camera/camera.component';
import { EditorComponent } from './editor/editor/editor.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'faecher'
  },
  {
    path: 'faecher',
    loadChildren: () => import('./faecher/faecher.module').then(m => m.FaecherModule)
  },
  {
    path: 'whiteboard',
    component: WhiteboardComponent
  },
  {
    path: 'settings',
    component: SettingsComponent
  },
  {
    path: 'search',
    component: SearchComponent
  },
  /*{
    path: 'editor',
    component: EditorComponent
  },*/
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
