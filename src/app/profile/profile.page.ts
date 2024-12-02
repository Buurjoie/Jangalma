import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertController } from '@ionic/angular';
import { User } from '@firebase/auth';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user: any;
  name: any;
  surname: string = '';
  email: string = '';
  city: string = '';
  phone: string = '';
  class_: string = '';

  constructor(
    private router: Router,
    public afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    public alertController: AlertController,
    private fireAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {}

  ngOnInit() {
    this.fireAuth.user.subscribe((user: any) => {
      if (user) {
        this.name = user.displayName?.split(' ')[0] ?? '';
        this.surname = user.displayName?.split(' ')[1] ?? '';
        this.email = user.email ?? '';
    
        this.firestore
        .doc(`users/${user.uid}`)
        .get()
        .toPromise()
        .then((doc) => {
          if (doc && doc.exists) { // Ajoutez une vérification pour doc
            const data = doc.data() as any;
              this.city = data.city;
              this.phone = data.phone;
              this.class_ = data.class_;
            }
          });
      }
    });
    
  }

  async editProfile() {
    const alert = await this.alertController.create({
      header: 'Modifier le profil',
      inputs: [
        {
          name: 'name',
          type: 'text',
          value: this.name,
          placeholder: 'Prénom',
        },
        {
          name: 'surname',
          type: 'text',
          value: this.surname,
          placeholder: 'Nom',
        },
        {
          name: 'city',
          type: 'text',
          value: this.city,
          placeholder: 'Ville',
        },
        {
          name: 'phone',
          type: 'tel',
          value: this.phone,
          placeholder: 'Téléphone',
        },
        {
          name: 'class_',
          type: 'text',
          value: this.class_,
          placeholder: 'Classe',
        },
      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
        },
        {
          text: 'Confirmer',
          handler: async data => {
            if (data.name && data.surname && data.city && data.phone && data.class_) {
              try {
                await this.user.updateProfile({
                  displayName: data.name + ' ' + data.surname,
                });
                this.name = data.name;
                this.surname = data.surname;
                
                await this.afs.collection('users').doc(this.user.uid).update({
                  city: data.city,
                  phone: data.phone,
                  class_: data.class_,
                });
                this.city = data.city;
                this.phone = data.phone;
                this.class_ = data.class_;
                
                console.log('Profil mis à jour avec succès');
              } catch (error) {
                console.error('Erreur lors de la mise à jour du profil', error);
              }
            }
          },
        },
      ],
    });
  
    await alert.present();
  }  

  async changePassword() {
    const alert = await this.alertController.create({
      header: 'Changer le mot de passe',
      inputs: [
        {
          name: 'password',
          type: 'password',
          placeholder: 'Nouveau mot de passe',
        },
      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
        },
        {
          text: 'Confirmer',
          handler: async data => {
            if (data.password) {
              try {
                await this.user.updatePassword(data.password);
                console.log('Mot de passe mis à jour avec succès');
              } catch (error) {
                console.error('Erreur lors de la mise à jour du mot de passe', error);
              }
            }
          },
        },
      ],
    });

    await alert.present();
  }

  logout() {
    this.afAuth.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
