import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';



@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://senrevision.com/wp-json';
  public user = {
    name: '',
    surname: '',
    email: '',
    phone: '',
    city: '', // Ajoutez cette ligne
    class: '',
  };
  token: string | null = null;

  constructor(private httpClient: HttpClient, private http: HttpClient,) {}

  async login(username: string, password: string): Promise<boolean> {
    const authUrl = `${this.apiUrl}/jwt-auth/v1/token`;
    try {
      const response = await this.httpClient.post<{ token: string }>(authUrl, { username, password }).toPromise();

      if (response && response['token']) {
        localStorage.setItem('access_token', response['token']);
        await this.getUserInfo(response['token']);
        return true;
      }
    } catch (error) {
      console.error('Login error:', error);
    }
    return false;
  }

  async register(
    name: string,
    surname: string,
    email: string,
    city: string,
    phone: string,
    class_: string,
    password: string
  ): Promise<boolean> {
    const registerUrl = `https://senrevision.com/wp-json/myplugin/v1/register`; // Utilisez cette URL pour l'enregistrement
    const body = {
      name,
      surname,
      email,
      city,
      phone,
      class: class_,
      password,
    };
    try {
      const response: Record<string, unknown> | undefined = await this.httpClient.post<Record<string,unknown>>(registerUrl, body).toPromise();
      return response !== undefined && response['id'] !== undefined;
    } catch (error) {
      console.error('Register error:', error);
      return false;
      }
      }  
      async changeUserPassword(oldPassword: string, newPassword: string): Promise<boolean> {
        const url = 'https://senrevision.com/wp-json/custom/v1/change-password';
        const headers = new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${this.token}`,
        });
    
        const body = new HttpParams()
          .set('old_password', oldPassword)
          .set('new_password', newPassword);
    
        try {
          const response: any = await this.http.post(url, body.toString(), { headers }).toPromise();
          return response['success'];
        } catch (error) {
          console.error('Change password error:', error);
          return false;
        }
      }
          

      async getUserInfo(token: string): Promise<void> {
        const userInfoUrl = `${this.apiUrl}/custom/v1/user-details`;
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
      
        try {
          const response = await this.httpClient.get<any>(userInfoUrl, { headers }).toPromise();
          this.user.name = response.first_name;
          this.user.surname = response.last_name;
          this.user.email = response.email;
          this.user.phone = response.phone; // Assurez-vous d'avoir un champ personnalisé pour le téléphone dans votre installation WordPress
          this.user.class = response.class; // Assurez-vous d'avoir un champ personnalisé pour la classe dans votre installation WordPress
        } catch (error) {
          console.error('Get user info error:', error);
        }
      }
      
           
      
      async updateUserProfile(token: string, userData: any): Promise<boolean> {
        const updateProfileUrl = `${this.apiUrl}/custom/v1/update-profile`;
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
      
        try {
          await this.httpClient.post<any>(updateProfileUrl, userData, { headers }).toPromise();
          return true;
        } catch (error) {
          console.error('Update user profile error:', error);
          return false;
        }
      }
           


  isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    return token !== null && token !== undefined;
  }
}
