import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { DataService } from './shared/loading-spinner/save-data/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private authService: AuthService, private dataService: DataService){}

  

  ngOnInit(){
    this.authService.autoLogin();
    this.dataService.fetchList().subscribe();
  }


}
