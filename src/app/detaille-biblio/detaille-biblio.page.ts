import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { isPlatform } from '@ionic/angular';
import { AdmobAds } from 'capacitor-admob-ads';

@Component({
  selector: 'app-detaille-biblio',
  templateUrl: './detaille-biblio.page.html',
  styleUrls: ['./detaille-biblio.page.scss'],
})
export class DetailleBiblioPage implements OnInit {
  lessonId: number = 0;
  lesson: any;
  iframeSrc: SafeResourceUrl | null = null;
  loadingTab:any[] = [
    1,2,3,4,5,6,7,8,9,10,11, 12, 13 , 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
  ];

  constructor(private route: ActivatedRoute, private http: HttpClient, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.lessonId = Number(this.route.snapshot.paramMap.get('lessonId'));
    this.loadLessonDetails(this.lessonId);
  }

  ionViewDidEnter(){
    const adId = isPlatform('ios') ? 'ca-app-pub-8580211937730370/8875955840' : 'ca-app-pub-8580211937730370/1688715750';
   // To load a rewarded video ad
    AdmobAds.loadRewardedVideoAd({ adId, isTesting: false }).then(() => {
      console.log('Rewarded Video Ad Loaded');
    }).catch(err => {
      console.log(err.message);
    });

    // To show an already loaded rewarded video ad
    AdmobAds.showRewardedVideoAd().then(() => {
      console.log('Rewarded Video Ad Shown');
    }).catch(err => {
      console.log(err.message);
    });

    // Event listeners
    AdmobAds.addListener("rewardedVideoAdShowed", () => {
      console.log('Rewarded Video Ad Showed');
    });

    AdmobAds.addListener("rewardedVideoAdFailedToShow", () => {
      console.log('Rewarded Video Ad Fail To Show');
    });

    AdmobAds.addListener("rewardedVideoAdDismissed", () => {
      console.log('Rewarded Video Ad Dismissed');
    });

    AdmobAds.addListener("rewardedVideoAdClicked", () => {
      console.log('Rewarded Video Ad Clicked');
    });

    AdmobAds.addListener("rewardedVideoAdImpression", () => {
      console.log('Rewarded Video Ad Impression');
    });

    AdmobAds.addListener("rewardedVideoAdOnRewarded", () => {
      console.log('Rewarded Video Ad Rewarded');
    });
  }

  async loadLessonDetails(lessonId: number) {
    const apiUrl = `https://senrevision.com/wp-json/wp/v2/ib_educator_lesson/${lessonId}`;

    this.http.get<any>(apiUrl).subscribe(async (lesson: any) => {
      const iframeUrl = this.extractIframeUrl(lesson.content.rendered);

      if (iframeUrl) {
        this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(iframeUrl);
      }

      this.lesson = lesson;
    });
  }

  goBack(){
    history.back();
  }

  extractIframeUrl(content: string): string | null {
    const regex = /<iframe[^>]*src="([^"]*)"[^>]*>/;
    const match = content.match(regex);

    if (match && match[1]) {
      return match[1];
    }

    return null;
  }
}
