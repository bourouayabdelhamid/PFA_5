import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginResponse } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr'; // Toast library for notifications

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent implements OnInit {
  formLogin!: FormGroup;
  path: string = 'assets/images/signin.jpg';
  alttext: string = 'Sign In Image';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Initialize the login form with validation
    this.formLogin = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  /**
   * Handles the login action
   */
  handleLogin(): void {
    if (this.formLogin.valid) {
      const email = this.formLogin.value.email;
      const password = this.formLogin.value.password;

      this.authService.login(email, password).subscribe({
        next: (data: LoginResponse) => {
          // Charger le profil utilisateur
          this.authService.loadProfile(data);

          // Sauvegarder l'email globalement
          this.authService.saveUserEmail(email);

          // Afficher un message de succès
          this.toastr.success('Login successful!', 'Success');

          // Appeler sendOtp après le login
          this.sendOtp(email);
        },
        error: (error) => {
          console.error(error);
          this.toastr.error('Invalid email or password.', 'Login Failed');
        },
      });
    } else {
      this.toastr.error('Please correct the errors in the form.', 'Validation Error');
    }
  }



  private sendOtp(email: string): void {
    this.authService.sendOtp(email).subscribe({
      next: (response) => {
        console.log('OTP sent successfully:', response);
        this.toastr.info('OTP has been sent to your email.', 'OTP Sent');
        this.router.navigate(['/otp']);
      },
      error: (err) => {
        console.error('Error sending OTP:', err);
        this.toastr.error('Failed to send OTP. Please try again.', 'OTP Error');
      },
    });
  }
}
