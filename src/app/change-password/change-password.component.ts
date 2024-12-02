import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm = new FormGroup({
    oldPassword: new FormControl('', Validators.required),
    newPassword: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required),
  });

  constructor(
    private modalCtrl: ModalController,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit() {}

  closeModal() {
    this.modalCtrl.dismiss();
  }

  async changePassword() {
    if (this.changePasswordForm.valid) {
      const { oldPassword, newPassword, confirmPassword } =
        this.changePasswordForm.value;

      if (newPassword !== confirmPassword) {
        console.error("Les mots de passe ne correspondent pas.");
        return;
      }

      const currentUser = firebase.auth().currentUser;
      if (currentUser && currentUser.email && typeof oldPassword === 'string' && typeof newPassword === 'string') {
        try {
          const credentials = firebase.auth.EmailAuthProvider.credential(
            currentUser.email,
            oldPassword
          );
          await currentUser.reauthenticateWithCredential(credentials);
          await currentUser.updatePassword(newPassword);
          console.log("Mot de passe mis à jour avec succès.");
          this.closeModal();
        } catch (error) {
          console.error("Erreur lors de la mise à jour du mot de passe:", error);
        }
      }
    } else {
      console.log("Formulaire invalide");
    }
  }


}
