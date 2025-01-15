import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AppHttpInterceptor} from './interceptors/app-http.interceptor';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IdCardExtractionComponent } from './id-card-extraction/id-card-extraction.component';
import { IdCardService } from './services/id-card.service';
import { AuthService } from './services/auth.service';
import { OtpComponent } from './otp/otp.component';


@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    SignupComponent,
    IdCardExtractionComponent,
    OtpComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 3000,  // Durée d'affichage du toast (en ms)
      positionClass: 'toast-top-right',  // Position des toasts
      preventDuplicates: true,  // Empêcher les toasts en double
    }),



  ],
  providers: [
    IdCardService,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppHttpInterceptor,
      multi: true, // Permet d'utiliser plusieurs intercepteurs si nécessaire.
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
