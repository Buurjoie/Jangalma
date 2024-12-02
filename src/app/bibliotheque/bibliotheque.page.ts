import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AdServiceService } from '../ad-service.service';

@Component({
  selector: 'app-bibliotheque',
  templateUrl: './bibliotheque.page.html',
  styleUrls: ['./bibliotheque.page.scss'],
})
export class BibliothequePage {

  matieres = [
    { title: 'Français', id: 12705, image: 'assets/images/francais.png' },
    { title: 'Mathématiques', id: 12521, image: 'assets/images/mathematiques.png' },
    { title: 'SVT', id: 12584, image: 'assets/images/SVT.png' },
    { title: 'Anglais', id: 12743, image: 'assets/images/ang.png' },
    { title: 'Histoire', id: 20949, image: 'assets/images/histoire.png' },
    { title: 'Géographie', id: 12724, image: 'assets/images/geographie.png' },
    { title: 'Physique&Chimie', id: 21258, image: 'assets/images/physique-chimie.png' },
    { title: 'Philosophie', id: 12719, image: 'assets/images/philosophie.png' },
  ];

  constructor(private navCtrl: NavController,  public adService: AdServiceService,) {}

  openListeBilio(courseId: number) {
    this.adService.handleClick();
    this.navCtrl.navigateForward(`/liste-bilio/${courseId}`);
  }
}
