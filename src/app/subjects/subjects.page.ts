import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, LoadingController, isPlatform } from '@ionic/angular';
import { AdServiceService } from '../ad-service.service';
import { AdmobAds, BannerSize, BannerPosition } from 'capacitor-admob-ads';

const baseSubjects = [
  'Français',
  'Mathématiques',
  'SVT',
  'Anglais',
  'Histoire',
  'Géographie',
];

const additionalSubjects = {
  '4eme': ['Physique&Chimie'],
  '3eme': ['Physique&Chimie'],
  '2nd': ['Physique&Chimie'],
  '1er': ['Physique&Chimie'],
  'Tle': ['Physique&Chimie', 'Philosophie'],
};

const subjectImages: { [key: string]: string } = {
  'Français': 'assets/images/francais.png',
  'Mathématiques': 'assets/images/mathematiques.png',
  'SVT': 'assets/images/SVT.png',
  'Anglais': 'assets/images/ang.png',
  'Histoire': 'assets/images/histoire.png',
  'Géographie': 'assets/images/geographie.png', 
  'Physique&Chimie': 'assets/images/physique-chimie.png',
  'Philosophie': 'assets/images/philosophie.png',
};


const courseConfig = {
  '6eme': {
    'Français': '8625',
    'Mathématiques': '8626',
    'SVT': '9016',
    'Anglais': '9017',
    'Histoire': '8629',
    'Géographie': '9015',
  },
  '5eme': {
    'Français': '8630',
    'Mathématiques': '8634',
    'SVT': '8632',
    'Anglais': '8631',
    'Histoire': '8633',
    'Géographie': '8884',
},
'4eme': {
  'Français': '8640',
  'Mathématiques': '8642',
  'SVT': '8639',
  'Anglais': '8637',
  'Histoire': '8638',
  'Géographie': '8636',
  'Physique&Chimie': '8976',
},
'3eme': {
  'Français': '8644',
  'Mathématiques': '8649',
  'SVT': '8648',
  'Anglais': '8645',
  'Histoire': '8646',
  'Géographie': '8647',
  'Physique&Chimie': '8980',
},
'2nd': {
  'Français': '8651',
  'Mathématiques': '8656',
  'SVT': '8655',
  'Anglais': '8652',
  'Histoire': '8653',
  'Géographie': '8654',
  'Physique&Chimie': '8982',
},
'1er': {
  'Français': '8657',
  'Mathématiques': '8662',
  'SVT': '8661',
  'Anglais': '8658',
  'Histoire': '8659',
  'Géographie': '8660',
  'Physique&Chimie': '8989',
},
'Tle': {
  'Français': '8663',
  'Mathématiques': '8668',
  'SVT': '8667',
  'Anglais': '8664',
  'Histoire': '8665',
  'Géographie': '8666',
  'Physique&Chimie': '8992',
  'Philosophie': '8669',
},

};

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.page.html',
  styleUrls: ['./subjects.page.scss'],
})
export class SubjectsPage implements OnInit {
  classe: string | null = null;
  subjects: string[] = [];  
  subjectImages = subjectImages;
  show:boolean = false;

  constructor(private route: ActivatedRoute, private router: Router, private loadingCtrl: LoadingController,  public adService: AdServiceService,) {
    this.route.paramMap.subscribe(params => {
      this.classe = params.get('classe');
      if (this.classe && additionalSubjects.hasOwnProperty(this.classe as keyof typeof additionalSubjects)) {
        this.subjects = baseSubjects.concat(additionalSubjects[this.classe as keyof typeof additionalSubjects]);
      } else {
        this.subjects = baseSubjects;
      }         
    });
  }

  ngOnInit() {}

  async ionViewDidEnter() {
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

  openLessons(subject: string) {
    this.adService.handleClick();
    const courseId = this.classe && courseConfig.hasOwnProperty(this.classe as keyof typeof courseConfig) ? courseConfig[this.classe as keyof typeof courseConfig][subject as keyof typeof courseConfig['6eme']] : '';
    this.router.navigate(['/lessons', { courseId }]);
    console.log('Classe:', this.classe);
    console.log('Subjects:', this.subjects);

  }
  }
