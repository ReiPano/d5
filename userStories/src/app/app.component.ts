import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'userStories';
  isUserAuthenticated = false;
  user: any;
  isMobile: boolean;
  isTablet: boolean;
  isDesktopDevice: boolean;

  constructor(private authService: AuthService, private router: Router, private deviceService: DeviceDetectorService) {
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


    this.isMobile = this.deviceService.isMobile();
    this.isTablet = this.deviceService.isTablet();
    this.isDesktopDevice = this.deviceService.isDesktop();
  }

  private navigateToPosts() {
    this.user = this.authService.user;
    this.router.navigateByUrl('posts');
  }
}
