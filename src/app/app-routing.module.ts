import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ClassesPage } from './classes/classes.page';
import { LessonsPage } from './lessons/lessons.page';
import { SubjectsPage } from './subjects/subjects.page';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: ClassesPage,
    canActivate: [AuthGuard],
  },
  {
    path: 'lessons/:courseId',
    component: LessonsPage,
  },
  {
    path: 'lessons/:subject',
    component: LessonsPage,
  },
  {
    path: 'lessons',
    loadChildren: () => import('./lessons/lessons.module').then( m => m.LessonsPageModule)
  },
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'tabs/tab1',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  }, 
  
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: 'classes',
    loadChildren: () => import('./classes/classes.module').then( m => m.ClassesPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'subjects/:classe',
    loadChildren: () => import('./subjects/subjects.module').then(m => m.SubjectsPageModule)
  },
  {
    path: 'lessons/:subject',
    loadChildren: () => import('./lessons/lessons.module').then( m => m.LessonsPageModule)
  },
  {
    path: 'lesson-details',
    loadChildren: () => import('./lesson-details/lesson-details.module').then( m => m.LessonDetailsPageModule)
  },
  {
    path: 'lesson-details/:Idmatier/:lessonId',
    loadChildren: () => import('./lesson-details/lesson-details.module').then(m => m.LessonDetailsPageModule)
  },
  {
    path: 'bibliotheque',
    loadChildren: () => import('./bibliotheque/bibliotheque.module').then( m => m.BibliothequePageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'liste-bilio',
    loadChildren: () => import('./liste-bilio/liste-bilio.module').then( m => m.ListeBilioPageModule)
  },
  {
    path: 'liste-bilio/:courseId',
    loadChildren: () => import('./liste-bilio/liste-bilio.module').then(m => m.ListeBilioPageModule)
  },
  {
    path: 'detaille-biblio',
    loadChildren: () => import('./detaille-biblio/detaille-biblio.module').then( m => m.DetailleBiblioPageModule)
  },
  {
    path: 'detaille-biblio/:lessonId',
    loadChildren: () => import('./detaille-biblio/detaille-biblio.module').then(m => m.DetailleBiblioPageModule)
  },
  {
    path: 'don',
    loadChildren: () => import('./don/don.module').then( m => m.DonPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'calculator',
    loadChildren: () => import('./calculator/calculator.module').then( m => m.CalculatorPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'change-password',
    loadChildren: () => import('./change-password/change-password.module').then( m => m.ChangePasswordPageModule)
  },
  {
    path: 'edit-profile',
    loadChildren: () => import('./edit-profile/edit-profile.module').then( m => m.EditProfilePageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'page-ia',
    loadChildren: () => import('./page-ia/page-ia.module').then( m => m.PageIAPageModule)
  },
  {
    path: 'abonnement',
    loadChildren: () => import('./abonnement/abonnement.module').then( m => m.AbonnementPageModule)
  },
  {
    path: 'paiement/:prix',
    loadChildren: () => import('./paiement/paiement.module').then( m => m.PaiementPageModule)
  },

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}