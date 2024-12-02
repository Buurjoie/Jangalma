import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage {
  name = '';
  surname = '';
  email = '';
  city = '';
  phone = '';
  class_ = '';

  constructor(private authService: AuthService) {}

  async onEditProfile() {
    // Récupérez le token depuis le stockage local
    const token = localStorage.getItem('access_token');

    if (token) {
      const updatedUserInfo = {
        name: this.name,
        surname: this.surname,
        email: this.email,
        city: this.city,
        phone: this.phone,
        class: this.class_,
      };

      // Appelez la méthode updateUserProfile avec le token et les informations mises à jour
      const success = await this.authService.updateUserProfile(token, updatedUserInfo);

      if (success) {
        // Le profil a été mis à jour avec succès
      } else {
        // Échec de la mise à jour du profil
      }
    }
  }
}

