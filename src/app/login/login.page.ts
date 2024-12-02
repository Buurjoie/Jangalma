import { Component } from '@angular/core';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { SignInWithApple, AppleSignInResponse } from '@ionic-native/sign-in-with-apple/ngx';
import { AppComponent } from '../app.component';
import { environment } from '../../environments/environment';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
   email: string = ''; 
  password: any;
  message: string;
  resetEmail: string = '';
  loginSuccess = false;
  loginFailed = false;
  showResetPassword = false; 
  form: FormGroup;
  isTypePassword: boolean = true;

  
  ionViewDidEnter() {
    this.appComponent.toggleTabsVisibility(false);
  }

  ionViewWillLeave() {
    this.appComponent.toggleTabsVisibility(true);
  }

  constructor(private appComponent: AppComponent, private afAuth: AngularFireAuth, private googlePlus: GooglePlus, private signInWithAppleService: SignInWithApple, private navCtrl: NavController, private alertController: AlertController, private loadingController: LoadingController, private firestore: AngularFirestore) 
  {
    this.initForm();
  }

  initForm() {
    this.form = new FormGroup({
      email: new FormControl('',
        { validators: [Validators.required, Validators.email] }
      ),
      password: new FormControl('',
        { validators: [Validators.required] }
      ),
    });
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Connexion en cours...',
      spinner: 'crescent',
      duration: 0
    });
    await loading.present();
  }

  onChange() {
    this.isTypePassword = !this.isTypePassword;
  }
  

  async onSubmit() {
    await this.presentLoading();
  
    this.afAuth.signInWithEmailAndPassword(this.email!, this.password!)
      .then(async () => {
        await this.loadingController.dismiss();
        this.loginSuccess = true;
        this.message = "Connexion réussie. Redirection en cours...";
        setTimeout(() => {
          this.navCtrl.navigateRoot('/classes');
        }, 1500);
      })
      .catch(async () => {
        await this.loadingController.dismiss();
        this.message = "Erreur lors de la connexion. Veuillez réessayer.";
        this.loginFailed = true;
      });
  }
  
  async signInWithGoogle() {
    await this.presentLoading();
  
    this.googlePlus.login({
      webClientId: environment.googleWebClientId,
      offline: true
    })
    .then(async res => {
      const googleCredential = firebase.auth.GoogleAuthProvider.credential(res.idToken);
      this.afAuth.signInWithCredential(googleCredential)
        .then(async (userCredential) => {
          const user = userCredential.user;
          const userRef = this.firestore.collection('users').doc(user?.uid);
  
          userRef.get().toPromise().then(async (doc) => {
            if (doc && doc.exists) { // Ajout de la vérification pour doc
              await this.loadingController.dismiss();
              this.loginSuccess = true;
  
              setTimeout(() => {
                this.navCtrl.navigateRoot('/classes');
              }, 1500);
            } else {
              await this.loadingController.dismiss();
              this.showAlert('Erreur', "Votre compte n'est pas encore enregistré. Veuillez vous inscrire d'abord.");
              this.afAuth.signOut();
            }
          });
        })
        .catch(async () => {
          await this.loadingController.dismiss();
          this.loginFailed = true;
        });
    })
    .catch(async () => {
      await this.loadingController.dismiss();
      this.loginFailed = true;
    });
  }

  async signInWithApple() {
    await this.presentLoading();
  
    this.signInWithAppleService.signin({})
      .then(async (res: any) => {
        const appleCredential = (new firebase.auth.OAuthProvider("apple.com")).credential(res.identityToken);
        this.afAuth.signInWithCredential(appleCredential)
          .then(async (userCredential) => {
            const user = userCredential.user;
            const userRef = this.firestore.collection('users').doc(user?.uid);
  
            userRef.get().toPromise().then(async (doc) => {
              if (doc && doc.exists) { // Ajout de la vérification pour doc
                await this.loadingController.dismiss();
                this.loginFailed = false;
                this.loginSuccess = true;
                setTimeout(() => {
                  this.navCtrl.navigateRoot('/classes');
                }, 1500);
              } else {
                await this.loadingController.dismiss();
                this.showAlert('Erreur', "Votre compte n'est pas encore enregistré. Veuillez vous inscrire d'abord.");
                this.afAuth.signOut();
              }
            });
          })
          .catch(async () => {
            await this.loadingController.dismiss();
            this.loginFailed = true;
          });
      })
      .catch(async () => {
        await this.loadingController.dismiss();
        this.loginFailed = true;
      });
  }   
  

  goToSignup() {
    this.navCtrl.navigateForward('/signup');
  }
  toggleResetPassword() {
    this.showResetPassword = !this.showResetPassword
  }
  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
    header,
    message,
    buttons: ['OK']
    });
    await alert.present();
  }

  resetPassword(email: string) {
    console.log('====================================');
    console.log(this.resetEmail);
    console.log('====================================');
  if (!email) {
  this.showAlert('Erreur', 'Veuillez saisir une adresse e-mail.');
  return;
  }
  this.afAuth.sendPasswordResetEmail(email)
  .then(() => {
    this.showAlert('Succès', 'Un e-mail de réinitialisation du mot de passe a été envoyé à votre adresse e-mail.');
  })
  .catch((error) => {
    this.showAlert('Erreur', error.message);
  });
}

}