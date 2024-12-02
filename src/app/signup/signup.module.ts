import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignupPageRoutingModule } from './signup-routing.module';

import { SignupPage } from './signup.page';
import { SignInWithApple, AppleSignInResponse } from '@ionic-native/sign-in-with-apple/ngx';
import { ConfiComponent } from '../confi/confi.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SignupPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [SignupPage,ConfiComponent],
  providers: [SignInWithApple] // Ajoutez cette ligne
})
export class SignupPageModule {}
