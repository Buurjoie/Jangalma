import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DonPage } from './don.page';

const routes: Routes = [
  {
    path: '',
    component: DonPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DonPageRoutingModule {}
