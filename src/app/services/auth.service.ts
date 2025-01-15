import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode'; // Corrigé l'import pour correspondre à `jwt-decode`.
import { Observable } from 'rxjs';




export interface LoginResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;

}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuthenticated: boolean = false; // Indique si l'utilisateur est connecté.
  roles: string[] = []; // Liste des rôles utilisateur.
  email: string | null = null; // Email extrait du token.
  accessToken!: string; // Token JWT stocké.
  private userEmail!: string;

  private baseUrl = 'http://localhost:8080/api/v1/auth'; // URL de base de l'API backend.

  constructor(private http: HttpClient) {}

  public login(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const payload = { email, password };
    return this.http.post(`${this.baseUrl}/authenticate`, payload, { headers });
  }

  public register(firstName: string, lastName: string, email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const payload = { firstName, lastName, email, password };
    return this.http.post(`${this.baseUrl}/register`, payload, { headers });
  }
 // Vérification de l'OTP
  // verifyOtp(email: string, otp: string): Observable<string> {
  //   const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
  //   const body = new URLSearchParams();
  //   body.set('email', email);
  //   body.set('otp', otp);
  //   return this.http.post(`${this.baseUrl}/verify-otp`, body.toString(), {
  //     headers,
  //     responseType: 'text',
  //   });
  // }



  public logout(): void {
    this.isAuthenticated = false;
    this.accessToken = '';
    this.roles = [];
    this.email = null;
    window.localStorage.removeItem('jwt-token'); // Supprimer le token du localStorage.
  }

  public getToken(): string | null {
    return window.localStorage.getItem('jwt-token');
  }

  loadProfile(data: any): void {
    try {
      this.isAuthenticated = true;

      this.accessToken = data['token'];

      if (typeof this.accessToken === 'string' && this.accessToken.trim() !== '') {
        const decodedJwt = jwtDecode<any>(this.accessToken);

        // Vérifiez la structure exacte de votre JWT.
        if (decodedJwt.role) {
          this.roles = Array.isArray(decodedJwt.role) ? decodedJwt.role : [decodedJwt.role];
        } else {
          throw new Error('Aucun rôle trouvé dans le token.');
        }

        this.email = decodedJwt.sub || null;

        // Stocker le token dans le localStorage
        window.localStorage.setItem('jwt-token', this.accessToken);
      } else {
        throw new Error('Le token JWT n\'est pas valide.');
      }
    } catch (error) {
      console.error('Erreur lors du chargement du profil :', error);
      this.isAuthenticated = false;
    }
  }

  public getEmailFromToken(): string | null {
    const token = this.getToken(); // Récupérer le token depuis le localStorage
    console.log('Token récupéré :', token); // Debugging
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token); // Décoder le JWT
        console.log('Token décodé :', decodedToken); // Debugging
        // Retourner la clé correcte (sub pour l'email dans ce cas)
        return decodedToken.sub || 'Utilisateur inconnu';
      } catch (error) {
        console.error('Erreur lors du décodage du token JWT :', error);
        return 'Utilisateur inconnu';
      }
    }
    return 'Utilisateur inconnu';
  }


  // sendOtp(email: string): Observable<string> {
  //   const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
  //   const body = new URLSearchParams();
  //   body.set('email', email);

  //   // Ajouter `responseType: 'text'` pour gérer une réponse en texte brut
  //   return this.http.post(`${this.baseUrl}/send-otp`, body.toString(), {
  //     headers,
  //     responseType: 'text',
  //   });
  // }


   // Sauvegarder l'email utilisateur
   saveUserEmail(email: string): void {
    this.userEmail = email;
    console.log('User email saved globally:', email);
  }

  // Récupérer l'email utilisateur
  getUserEmail(): string {
    if (!this.userEmail) {
      console.warn('User email not found. Make sure the user is logged in.');
      return 'Utilisateur inconnu'; // Valeur par défaut
    }
    return this.userEmail;
  }


}
