import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { IdCardExtractionComponent } from './id-card-extraction/id-card-extraction.component';
import { OtpComponent } from './otp/otp.component';


const routes: Routes = [
  {path: "", redirectTo: "signin", pathMatch : 'full'},
  {
    path : "signin", component: SigninComponent

  },
  {
    path : "signup", component: SignupComponent

  },
  { path: 'id-card-extraction', component: IdCardExtractionComponent },
  { path: 'otp', component: OtpComponent },
  //{path: "", redirectTo: "signin", pathMatch : 'full'}
 /* {
    path : "admin", component: AdminComponent, children:[
        {
    path : "signin", component: SigninComponent

  },
  {
    path : "signup", component: SignupComponent

  }
    ]

  }*/
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
