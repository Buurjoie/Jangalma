import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatform, NavController } from '@ionic/angular';
import { tap } from 'rxjs/operators';
import { AdServiceService } from '../ad-service.service'; 
import { AdmobAds } from 'capacitor-admob-ads';
import { AngularFireAuth } from '@angular/fire/compat/auth';
@Component({
  selector: 'app-liste-bilio',
  templateUrl: './liste-bilio.page.html',
  styleUrls: ['./liste-bilio.page.scss'],
})
export class ListeBilioPage implements OnInit {
  courseId: number = 0;
  lessons: any[] = [];
  loadingTab:any[] = [
    1,2,3,4,5,6,7,8,9,10
  ];
  showAbone:boolean = false;

  constructor(
    private route: ActivatedRoute, 
    private http: HttpClient, 
    private navController: NavController, 
    public adService: AdServiceService,
    private afAuth: AngularFireAuth
  ) {
    this.getUserInformation();
  }

  ionViewWillEnter(){
    this.getUserInformation();
  }

  ngOnInit() {
    this.courseId = Number(this.route.snapshot.paramMap.get('courseId'));
    this.loadLessons(this.courseId);
  }


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
  this.http
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
  this.http
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
       if( data && data.statut === "valide"){
        this.showAbone = false; 
       }
    }
  )
}


  ionViewDidEnter(){
    const adId = isPlatform('ios') ? 'ca-app-pub-8580211937730370/2152454453' : 'ca-app-pub-8580211937730370/1221309649';
      // To load an interstital ad
    AdmobAds.loadInterstitialAd({ adId, isTesting: false }).then(() => {
      console.log('Interstitial Ad Loaded');
    }).catch(err => {
      console.log(err.message);
    });

    // To show an already loaded interstitial ad
    AdmobAds.showInterstitialAd().then(() => {
      console.log('Interstitial Ad Shown');
    }).catch(err => {
      console.log(err.message);
    });

    // Event listeners
    AdmobAds.addListener("interstitialAdClicked", () => {
      console.log('Interstitial Ad Clicked');
    });

    AdmobAds.addListener("interstitialAdDismissed", () => {
      console.log('Interstitial Ad Dismissed');
    });

    AdmobAds.addListener("interstitialAdFailedToShow", () => {
      console.log('Interstitial Ad Failed To Show');
    });

    AdmobAds.addListener("interstitialAdImpression", () => {
      console.log('Interstitial Ad Impression');
    });

    AdmobAds.addListener("interstitialAdShowed", () => {
      console.log('Interstitial Ad Showed');
    });
  }

  loadLessons(courseId: number) {
    const apiUrl = `https://senrevision.com/wp-json/wp/v2/ib_educator_lesson?meta_key=_ibedu_course&meta_value=${courseId}&per_page=100`;
  
    this.http.get<any[]>(apiUrl)
      .pipe(
        tap(() => console.log('Chargement...'))
      )
      .subscribe((lessons: any[]) => {
        this.lessons = lessons.map(lesson => {
          return {
            ...lesson,
            featured_image_url: 'assets/images/book.png'
          };
        });
      });
  }

  openLessonDetails(lessonId: number) {
    this.adService.handleClick();
    this.navController.navigateForward(`/detaille-biblio/${lessonId}`);
  }
}
