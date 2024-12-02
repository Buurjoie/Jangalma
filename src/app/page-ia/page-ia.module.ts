import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PageIAPageRoutingModule } from './page-ia-routing.module';

import { PageIAPage } from './page-ia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PageIAPageRoutingModule
  ],
  declarations: [PageIAPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PageIAPageModule {}
