import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { WhiteboardComponent } from './whiteboard/whiteboard.component';

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
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
