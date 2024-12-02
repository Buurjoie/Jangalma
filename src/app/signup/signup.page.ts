import { Component, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { AlertController, IonModal, NavController } from '@ionic/angular';
import firebase from 'firebase/compat/app';
import { SignInWithApple } from '@ionic-native/sign-in-with-apple/ngx';
import { AppComponent } from '../app.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { LoadingController } from '@ionic/angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage {

  @ViewChild(IonModal) elmodal: IonModal;
  
  inscForm: FormGroup;
  name: string = '';
  surname: string = '';
  email: string = '';
  city: string = '';
  phoneCode: string = '';
  phone: string = '';
  class_: string = '';
  password: string = '';
  termsAccepted: boolean = false;
  signupSuccess = false;
  signupFailed = false;
  isTypePassword: boolean = true;

  partie1: boolean = true;
  partie2: boolean = false;
  message: string;
  codeElm:any="+221";
  imgElm:any="https://flagcdn.com/w320/sn.png";
  pays:any[];
  dataPays:any[];


  createUserDocument(uid: string, userData: any): Promise<void> {
    return this.firestore.collection('users').doc(uid).set(userData);
  }

  ionViewDidEnter() {
    this.appComponent.toggleTabsVisibility(false);
    this.getPays();
  }

  ionViewWillLeave() {
    this.appComponent.toggleTabsVisibility(true);
  }

  constructor(private alertController: AlertController, private appComponent: AppComponent, private afAuth: AngularFireAuth, private googlePlus: GooglePlus, private signInWithAppleService: SignInWithApple, private navCtrl: NavController, private firestore: AngularFirestore, private loadingController: LoadingController, 
    private httpClient: HttpClient,
  ) {
    this.initForm();
  }


  initForm() {
    this.inscForm = new FormGroup({
      name: new FormControl('',
        { validators: [Validators.required] }
      ),
      surname: new FormControl('',
        { validators: [Validators.required] }
      ),
      email: new FormControl('',
        { validators: [Validators.required, Validators.email] }
      ),
      city: new FormControl('',
        { validators: [Validators.required] }
      ),
      phoneCode: new FormControl('',
        { validators: [Validators.required] }
      )
      ,
      phone: new FormControl('',
        { validators: [Validators.required] }
      ),
      class_: new FormControl('',
        { validators: [Validators.required] }
      ),
      termsAccepted: new FormControl('',
        { validators: [Validators.required] }
      ),
      password: new FormControl('',
        { validators: [Validators.required, Validators.minLength(8)] }
      ),
    });
  }


  // pour la recherche
  searchbarInput(ev){
    this.filterList(ev.target.value);
  }

  checkboxChange(ev) {
    let value = ev;
    const elmData = this.dataPays.filter((elm) =>(
       elm.name.common == value
    ));
    if(elmData){
      this.codeElm = elmData[0].idd.root+''+elmData[0].idd.suffixes;
      this.imgElm = elmData[0].flags.png;
    }
    console.log(this.codeElm);
    
    this.elmodal.dismiss();
  }

  // rechercher un pays
  filterList(val) {
    // this.pays = this.pays.filter((item) => {
    //   return item.name.common.toLowerCase().indexOf(val.toLowerCase()) > -1;
    // });
    this.pays = this.searchInArray(val, this.dataPays);
  }

  // pour la recherche
  searchInArray(searchTerm: string, arrayToSearch: any[]): any[] {
    const keys:any[] = ['common'];
     if (!searchTerm || searchTerm.trim() === '') {
       // Si la recherche est vide, retourner le tableau complet
       return arrayToSearch;
     }
     searchTerm = searchTerm.toLowerCase();
     // Filtrer le tableau en fonction du terme de recherche
     return arrayToSearch.filter(item => {
       const itemValue = keys.find((key) =>  item.name[key]
         ?.toString().toLowerCase().includes(searchTerm)
       );
 
       return itemValue;
     });
   }

  changeParti1() {
    if (this.name && this.surname && this.email && this.phone && this.codeElm) {
      this.partie1 = false;
      this.partie2 = true;
      this.message?this.message = '':null
    } else {
      this.message = "saisir les informations demander"
    }
  }

  onChange() {
    this.isTypePassword = !this.isTypePassword;
  }

  // pour recuperer tous les pays avec leurs code phones
  async getPays() {
      // this.httpClient.get('https://restcountries.com/v3.1/all')
      this.httpClient.get('assets/pays.json')
      .pipe(
        tap(() => 
          // this.presentLoading()
        console.log('affiche')
        
      )
      )
      .subscribe(
        (data: any) => {
          const elmdata = data.sort((a, b) => a.name.common.localeCompare(b.name.common));
          this.pays = elmdata;
          this.dataPays = elmdata;
          console.log(this.pays);
          
        }
      )
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Inscription en cours...',
      spinner: 'crescent',
      duration: 0
    });
    await loading.present();
  }


  async emailExists(email: string): Promise<boolean> {
    try {
      const methods = await this.afAuth.fetchSignInMethodsForEmail(email);
      return methods.length > 0;
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  }  

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
    header,
    message,
    buttons: ['OK']
    });
    await alert.present();
  }

  async onSubmit() {
    if (this.termsAccepted) {
      await this.presentLoading();
  
      this.afAuth.fetchSignInMethodsForEmail(this.email)
        .then(async (methods) => {
          if (methods.length === 0) {
            // L'email n'est pas utilisé, on peut créer un compte
            this.afAuth.createUserWithEmailAndPassword(this.email, this.password)
              .then(async (userCredential) => {
                await this.loadingController.dismiss();
  
                if (userCredential.user) {
                  const uid = userCredential.user.uid;
                  const userData = {
                    name: this.name,
                    surname: this.surname,
                    email: this.email,
                    city: this.city,
                    phone: this.codeElm + this.phone,
                    class_: this.class_
                  };
  
                  this.createUserDocument(uid, userData)
                    .then(() => {
                      this.signupSuccess = true;
                      this.message = "Inscription réussie, patientez...";
                      setTimeout(() => {
                        this.navCtrl.navigateRoot('/login');
                      }, 3000);
                    })
                    .catch(() => this.signupFailed = true);
                } else {
                  this.signupSuccess = false;
                  this.message = "Erreur lors de l'inscription. Veuillez réessayer.";
                }
              })
              .catch(async () => {
                await this.loadingController.dismiss();
                this.signupFailed = true;
              });
          } else {
            // L'email est déjà utilisé, afficher un message d'erreur
            await this.loadingController.dismiss();
            this.signupFailed = true;
            this.showAlert("Erreur","Cette adresse e-mail est déjà utilisée. Veuillez en utiliser une autre.");
          }
        })
        .catch(async (error) => {
          await this.loadingController.dismiss();
          this.signupFailed = true;
        });
    } else {
      this.signupFailed = true;
    }
  }  

  async signInWithGoogle() {
    await this.presentLoading();
  
    this.googlePlus.login({})
      .then(async res => {
        const googleCredential = firebase.auth.GoogleAuthProvider.credential(res.idToken);
        this.afAuth.signInWithCredential(googleCredential)
          .then(async (userCredential) => {
            if (userCredential.user) {
              const uid = userCredential.user.uid;
              const userData = {
                name: res.displayName,
                surname: '',
                email: res.email,
                city: '',
                phone: '',
                class_: ''
              };
  
              if (await this.emailExists(res.email)) {
                await this.loadingController.dismiss();
                this.signupFailed = true;
                alert("Cette adresse e-mail est déjà utilisée. Veuillez en utiliser une autre.");
              } else {
                this.createUserDocument(uid, userData)
                .then(async () => {
                  await this.loadingController.dismiss();
                  this.signupSuccess = true;
                  this.navCtrl.navigateRoot('/login');
                })
                .catch(async () => {
                  await this.loadingController.dismiss();
                  this.signupFailed = true;
                });              
              }
            } else {
              await this.loadingController.dismiss();
              this.signupFailed = true;
            }
          })
          .catch(async () => {
            await this.loadingController.dismiss();
            this.signupFailed = true;
          });
      })
      .catch(async () => {
        await this.loadingController.dismiss();
        this.signupFailed = true;
      });
  }  
  
  
  async signInWithApple() {
    await this.presentLoading();
  
    this.signInWithAppleService.signin({})
      .then(async (res: any) => {
        const appleCredential = (new firebase.auth.OAuthProvider("apple.com")).credential(res.identityToken);
        this.afAuth.signInWithCredential(appleCredential)
          .then(async (userCredential) => {
            if (userCredential.user) {
              const uid = userCredential.user.uid;
              const userData = {
                name: res.fullName.givenName,
                surname: res.fullName.familyName,
                email: res.email,
                city: '',
                phone: '',
                class_: ''
              };
  
              if (await this.emailExists(res.email)) {
                await this.loadingController.dismiss();
                this.signupFailed = true;
                alert("Cette adresse e-mail est déjà utilisée. Veuillez en utiliser une autre.");
              } else {
                this.createUserDocument(uid, userData)
                .then(async () => {
                  await this.loadingController.dismiss();
                  this.signupSuccess = true;
                  this.navCtrl.navigateRoot('/login');
                })
                .catch(async () => {
                  await this.loadingController.dismiss();
                  this.signupFailed = true;
                });              
              }
            } else {
              await this.loadingController.dismiss();
              this.signupFailed = true;
            }
          })
          .catch(async () => {
            await this.loadingController.dismiss();
            this.signupFailed = true;
          });
      })
      .catch(async () => {
        await this.loadingController.dismiss();
        this.signupFailed = true;
      });
  }     
  

goToLogin() {
this.navCtrl.navigateForward('/login');
}

resetPassword(email: string) {
// Ajouter le code pour réinitialiser le mot de passe
}
}