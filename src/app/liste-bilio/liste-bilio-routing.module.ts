import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListeBilioPage } from './liste-bilio.page';

const routes: Routes = [
  {
    path: '',
    component: ListeBilioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListeBilioPageRoutingModule {}
