import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { isPlatform } from '@ionic/angular';
import { IonModal } from '@ionic/angular/common';
import { AdmobAds, BannerSize, BannerPosition } from 'capacitor-admob-ads';
import { DeepChat } from 'deep-chat';
import { tap } from 'rxjs';

@Component({
  selector: 'app-page-ia',
  templateUrl: './page-ia.page.html',
  styleUrls: ['./page-ia.page.scss'],
})
export class PageIAPage implements AfterViewInit {
   @ViewChild(IonModal) modal: IonModal;
   @ViewChild('chat', { static: false }) chat!: ElementRef; // Référence DOM
   @ViewChild('btn', { static: false }) btn!: ElementRef;
  chatInstance!: DeepChat; // Instance de DeepChat
  show:boolean = false;
  keys:string="pzdDhy6QJgg4LpSjnMEQYDPMdWZiJZ8lG9Rxaej2";
  showAbone:boolean = false;

  buttons = [
    { text: 'Je fais l\'école primaire.' },
    { text: 'Je fais le collège.' },
    { text: 'Je fais le lycée.' },
  ];

  constructor(
   private httpClient: HttpClient,  
   private afAuth: AngularFireAuth,
   ) {
   this.getKeyia();
   this.getUserInformation();
  }

  ionViewWillEnter(){
   this.getKeyia();
   this.getUserInformation();
  }

  ngOnInit() {
   this.getKeyia();
   this.getUserInformation();
  }

// get user information
async getUserInformation() {
   const dateToday = new Date(); // date actuell
   const modDate = new Date(dateToday);
   const formattedDate = modDate.toISOString().replace('T', ' ').slice(0, 19); // format de date YYYY-MM-DD HH:mm:ss

   this.afAuth.authState.subscribe((user) => {
      if (user) {
          const dataCreat = new Date(user.metadata.creationTime);
          dataCreat.setDate(dataCreat.getDate() + 7); // ajout 7 days
          const formattedDateCreat = dataCreat.toISOString().replace('T', ' ').slice(0, 19);

          if (formattedDateCreat < formattedDate) { // condition si la perdiode d'essaye est fini
             this.getAbonnementUser(user.uid);
          } else {
             this.showAbone = false;
          }

         console.log('====================================');
         console.log("conneter");
         console.log('====================================');
      }else{
         console.log('====================================');
         console.log('User non connecté');
         console.log('====================================');
      }
   });
}


// get abonnement user
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
  
      if (!data || data.length === 0) {
          this.showAbone = true; 
          return;
      }else{
          this.showAbone = false; 
      }
          
          if (data.statut === '') {
             this.showAbone = true; 
            }
            // Verify payments if data exists
            this.verifPaiements(data.id, data.idpayment, data.type);
     }
   )
}

// verfication du paiements
async verifPaiements(id:any, idpaiement:any, type:any) {
   const basicAuth = btoa('jangalma:fooNekkJ@ng');
   const options = {
      headers: new HttpHeaders({
         'Content-Type': 'application/json', // Notez l'utilisation des minuscules ici
         'X-API-KEY': 'dialoukaye',
         Authorization: `Basic ${basicAuth}`,
     }),
   }
   this.httpClient
   .get(`https://pointel.jangalma.net/gestion/api/abonne/checkPayment/${id}/${idpaiement}/${type}`, options)
   .pipe(
     tap(() => 
       // this.presentLoading()
     console.log('affiche verif Paiement')
   )
   )
   .subscribe(
     (data: any) => {
        console.log('====================================');
        console.log(data);
        console.log('====================================');
        if(data.statut === "valide"){
         this.showAbone = false; 
        }
     }
   )
 }

  
//   get key IA
async getKeyia() {
   const basicAuth = btoa('jangalma:fooNekkJ@ng');
   const options = {
      headers: new HttpHeaders({
         'Content-Type': 'application/json', // Notez l'utilisation des minuscules ici
         'X-API-KEY': 'dialoukaye',
         Authorization: `Basic ${basicAuth}`,
     }),
   }
   this.httpClient
   .get('https://pointel.jangalma.net/gestion/api/getkey', options)
   .pipe(
     tap(() => 
       // this.presentLoading()
     console.log('affiche')
     
   )
   )
   .subscribe(
     (data: any) => {
        this.keys = data.key.keyIA;
       console.log(this.keys);
     }
   )
}



  // Initialisation après que la vue soit rendue
  ngAfterViewInit() {
    if (this.chat && this.chat.nativeElement) {
      // Initialiser DeepChat avec l'élément DOM
      this.chatInstance = this.chat.nativeElement;
    } else {
      console.error('Erreur : L\'élément chat n\'est pas disponible.');
    }
  }

  // Gestionnaire d'événements pour le clic sur les boutons
  handleButtonClick(button: any): void {
    if (this.chatInstance) {
      // Utiliser l'API DeepChat pour envoyer un message
      this.chatInstance.submitUserMessage({ text: button.text });
      console.log('Message envoyé :', button.text);
    } else {
      console.error('Erreur : DeepChat n\'est pas encore initialisé.');
    }
  }



  async ionViewDidEnter() {
   this.getKeyia();
    const adId = isPlatform('ios') ? 'ca-app-pub-8580211937730370/5109353619' : 'ca-app-pub-8580211937730370/5687437762';
     AdmobAds.showBannerAd({ adId, isTesting: false, adSize: BannerSize.BANNER, adPosition: BannerPosition.TOP }).then(() => {
        this.show = true;
       console.log('Banner Ad Shown');

    }).catch(err => {
       console.log(err.message);
    });
    
    // To hide a banner ad
     AdmobAds.hideBannerAd().then(() => {
       console.log('Banner Ad Hidden')
    }).catch(err => {
       console.log(err.message);
    });
    
    // To resume a hidden banner ad
    AdmobAds.resumeBannerAd().then(() => {
       console.log('Banner Ad Resumed');
    }).catch(err => {
       console.log(err.message);
    });
    
    // To remove a banner ad
    AdmobAds.removeBannerAd().then(() => {
       console.log('Banner Ad Removed');
    }).catch(err => {
       console.log(err.message);
    });
    
    // Event Listeners
    AdmobAds.addListener("bannerAdOpened", () => {
       console.log('Banner Ad Opened');
    });
    
    AdmobAds.addListener("bannerAdClicked", () => {
       console.log('Banner Ad Clicked');
    });
    
    AdmobAds.addListener("bannerAdImpression", () => {
       console.log('Banner Ad Impression');
    });
    
    AdmobAds.addListener("bannerAdClosed", () => {
       console.log('Banner Ad Closed');
    });
   }

 
   ionViewWillLeave() {
    if(this.show){
      AdmobAds.hideBannerAd();
    }
   }

}
