import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Router, NavigationEnd } from '@angular/router';
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
  loading: boolean;
  currentUrl: any;

  constructor(private authService: AuthService, private router: Router, private deviceService: DeviceDetectorService) {
  }

  ngOnInit(): void {
    this.authService.userAuthenticatedObserver.subscribe(userAuthenticatedResponse => {
      this.isUserAuthenticated = userAuthenticatedResponse;
      userAuthenticatedResponse ?
        this.navigate() :
        this.router.navigateByUrl('login');
      this.loading = false;
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

  private navigate() {
    this.user = this.authService.user;
  }

  public onNavigationStarted() {
    this.loading = true;
  }
}
