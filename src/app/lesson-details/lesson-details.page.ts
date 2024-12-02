import { Component, HostListener, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ContentModalComponent } from '../content-modal/content-modal.component';
import { IonContent, isPlatform, ModalController, ScrollDetail } from '@ionic/angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { AdmobAds } from 'capacitor-admob-ads';

@Component({
  selector: 'app-lesson-details',
  templateUrl: './lesson-details.page.html',
  styleUrls: ['./lesson-details.page.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})

export class LessonDetailsPage implements OnInit {
  @ViewChild('content', { static: false }) content: IonContent;
  lessonId: string | null = null;
  Idmatier: string | null = null;
  lesson: any = null;
  videos: any[] = [];
  exercises: any[] = [];
  iframeSrc: SafeResourceUrl | null = null;
  public progress = 0;
  public progressVoc:any = 0;
  elSpeak:string;
  show:boolean= true;
  progressInterval:any;
  showVocal:boolean = true;
  english:string[] = [
    "9017", "8631", "8637", "8645", "8652", "8658", "8664"
  ];
  isSpeaking = false;
  loadingTab:any[] = [
    1,2,3,4,5,6,7,8,9,10,11, 12, 13 , 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
  ];
  selectedVoice: any;


  constructor(
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private modalController: ModalController,
    private sanitizer: DomSanitizer,
  ) {
    this.route.paramMap.subscribe(params => {
      this.lessonId = params.get('lessonId');
      this.Idmatier = params.get('Idmatier');
      if (this.english.includes(this.Idmatier)){
        this.showVocal = false;
      }
      this.loadLesson();
    });
  }


  
  ngOnInit() { 
    this.publicite();
  }

  ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.stopSpeak();
  }

  ionViewDidEnter(){
    this.publicite();
  }

  ionViewDidLeave() {
    this.stopSpeak();
  }
  //  publicité

   publicite(){
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

   async initializeVoice() {
    try {
      const voices = await TextToSpeech.getSupportedVoices();
      console.log(voices);

      // Filtrer pour trouver une voix masculine en français
      this.selectedVoice = voices.voices.findIndex(
        (voice) => 
          voice.lang.startsWith('fr')  &&// Langue française
          voice.default === false
      );

      if (!this.selectedVoice) {
        console.warn('Aucune voix masculine en français trouvée. Utilisation d\'une voix par défaut.');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des voix:', error);
    }
  }

  async handleScroll(ev: CustomEvent<ScrollDetail>) {
    const scrollElement :ScrollDetail = ev.detail;
    const scrollTop = scrollElement.scrollTop;
    const scrollEleme = await this.content.getScrollElement();
    const scrollHeight = scrollEleme.scrollHeight - scrollEleme.clientHeight;
    
    if (scrollHeight > 0) {
      this.progress = Math.round(((scrollTop / scrollHeight) * 1) * 100) / 100; // pour arrondir
      // console.log('scroll', this.progress);
    }
  }
  
  vocalPourcentage(estimatedDuration: number) {
    let currentProgress = 0;
    const interval = 1000; // Intervalle en ms (1 seconde)

    // Met à jour la progression toutes les secondes
    const updateProgress = () => {
      currentProgress += ((interval / 1000 / estimatedDuration) * 100) /100;
      this.progressVoc = Math.min(currentProgress, 100).toFixed(2);
      if (currentProgress >= 100) {
        clearInterval(this.progressInterval);
      }
    };

    // Démarre le timer de progression
    this.progressInterval = setInterval(updateProgress, interval);
  }

  // Découpe le texte en morceaux
  splitText(text: string, maxLength: number): string[] {
    const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+/g) || []; // Découper par phrase
    const result: string[] = [];
    let currentSegment = '';

    sentences.forEach((sentence) => {
      if ((currentSegment + sentence).length > maxLength) {
        result.push(currentSegment.trim());
        currentSegment = sentence;
      } else {
        currentSegment += sentence;
      }
    });

    if (currentSegment) {
      result.push(currentSegment.trim());
    }

    return result;
  }

  // Lecture du texte
  async speak() {
    if (this.elSpeak && this.showVocal && !this.isSpeaking) {
      this.show = false;

      const text = this.elSpeak.trim().replace(/\s+/g, ' ');
      const segments = this.splitText(text, 200); // Limite de 200 caractères
      const totalWords = text.split(' ').length;
      const readingRate = 180; // mots par minute
      const estimatedDuration = (totalWords / readingRate) * 60; // Durée estimée

      this.isSpeaking = true;

      try {
        // Lancer la progression
        this.vocalPourcentage(estimatedDuration);
        for (const segment of segments) {
          await TextToSpeech.speak({
            text: segment,
            lang: 'fr-FR',
            rate: 1.0,
            pitch: 1.0,
            volume: 1.0,
          });
        }

        // Lecture terminée
        this.isSpeaking = false;
        this.show = true;
        clearInterval(this.progressInterval);
      } catch (error) {
        // console.error('Erreur lors de la lecture du texte:', error);
        this.isSpeaking = false;
        clearInterval(this.progressInterval);
      }
    } else {
      console.log('Déjà en train de parler ou aucune entrée valide.');
    }
  }

  // Arrêter la lecture
  async stopSpeak() {
    try {
      await TextToSpeech.stop();
      this.isSpeaking = false;
      this.show = true;
      clearInterval(this.progressInterval);
      console.log('Lecture arrêtée');
    } catch (error) {
      console.error("Erreur lors de l'arrêt de la lecture :", error);
    }
  }


  async loadLesson() {
    const apiUrl = `https://senrevision.com/wp-json/wp/v2/ib_educator_lesson/${this.lessonId}`;
    const response = await this.httpClient.get(apiUrl).toPromise();
    const lessonDetails = response as any;
    lessonDetails.content.rendered = this.removeHyperlinks(lessonDetails.content.rendered).innerHTML;
    this.elSpeak = this.removeHyperlinks(lessonDetails.content.rendered).innerText;     
    if(this.elSpeak.includes('{')){
      this.showVocal = false;
    }
    console.log('====================================');
    console.log(this.elSpeak.includes('{'));
    console.log(lessonDetails);
    console.log('====================================');
    this.lesson = lessonDetails;
    this.parseLessonContent();
  }

  goBack(){
    history.back();
  }

  removeHyperlinks(content: string): any {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const anchorElements = tempDiv.getElementsByTagName('a');

    for (let i = anchorElements.length - 1; i >= 0; i--) {
      const parent = anchorElements[i].parentNode;
      const textNode = document.createTextNode(anchorElements[i].textContent || '');
      parent?.replaceChild(textNode, anchorElements[i]);
    }

    return tempDiv;
  }

  parseLessonContent() {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = this.lesson.content.rendered;

    // Extraire les vidéos (balises iframe)
    const videoElements = tempDiv.getElementsByTagName('iframe');
    for (let i = 0; i < videoElements.length; i++) {
      this.videos.push(videoElements[i].outerHTML);
    }

    // Extraire les exercices (balises h3)
    const exerciseElements = tempDiv.getElementsByTagName('h3');
    for (let i = 0; i < exerciseElements.length; i++) {
      this.exercises.push(exerciseElements[i].outerHTML);
    }

    // Extraire l'URL de l'iframe PDF
    const regex = /<iframe[^>]*src="([^"]*)"[^>]*>/;
    const match = tempDiv.innerHTML.match(regex);

    if (match && match[1]) {
      this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(match[1]);
    }
    }
    
    async presentContentModal(title: string, content: string) {
    const modal = await this.modalController.create({
    component: ContentModalComponent,
    componentProps: {
    title: title,
    content:content
    }
    });
    return await modal.present();
    }
    
    async showVideos() {
    const videosHtml = this.videos.join('');
    await this.presentContentModal('Vidéos', videosHtml);
    }
    
    async showExercises() {
    const exercisesHtml = this.exercises.join('');
    await this.presentContentModal('Exercices', exercisesHtml);
    }
    }