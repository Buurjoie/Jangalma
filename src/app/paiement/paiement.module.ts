import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaiementPageRoutingModule } from './paiement-routing.module';

import { PaiementPage } from './paiement.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaiementPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [PaiementPage]
})
export class PaiementPageModule {}
