import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { tap } from 'rxjs';

@Component({
  selector: 'app-paiement',
  templateUrl: './paiement.page.html',
  styleUrls: ['./paiement.page.scss'],
})
export class PaiementPage implements OnInit {
  abonnements = [
    {nom: 'Journalier', prix: '100', descriptif: '1 Jour' },
    {nom: 'Hebdomadaire', prix: '500', descriptif: '7 Jours' },
    {nom: 'Mensuel', prix: '1000', descriptif: '30 Jours'},
    {nom: 'Annuel', prix: '5000', descriptif: '1 ans'},
   ];
 
   form: FormGroup;
   choixpaie:string;
   nom: string;
   phone: number;
   montant: number;
   accont: number;
   prix:any;
   modepaie: string;
   dataAbonn:any;
   user:any;
   iduser:any;


  constructor( 
    private route: ActivatedRoute,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private httpClient: HttpClient,  
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
  ) { 
    this.route.paramMap.subscribe(params => {
      this.prix = params.get('prix');
    });

    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.iduser = user.uid;
        this.firestore.collection('users').doc(user.uid).valueChanges().subscribe((userData: any) => {
          this.user = userData;
          console.log(userData);
          
        });
      } else {
        this.user = null;
      }
    });

    this.initForm();
  }


  initForm() {
    this.form = new FormGroup({
      nom: new FormControl('',
        { validators: [Validators.required] }
      ),
      phone: new FormControl('',
        { validators: [Validators.required] }
      ),
      montant: new FormControl('',
        { validators: [Validators.required] }
      ),
      prix: new FormControl('',
        { validators: [Validators.required] }
      ),
    });
  }

  ngOnInit() {
    this.dataAbonn = this.abonnements.filter(a => a.prix == this.prix)[0];

    console.log(this.dataAbonn);
    const leprix = this.dataAbonn.prix
    this.montant = Math.round((leprix - (-(leprix / 100))));
  }

  ionViewWillEnter(){

  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Connexion en cours...',
      spinner: 'crescent',
      duration: 0
    });
    await loading.present();
  }



  async showToast(message: string, duration: number = 2000, color: string = 'primary') {
    const toast = await this.toastController.create({
      message,           // Message du toast
      duration,          // Durée en millisecondes
      color,             // Couleur du toast (primary, success, danger, etc.)
      position: 'top' // Position (top, middle, bottom)
    });

    await toast.present(); // Affiche le toast
  }

  // choix du paiement
  choixPaiement(choix) {
    this.modepaie = choix;
     if(choix === "om"){
      this.choixpaie = 'Paiemant via Orange Money';
     }else if(choix === "wave"){
      this.choixpaie = 'Paiemant via Wave';
     }
  }

  async onSubmit() {
    await this.presentLoading();
       if(this.nom && this.phone && this.montant, this.modepaie){
        let url = "";
        let canal = "";
        if(this.modepaie === "om"){
          canal = "OM";
           url = '';
         }else if(this.modepaie === "wave"){
          canal = "Wave";
           url = 'https://pointel.jangalma.net/gestion/api/paiement/wave';
         }

         const data : any = {
          userid : this.iduser,
          name : this.nom,
          phone : this.phone,
          account: this.montant,
          canal : canal,
          ville : this.user.city,
          type : this.dataAbonn.nom
        }

        console.log('====================================');
        console.log(data);
        console.log('====================================');

        const basicAuth = btoa('jangalma:fooNekkJ@ng');
        const options = {
           headers: new HttpHeaders({
              'Content-Type': 'application/json', // Notez l'utilisation des minuscules ici
              'X-API-KEY': 'dialoukaye',
              Authorization: `Basic ${basicAuth}`,
          }),
        };
        
        this.httpClient
        .post(url,data,options)
        .pipe(
          tap(() => 
            // this.presentLoading()
          console.log('affiche')
          
        )
        )
        .subscribe(
          async(dataelm: any) => {
            this.loadingController.dismiss();
            this.showToast(dataelm.message, 3000, 'success');
            if (dataelm?.url) {
              window.location = dataelm.url;
             } 
            // console.log(dataelm);
          },
          async(error: any) => {
            // Fermer le chargement en cas d'erreur
            await this.loadingController.dismiss();
            this.showToast('Échec du paiement.', 3000, 'danger');
            console.error('Erreur :', error);
          }
        )
       }else{
         this.loadingController.dismiss();
          // affiche toas
          this.showToast('Veiller saisir les informations demandé.', 3000, 'danger');
         return;
       }
  }

}
