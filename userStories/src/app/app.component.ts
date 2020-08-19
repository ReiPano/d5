import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { SharedService } from './shared/shared.service';
import { MatDrawer } from '@angular/material/sidenav';

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
  isLoading: boolean;
  currentUrl: any;
  opened: any;

  @ViewChild('drawer') drawer: MatDrawer;

  constructor(
    private authService: AuthService,
    private router: Router,
    private deviceService: DeviceDetectorService,
    private sharedService: SharedService) {
  }

  ngOnInit(): void {
    this.authService.userAuthenticatedObserver.subscribe(userAuthenticatedResponse => {
      this.isUserAuthenticated = userAuthenticatedResponse;
      userAuthenticatedResponse ?
        this.navigate() :
        this.router.navigateByUrl('login');
      this.isLoading = false;
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

  public onNavigationStarted(isLoading) {
    this.isLoading = isLoading;
    if (this.isMobile) {
      this.drawer.close();
    }
  }

  setDrawerStatus(drawer) {
    console.log(drawer.opened);
    this.opened = drawer.opened;
    this.sharedService.setDrawerStatus(drawer.opened);
  }
}
