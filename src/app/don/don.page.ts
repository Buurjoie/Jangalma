import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-don',
  templateUrl: 'don.page.html',
  styleUrls: ['don.page.scss'],
})
export class DonPage {
  donationAmount: number;

  constructor(private http: HttpClient, private iab: InAppBrowser, private loadingController: LoadingController, private toastController: ToastController) {
    this.donationAmount = 1000;
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Traitement du paiement...',
      spinner: 'crescent',
      duration: 0
    });
    await loading.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
    });
    toast.present();
  }

  async pay(donationAmount: number) {
    await this.presentLoading();

    const url = 'https://senrevision.com/paytech_backend.php';
    const postData = {
      amount: donationAmount,
    };

    this.http.post(url, postData).subscribe(async (data: any) => {
      await this.loadingController.dismiss();

      if (data.success) {
        const browser = this.iab.create(data.redirect_url, '_blank', 'location=no,toolbar=yes');
        let donationCompleted = false;

        browser.on('loadstop').subscribe(event => {
          if (event.url.includes('?status=')) {
            const status = new URL(event.url).searchParams.get('status');
            if (status === 'success') {
              this.presentToast('Votre don a bien été pris en compte Merci pour votre générosité C\'est grâce à vous que nous allons construire l\'école de demain');
              donationCompleted = true;
            }
            browser.close();
          }
        });

        browser.on('exit').subscribe(() => {
          if (!donationCompleted) {
            this.presentToast('Le don a été annulé.');
          }
        });
      } else {
        // Gérer les erreurs éventuelles
        console.error('Erreur lors de la création de la transaction PayTech');
      }
    }, async (error) => {
      await this.loadingController.dismiss();
      // Gérer les erreurs éventuelles
      console.error(error);
    });
  }

  onPayButtonClick() {
    if (this.donationAmount >= 100) {
      this.pay(this.donationAmount);
    } else {
      alert('Le montant minimum du don est de 100 FCFA.');
    }
  }
}
