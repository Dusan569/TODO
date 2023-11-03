import { Component } from '@angular/core';
import { AuthResponseData, AuthService } from './auth.service';
import { Router } from '@angular/router';
import {FormControl, Validators, FormsModule, ReactiveFormsModule, FormGroup} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MainService } from '../main/main.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  loginMode: boolean = true;
  error: string | null = null;
  loading: boolean = false;

  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  passwordFormControl = new FormControl('', Validators.required);

  loginForm = new FormGroup({
    'email': this.emailFormControl,
    'password': this.passwordFormControl
  });

  constructor(private authService: AuthService, private router: Router, private mainService: MainService){}

  onSubmit(){
    if(!this.loginForm.valid){
      return;
    }

    this.loading = true;

    let auth: Observable<AuthResponseData>;

    if(this.loginMode){
      auth = this.authService.login(this.loginForm.value.email, this.loginForm.value.password);
      
    }else{
      auth = this.authService.signUp(this.loginForm.value.email, this.loginForm.value.password);
    }

    auth.subscribe(repsonse => {
      this.loading = false;
      this.mainService.clearData();
    }, errorMessage => {
      this.loading = false;
      this.error = errorMessage;
    })
  }

  switchMode(){
    this.loginMode = !this.loginMode;
  }
  //This is a test for git!!!!

}
