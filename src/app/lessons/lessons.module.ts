import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { LessonsPage } from './lessons.page';
import { LessonService } from '../services/lesson.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: LessonsPage
      }
    ])
  ],
  declarations: [LessonsPage],
  providers: [LessonService]
})
export class LessonsPageModule {}
