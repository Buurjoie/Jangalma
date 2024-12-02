import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListeBilioPageRoutingModule } from './liste-bilio-routing.module';

import { ListeBilioPage } from './liste-bilio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListeBilioPageRoutingModule
  ],
  declarations: [ListeBilioPage]
})
export class ListeBilioPageModule {}
