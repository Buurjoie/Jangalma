import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal, ModalController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {
  @ViewChild(IonModal) modale: IonModal;
  codeElm:any="+221";
  imgElm:any="https://flagcdn.com/w320/sn.png";
  pays:any[];
  dataPays:any[];

  userProfileForm = new FormGroup({
    name: new FormControl('', Validators.required),
    surname: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    class_: new FormControl('', Validators.required),
  });

  constructor(
    private modalCtrl: ModalController,
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private httpClient: HttpClient,
  ) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.getPays();
  }

  async getPays() {
     // this.httpClient.get('https://restcountries.com/v3.1/all')
     this.httpClient.get('assets/pays.json')
    .pipe(
      tap(() => 
        // this.presentLoading()
      console.log('affiche')
      
    )
    )
    .subscribe(
      (data: any) => {
        const elmdata = data.sort((a, b) => a.name.common.localeCompare(b.name.common));
        this.pays = elmdata;
        this.dataPays = elmdata;
        console.log(this.pays);
        
      }
    )
}

  closeModal() {
    this.modalCtrl.dismiss();
  }

  // partie pays §§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§
   // pour la recherche
   searchbarInput(ev){
    this.filterList(ev.target.value);
  }

  checkboxChange(ev) {
    let value = ev;
    const elmData = this.dataPays.filter((elm) =>(
       elm.name.common == value
    ));
    if(elmData){
      this.codeElm = elmData[0].idd.root+''+elmData[0].idd.suffixes;
      this.imgElm = elmData[0].flags.png;
    }
    console.log(this.codeElm);
    this.modale.dismiss();
  }

  // rechercher un pays
  filterList(val) {
    // this.pays = this.pays.filter((item) => {
    //   return item.name.common.toLowerCase().indexOf(val.toLowerCase()) > -1;
    // });
    this.pays = this.searchInArray(val, this.dataPays);
  }

  // pour la recherche
  searchInArray(searchTerm: string, arrayToSearch: any[]): any[] {
    const keys:any[] = ['common'];
     if (!searchTerm || searchTerm.trim() === '') {
       // Si la recherche est vide, retourner le tableau complet
       return arrayToSearch;
     }
     searchTerm = searchTerm.toLowerCase();
     // Filtrer le tableau en fonction du terme de recherche
     return arrayToSearch.filter(item => {
       const itemValue = keys.find((key) =>  item.name[key]
         ?.toString().toLowerCase().includes(searchTerm)
       );
 
       return itemValue;
     });
   }

  //  §§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§

  updateProfile() {
    if (this.userProfileForm.valid && this.codeElm) {
      const { name, surname, phone, class_ } = this.userProfileForm.value;
      const formattedPhone = `${this.codeElm}${phone}`;
      this.afAuth.user.subscribe((user) => {
        if (user) {
          this.firestore
            .collection('users')
            .doc(user.uid)
            .update({ name, surname, phone: formattedPhone, class_ })
            .then(() => {
              console.log('Profil mis à jour avec succès');
              this.closeModal();
            })
            .catch((error) => {
              console.error('Erreur lors de la mise à jour du profil:', error);
            });
        }
      });
    } else {
      console.log('Formulaire invalide');
    }
  }
}
