import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BibliothequePageRoutingModule } from './bibliotheque-routing.module';

import { BibliothequePage } from './bibliotheque.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BibliothequePageRoutingModule
  ],
  declarations: [BibliothequePage]
})
export class BibliothequePageModule {}
