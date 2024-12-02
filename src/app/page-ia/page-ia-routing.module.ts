import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageIAPage } from './page-ia.page';

const routes: Routes = [
  {
    path: '',
    component: PageIAPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageIAPageRoutingModule {}
