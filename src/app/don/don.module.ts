import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DonPageRoutingModule } from './don-routing.module';

import { DonPage } from './don.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DonPageRoutingModule
  ],
  declarations: [DonPage]
})
export class DonPageModule {}
