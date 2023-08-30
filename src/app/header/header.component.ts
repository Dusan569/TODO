import { Component } from '@angular/core';
import { Data, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { MainService } from '../main/main.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  private user!: Subscription;
  isAuthenticated: boolean = false;

  constructor(private router: Router, private authService: AuthService,  private mainService: MainService) {}

  ngOnInit(){
    this.user = this.authService.user.subscribe(user => {
      this.isAuthenticated = user ? true : false;
    });
  }

  logOut() {
    this.authService.logOut();
    this.mainService.clearData();
  }
}