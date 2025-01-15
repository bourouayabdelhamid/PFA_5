import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css'],
})
export class OtpComponent implements OnInit, OnDestroy {
  email: string = '';
  otp: string = '';
  timeLeft: number = 30; // 30 secondes pour l'OTP
  private timerSubscription!: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // this.email = this.authService.getUserEmail(); // Récupérer l'email de l'utilisateur
    // console.log('User Email retrieved:', this.email);
    // this.startTimer();
  }

  // startTimer(): void {
  //   this.timerSubscription = interval(1000).subscribe(() => {
  //     if (this.timeLeft > 0) {
  //       this.timeLeft--;
  //     } else {
  //       this.timerSubscription.unsubscribe();
  //       this.toastr.warning('L’OTP a expiré. Veuillez en demander un nouveau.', 'OTP Expiré');
  //     }
  //   });
  // }

  // verifyOtp(): void {
  //   if (this.timeLeft <= 0) {
  //     this.toastr.error('OTP expiré. Veuillez en demander un nouveau.', 'Erreur OTP');
  //     return;
  //   }

  //   this.authService.verifyOtp(this.email, this.otp).subscribe({
  //     next: (response) => {
  //       if (response === 'OTP validé avec succès.') {
  //         this.toastr.success('OTP validé avec succès.', 'Succès');
  //         this.router.navigate(['/id-card-extraction']);
  //       }
  //       else{
  //         this.toastr.error(response, 'Erreur OTP');
  //       }
  //     },
  //     error: (err) => {
  //       this.toastr.error('OTP invalide ou erreur de connexion.', 'Erreur OTP');
  //     },
  //   });
  // }

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
}
