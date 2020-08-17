import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { MatSelectionList } from '@angular/material/list';

@Component({
  selector: 'app-user-sidenav',
  templateUrl: './user-sidenav.component.html',
  styleUrls: ['./user-sidenav.component.css']
})
export class UserSidenavComponent implements OnInit {
  loggedinUser: any;
  profileImg: any;
  backgroundImg: any;
  currentUrl: string;
  @Input() set user(user) {
    if (user) {
      this.loggedinUser = user;
      this.profileImg = this.sanitization.bypassSecurityTrustStyle(`url(${user.profilePicture})`);
      this.backgroundImg = this.sanitization.bypassSecurityTrustStyle(`url(${user.backgroundImage})`);
    }
  }

  @Output() navigationStarted = new EventEmitter<boolean>();
  @ViewChild('options') optionList: MatSelectionList;

  constructor(
    private sanitization: DomSanitizer,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {

    this.router.events.subscribe(res => {
      if (res instanceof NavigationEnd) {
        console.log(res);
        this.currentUrl = res.url;
      }
    });
  }

  public logOut() {
    this.authService.logoutUser();
    if (this.optionList) {
      this.optionList.deselectAll();
    }
  }

  public addPost() {
    this.router.navigateByUrl('post-form');
    this.navigationStarted.emit(true);
  }

  public goToPosts() {
    this.router.navigateByUrl('posts');
    this.navigationStarted.emit(true);
  }

  public goToProfile() {
    this.router.navigateByUrl('profile');
    this.navigationStarted.emit(true);
  }
}
