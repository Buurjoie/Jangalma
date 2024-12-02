import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GreenStrongDirective } from './directives/green-strong.directive';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { Network } from '@ionic-native/network/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from '../environments/environment';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { SignInWithApple, AppleSignInResponse } from '@ionic-native/sign-in-with-apple/ngx';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { AdMobFree } from '@ionic-native/admob-free/ngx';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import 'deep-chat';

@NgModule({
  declarations: [
    AppComponent,
    GreenStrongDirective,
    EditProfileComponent,
    ChangePasswordComponent,
  ],
  // entryComponents: [], // Retiré car non nécessaire avec Ivy
  imports: [
    PdfViewerModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxExtendedPdfViewerModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Network,
    Camera,
    InAppBrowser,
    GooglePlus,
    SignInWithApple,
    AdMobFree,
    TextToSpeech
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Assurez-vous que les composants personnalisés fonctionnent correctement
})
export class AppModule {}
