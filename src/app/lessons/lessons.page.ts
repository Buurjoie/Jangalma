import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoadingController, AlertController, isPlatform } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';
import { tap } from 'rxjs/operators';
import { AdServiceService } from '../ad-service.service';
import { AdmobAds } from "capacitor-admob-ads";

@Component({
  selector: 'app-lessons',
  templateUrl: './lessons.page.html',
  styleUrls: ['./lessons.page.scss'],
}) 
export class LessonsPage implements OnInit {
  courseId: string | null = null;
  lessons: any[] = [];
  dataLoaded: boolean = false;
  loadingTab:any[] = [
    1,2,3,4,5,6,7,8,9,10
  ]

  constructor(
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private network: Network,
    public adService: AdServiceService,
  ) {
    this.route.paramMap.subscribe(params => {
      this.courseId = params.get('courseId');
      if (!this.dataLoaded) {
        this.loadLessons();
      }
    });
  }

  ngOnInit() {
    this.checkNetworkStatus();
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
  
  


  async checkNetworkStatus() {
    if (this.network.type === this.network.Connection.NONE) {
      const alert = await this.alertController.create({
        header: 'Pas de connexion Internet',
        message: "Vous n'êtes pas connecté à Internet. Veuillez vérifier votre connexion et réessayer.",
        buttons: ['OK'],
      });
      await alert.present();
    }
  }

  loadLessons() {
    const apiUrl = `https://senrevision.com/wp-json/wp/v2/ib_educator_lesson?meta_key=_ibedu_course&meta_value=${this.courseId}&per_page=100`;

    this.httpClient.get(apiUrl)
      .pipe(
        tap(() => 
          // this.presentLoading()
        console.log('affiche')
        
      )
      )
      .subscribe((response: any) => {
        this.lessons = response;
        this.dataLoaded = true;
        console.log('====================================');
        console.log(response);
        console.log('====================================');
      });
  }

  goBack(){
    history.back();
  }
  
  openLessonDetails(lesson: any) {
    this.adService.handleClick();
    this.router.navigate([`/lesson-details/${this.courseId}/${lesson.id}`]);
  }  

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Chargement...',
      duration: 2000,
    });
    await loading.present();
    const { role, data } = await loading.onDidDismiss();
  }
}
