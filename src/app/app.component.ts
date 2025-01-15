import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import {jwtDecode} from 'jwt-decode'; // Assurez-vous que `jwt-decode` est installé.

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'], // Correction: `styleUrl` -> `styleUrls`
})
export class AppComponent implements OnInit {
  title = 'FirstApp';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.checkTokenExpiration();
  }

  private checkTokenExpiration(): void {
    const token = this.authService.getToken();

    if (token) {
      try {
        const decodedJwt = jwtDecode<any>(token);
        const currentTimeInSeconds = Math.floor(Date.now() / 1000);

        // Vérification de l'expiration du token
        if (decodedJwt.exp && decodedJwt.exp < currentTimeInSeconds) {
          this.authService.logout();
          alert('Votre session a expiré. Veuillez vous reconnecter.');
          window.location.href = '/signin'; // Remplacez par la route de votre page de connexion.
        }
      } catch (error) {
        console.error('Erreur lors de la vérification du token JWT :', error);
        this.authService.logout();
        alert('Token invalide. Veuillez vous reconnecter.');
        window.location.href = '/signin';
      }
    }
  }
}
