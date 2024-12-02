import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LessonDetailsPageRoutingModule } from './lesson-details-routing.module';
import { LessonDetailsPage } from './lesson-details.page';
import { ContentModalComponent } from '../content-modal/content-modal.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LessonDetailsPageRoutingModule,
    PdfViewerModule
  ],
  declarations: [
    LessonDetailsPage,
    ContentModalComponent
  ],
})
export class LessonDetailsPageModule {}
