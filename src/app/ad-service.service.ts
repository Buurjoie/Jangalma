import { Injectable } from '@angular/core';
import { AdMob, RewardAdOptions, AdLoadInfo, RewardAdPluginEvents, AdMobRewardItem, BannerAdOptions, BannerAdSize, BannerAdPosition, BannerAdPluginEvents, AdMobBannerSize } from '@capacitor-community/admob';

@Injectable({
  providedIn: 'root'
})
export class AdServiceService {
  private clickCount: number = 0;

  constructor() {
    this.setupAdListeners();
  }

  public handleClick() {
    this.clickCount++;
    if (this.clickCount >= 3) {
      this.showRewardVideoAd();
      this.clickCount = 0;  // Réinitialisez le compteur après avoir affiché la vidéo
    }
  }

  private setupAdListeners() {
    AdMob.addListener(RewardAdPluginEvents.Loaded, (info: AdLoadInfo) => {
      // Événements lorsqu'une annonce est chargée
    });

    AdMob.addListener(RewardAdPluginEvents.Rewarded, (rewardItem: AdMobRewardItem) => {
      // Événements lorsque l'utilisateur est récompensé
      console.log(rewardItem);
    });
  }

  private async showRewardVideoAd() {
    try {
      const options: RewardAdOptions = {
        adId: 'ca-app-pub-8580211937730370/2333215332',
      };
      await AdMob.prepareRewardVideoAd(options);
      await AdMob.showRewardVideoAd();
    } catch (error) {
      console.error("Erreur lors de l'affichage de la vidéo récompensée:", error);
    }
  }

  public async showBannerAd() {
    try {
      const options: BannerAdOptions = {
        adId: 'ca-app-pub-8580211937730370/5687437762',
        adSize: BannerAdSize.BANNER,
        position: BannerAdPosition.BOTTOM_CENTER,
        margin: 0
      };
      await AdMob.showBanner(options);
    } catch (error) {
      console.error("Erreur lors de l'affichage de la bannière:", error);
    }
  }
}