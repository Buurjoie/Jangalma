import { Component } from '@angular/core';
import { isPlatform, NavController } from '@ionic/angular';
import { AdServiceService } from '../ad-service.service';
import { register } from 'swiper/element/bundle';

register();

@Component({
  selector: 'app-classes',
  templateUrl: './classes.page.html',
  styleUrls: ['./classes.page.scss'],
})
export class ClassesPage {
  classes: { name: string; title: string, img:string }[] = [
    { name: '6eme', title: 'Sixième', img:'assets/images/classe6.png' },
    { name: '5eme', title: 'Cinquième', img:'assets/images/classe5.png' },
    { name: '4eme', title: 'Quatrième', img:'assets/images/classe4.png' },
    { name: '3eme', title: 'Troisième', img:'assets/images/classe3.png' },
    { name: '2nd', title: 'Seconde', img:'assets/images/classe2.png' },
    { name: '1er', title: 'Première', img:'assets/images/classe1.png' },
    { name: 'Tle', title: 'Terminale', img:'assets/images/classeTL.png' },
  ];

  constructor(public navCtrl: NavController, public adService: AdServiceService,) {
    // this.initializ();
    // this.banner();
  }
  ngOnInit() {
  
  }
 

  showSubjects(classe: string) {
    this.adService.handleClick(); // Ajoutez cette ligne pour gérer le clic
    this.navCtrl.navigateForward(`/subjects/${classe}`);
  }
}
