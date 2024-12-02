import { Component } from '@angular/core';
import { isPlatform, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth.service';
import { NavController } from '@ionic/angular';
import { Camera } from '@ionic-native/camera/ngx';
import { Router } from '@angular/router';
import { Md5 } from 'ts-md5';
import { Location, PlatformLocation } from '@angular/common';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
// import { AdmobAds, BannerAdOptions, BannerPosition, BannerSize } from "capacitor-admob-ads";
import { MenuController } from '@ionic/angular';
import 'deep-chat';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs';
declare const navigator: any;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  email: string = '';
  user: any;
  showAbone:boolean = false;
  dataAbon:any;
  constructor(
    private modalCtrl: ModalController,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public authService: AuthService,
    private navCtrl: NavController,
    private camera: Camera,
    private router: Router,
    private location: Location,
    private platformLocation: PlatformLocation,
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private menuCtrl: MenuController,
    private httpClient: HttpClient, 
  ) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.getAbonnementUser(user.uid);
        this.firestore.collection('users').doc(user.uid).valueChanges().subscribe((userData: any) => {
          this.user = userData;
        });
      } else {
        this.user = null;
      }
    });

    // this.afAuth.authState.subscribe((user) => {
    //   if (user) {
        // this.firestore.collection('users').valueChanges().subscribe((user:any) => {
        //     console.log('====================================');
        //     console.log(user);
        //     console.log('====================================');
        // });
    //   } else {
    //     this.user = null;
    //   }
    // });

    this.initializeApp();
  }

  

  getEmailHash(email: string): string {
    return Md5.hashStr(email.toLowerCase()).toString();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString('#ffffff');
      this.splashScreen.hide();

      this.platform.backButton.subscribeWithPriority(10, async () => {
        if (this.router.url === '/classes') {
          if (this.platform.is('cordova')) {
            this.platform.backButton.unsubscribe();
            navigator['app'].exitApp();
          } else {
            window.history.back();
          }
        } else {
          this.location.back();
        }
      });
    });
  }

  async getAbonnementUser(userId: string) {
    const basicAuth = btoa('jangalma:fooNekkJ@ng');
    const options = {
       headers: new HttpHeaders({
          'Content-Type': 'application/json', // Notez l'utilisation des minuscules ici
          'X-API-KEY': 'dialoukaye',
          Authorization: `Basic ${basicAuth}`,
      }),
    }
    this.httpClient
    .get(`https://pointel.jangalma.net/gestion/api/abonne/getAbonnementUser/${userId}`, options)
    .pipe(
      tap(() => 
        // this.presentLoading()
      console.log('affiche')
      
    )
    )
    .subscribe(
      (dataelm: any) => {
       const data = dataelm?.data;
 
       // Log the data for debugging
       console.log('====================================');
       console.log(data);
       console.log('====================================');
              if (data) {
                // Si statut est vide, cacher l'abonnement, sinon afficher les données
                const isAbonne = data.statut !== '';
                this.showAbone = isAbonne;
                this.dataAbon = isAbonne ? data : null;
              } else {
                // Si data est vide ou invalide, cacher l'abonnement
                this.showAbone = false;
                this.dataAbon = null;
              }
             // Verify payments if data exists
      }
    )
 }

  // test bannier
  // async banner() {
  //   const adIds = isPlatform('ios') ? 'ca-app-pub-8580211937730370/5109353619' : 'ca-app-pub-8580211937730370/1553257459';
  //   const options:BannerAdOptions = {
  //     adId:"ca-app-pub-8580211937730370/1553257459",
  //     adSize: BannerAdSize.BANNER,
  //     position: BannerAdPosition.TOP_CENTER,
  //     margin: 0,
  //     isTesting: true,
  //    };

  //    await AdMob.showBanner(options);
  // }

  //   private initializeAdmobBannerAds(): void {
  //     AdmobAds.showBannerAd({
  //       adId: "ca-app-pub-8580211937730370/1553257459",
  //       isTesting: false,
  //       // adId: "ca-app-pub-3940256099942544/6300978111", // ID de test fourni par Google
  //       // isTesting: true,  // Activer le mode test
  //       adSize: BannerSize.BANNER,
  //       adPosition: BannerPosition.BOTTOM
  //     }).then(() => {
  //       console.log('Banner Ad Shown');
  //     }).catch(err => {
  //       console.log(err.message);
  //     });

  //     AdmobAds.addListener("bannerAdOpened", () => {
  //       console.log('Banner Ad Opened');
  //     });

  //     AdmobAds.addListener("bannerAdClicked", () => {
  //       console.log('Banner Ad Clicked');
  //     });

  //     AdmobAds.addListener("bannerAdImpression", () => {
  //       console.log('Banner Ad Impression');
  //     });

  //     AdmobAds.addListener("bannerAdClosed", () => {
  //       console.log('Banner Ad Closed');
  //     });
  //   }

  //   private initialiZeAdmobReward():void {
  //     AdmobAds.loadRewardedInterstitialAd({ adId: "ca-app-pub-8580211937730370/3845041587",
  //        isTesting: false 
  //       }).then(() => {
  //    console.log('Rewarded Interstitial Ad Loaded');
  //     }).catch(err => {
  //       console.log(err.message);
  //     });

  //   // To show an already loaded rewarded interstitial ad
  //     AdmobAds.showRewardedInterstitialAd().then(() => {
  //     console.log('Rewarded Interstitial Ad Shown');
  //       }).catch(err => {
  //         console.log(err.message);
  //       });

  //   // Event listeners
  //   AdmobAds.addListener("rewardedInterstitialAdShowed", () => {
  //     console.log('Rewarded Interstitial Ad Showed');
  //   });

  //   AdmobAds.addListener("rewardedInterstitialAdFailedToShow", () => {
  //     console.log('Rewarded Interstitial Ad Fail To Show');
  //   });

  //   AdmobAds.addListener("rewardedInterstitialAdDismissed", () => {
  //     console.log('Rewarded Interstitial Ad Dismissed');
  //   });

  //   AdmobAds.addListener("rewardedInterstitialAdClicked", () => {
  //     console.log('Rewarded Interstitial Ad Clicked');
  //   });

  //   AdmobAds.addListener("rewardedInterstitialAdImpression", () => {
  //     console.log('Rewarded Interstitial Ad Impression');
  //   });

  //   AdmobAds.addListener("rewardedInterstitialAdOnRewarded", () => {
  //     console.log('Rewarded Interstitial Ad Rewarded');
  //   });
  //   }

  async goToEditProfile() {
    const modal = await this.modalCtrl.create({
      component: EditProfileComponent,
    });
    return await modal.present();
  }

  async goToChangePassword() {
    const modal = await this.modalCtrl.create({
      component: ChangePasswordComponent,
    });
    return await modal.present();
  }

  logout() {
    this.afAuth.signOut().then(() => {
      this.user = null;
      this.navCtrl.navigateRoot('/login');
      this.menuCtrl.close(); // Ajoutez cette ligne pour fermer le menu
    }).catch((error) => {
      console.error('Erreur lors de la déconnexion:', error);
    });
  }

  toggleTabsVisibility(visible: boolean) {
    const tabBar = document.querySelector('ion-tab-bar');
    if (tabBar) {
      tabBar.style.display = visible ? 'flex' : 'none';
    }
  }
  shareOnWhatsApp() {
    const text = "Découvrez cette incroyable application!";
    const url = "https://play.google.com/store/apps/details?id=com.senrevision.app";
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}%20${encodeURIComponent(url)}`;
    window.open(whatsappUrl, '_blank');
  }
}
