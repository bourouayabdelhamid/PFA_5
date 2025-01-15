import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';  // Importer ToastrService

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  path: string = "assets/images/signin.jpg";
  alttext: string = "first image";
  formSignUp!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService  // Injecter ToastrService
  ) {}

  ngOnInit(): void {
    this.formSignUp = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, {
      validator: this.passwordMatcher // Ajouter la validation des mots de passe
    });
  }

  get formControls() {
    return this.formSignUp.controls;
  }

  // Validator pour vérifier si le mot de passe et le mot de passe de confirmation correspondent
  passwordMatcher(formGroup: FormGroup): { [key: string]: boolean } | null {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { 'passwordMismatch': true };
    }
    return null;
  }

  handleSignup(): void {
    // Vérifier si le formulaire est valide
    if (this.formSignUp.invalid) {
      this.toastr.error('Veuillez remplir correctement le formulaire.', 'Erreur');
      return;
    }

    // Récupérer les valeurs du formulaire
    const { firstName, lastName, email, password } = this.formSignUp.value;

    // Appeler la méthode register du service AuthService
    this.authService.register(firstName, lastName, email, password).subscribe({
      next: (response) => {
        console.log('Utilisateur inscrit avec succès :', response);
        this.toastr.success('Inscription réussie !', 'Succès');
        this.router.navigate(['/signin']);  // Rediriger après une inscription réussie
      },
      error: (err) => {
        console.error('Échec de l\'inscription :', err);
        if (err.status === 409 && err.error?.message) {
          alert("Error toast")
          this.toastr.error(err.error.message, 'Erreur');
        } else {
          this.toastr.error('Échec de l\'inscription. Veuillez réessayer.', 'Erreur');
        }
      }
    });
  }
}
