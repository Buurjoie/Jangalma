import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailleBiblioPageRoutingModule } from './detaille-biblio-routing.module';

import { DetailleBiblioPage } from './detaille-biblio.page';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailleBiblioPageRoutingModule,
    NgxExtendedPdfViewerModule, // Ajoutez cette ligne
  ],
  declarations: [DetailleBiblioPage]
})
export class DetailleBiblioPageModule {}
