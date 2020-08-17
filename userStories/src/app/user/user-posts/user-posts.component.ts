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

  allPosts: any[] = [];
  areAllPostsLoading: boolean;
  contentWidth: number;

  constructor(private userPostService: UserPostService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getUserPosts();
    this.getAllPosts();
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

}
