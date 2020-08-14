import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'userStories';
  isUserAuthenticated = false;

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit(): void {
    this.authService.userAuthenticatedObserver.subscribe(userAuthenticatedResponse => {
      this.isUserAuthenticated = userAuthenticatedResponse;
      this.isUserAuthenticated ?
        this.router.navigateByUrl('posts') :
        this.router.navigateByUrl('login');
    });

    if (!!sessionStorage.getItem('username') && !!sessionStorage.getItem('token')) {
      this.authService.authentivateUser(sessionStorage.getItem('username'), sessionStorage.getItem('token'));
    } else if (!!localStorage.getItem('username') && !!localStorage.getItem('token')) {
      this.authService.authentivateUser(localStorage.getItem('username'), localStorage.getItem('token'));
    } else {
      this.router.navigateByUrl('login');
    }
  }
}
