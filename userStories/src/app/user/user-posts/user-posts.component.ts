import { Component, OnInit, isDevMode } from '@angular/core';
import { UserPostService } from './user-post.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-posts',
  templateUrl: './user-posts.component.html',
  styleUrls: ['./user-posts.component.css']
})
export class UserPostsComponent implements OnInit {
  userPosts: any[] = [];
  areUserPostsLoading: boolean;

  friendPosts: any[] = [];
  areFriendPostsLoading: boolean;
  contentWidth: number;

  constructor(private userPostService: UserPostService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getUserPosts();
  }

  private getUserPosts() {
    this.areUserPostsLoading = true;
    this.userPostService.getUserPosts().subscribe(response => {
      if (isDevMode()) { console.log('getUserPosts', response); }
      if (response.success) {
        this.userPosts = response.result;
      } else {
        this.snackBar.open(response.message, 'Ok', {
          duration: 2000
        });
      }
      this.areUserPostsLoading = false;
    });
  }

}
