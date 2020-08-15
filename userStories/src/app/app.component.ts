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
  user: any;

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit(): void {
    this.authService.userAuthenticatedObserver.subscribe(userAuthenticatedResponse => {
      this.isUserAuthenticated = userAuthenticatedResponse;
      this.isUserAuthenticated ?
        this.navigateToPosts() :
        this.router.navigateByUrl('login');
    });

    if (!!sessionStorage.getItem('username') && !!sessionStorage.getItem('token')) {
      this.authService.isUserAuthenticated(sessionStorage.getItem('username'), sessionStorage.getItem('token'));
    } else if (!!localStorage.getItem('username') && !!localStorage.getItem('token')) {
      this.authService.isUserAuthenticated(localStorage.getItem('username'), localStorage.getItem('token'));
    } else {
      this.router.navigateByUrl('login');
    }
  }

  private navigateToPosts() {
    this.user = this.authService.user;
    this.router.navigateByUrl('posts');
  }
}
