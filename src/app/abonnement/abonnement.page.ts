import { Component, OnInit } from '@angular/core';
import { AdServiceService } from '../ad-service.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-abonnement',
  templateUrl: './abonnement.page.html',
  styleUrls: ['./abonnement.page.scss'],
})
export class AbonnementPage implements OnInit {
   abonnements = [
    {nom: 'Journalier', prix: '100', descriptif: '1 Jour', img: 'maths.jpg'},
    {nom: 'Hebdomadaire', prix: '500', descriptif: '7 Jours', img: 'francais.jpg'},
    {nom: 'Mensuel', prix: '1000', descriptif: '30 Jours', img: 'histoire.jpg'},
    {nom: 'Annuel', prix: '5000', descriptif: '1 ans', img: 'anglais.jpg'},
   ];

  constructor(public adService: AdServiceService, public navCtrl: NavController) { }

  ngOnInit() {
  }

  showSubjects(prix: string) {
    this.adService.handleClick(); // Ajoutez cette ligne pour gérer le clic
    this.navCtrl.navigateForward(`/paiement/${prix}`);
  }
  
}
