import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage {
  newPassword = '';

  constructor(private authService: AuthService) {}

  async onChangePassword() {
    // Récupérez le token depuis le stockage local
    const token = localStorage.getItem('access_token');

    if (token) {
      // Appelez la méthode changeUserPassword avec le token et le nouveau mot de passe
      const success = await this.authService.changeUserPassword(token, this.newPassword);

      if (success) {
        // Le mot de passe a été modifié avec succès
      } else {
        // Échec du changement de mot de passe
      }
    }
  }
}