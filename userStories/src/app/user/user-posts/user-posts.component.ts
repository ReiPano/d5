import { Component, OnInit, isDevMode, ViewChild } from '@angular/core';
import { UserPostService } from './user-post.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDrawer } from '@angular/material/sidenav';
import { SharedService } from 'src/app/shared/shared.service';
import { MatTabGroup } from '@angular/material/tabs';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-user-posts',
  templateUrl: './user-posts.component.html',
  styleUrls: ['./user-posts.component.css']
})
export class UserPostsComponent implements OnInit {
  userPosts: any[] = [];
  areUserPostsLoading: boolean;

  allPosts: any[] = [];
  areAllPostsLoading: boolean;
  contentWidth: number;
  drawerStatus = true;
  @ViewChild('matTabGroup') matTabGroup: MatTabGroup;
  isMobile: any;
  username: string;

  constructor(
    private userPostService: UserPostService,
    private snackBar: MatSnackBar,
    private sharedService: SharedService,
    private authService: AuthService,
    private deviceService: DeviceDetectorService) { }

  ngOnInit() {
    this.getUserPosts();
    this.getAllPosts();

    this.sharedService.drawerStatus.subscribe(status => {
      this.drawerStatus = status && !this.isMobile;
      this.matTabGroup.realignInkBar();
    });

    this.username = this.authService.username;
    this.isMobile = this.deviceService.isMobile();
    if (this.isMobile) {
      this.drawerStatus = false;
    }
  }

  private getUserPosts() {
    this.areUserPostsLoading = true;
    this.userPostService.getUserPosts().subscribe(response => {
      if (isDevMode()) { console.log('getUserPosts', response); }
      if (response.success) {
        for (const post of response.result) {
          this.userPosts.push(JSON.parse(post));
        }
      } else {
        this.snackBar.open(response.message, 'Ok', {
          duration: 2000
        });
      }
      this.areUserPostsLoading = false;
    });
  }

  private getAllPosts() {
    this.areAllPostsLoading = true;
    this.userPostService.getAllPosts().subscribe(response => {
      if (isDevMode()) { console.log('getAllPosts', response); }
      if (response.success) {
        for (const post of response.result) {
          this.allPosts.push(JSON.parse(post));
        }
      } else {
        this.snackBar.open(response.message, 'Ok', {
          duration: 2000
        });
      }
      this.areAllPostsLoading = false;
    });
  }

  public onDeleted(id) {
    const index = this.userPosts.findIndex(o => o.id === id);
    if (index !== -1) {
      this.userPosts.splice(index, 1);
    }
  }
}
