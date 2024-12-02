import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailleBiblioPage } from './detaille-biblio.page';

const routes: Routes = [
  {
    path: '',
    component: DetailleBiblioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailleBiblioPageRoutingModule {}
