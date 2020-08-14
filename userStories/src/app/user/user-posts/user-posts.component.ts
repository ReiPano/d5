import { Component, OnInit } from '@angular/core';
import { UserPostService } from './user-post.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-posts',
  templateUrl: './user-posts.component.html',
  styleUrls: ['./user-posts.component.css']
})
export class UserPostsComponent implements OnInit {
  userPosts: any[] = [];

  constructor(private userPostService: UserPostService, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.authService.userAuthenticatedObserver.subscribe(response => {
      response ? this.getUserPosts() : this.router.navigateByUrl('login');
    });
  }

  private getUserPosts() {
    this.userPostService.getUserPosts().subscribe(response => {
      if (response.success) {
        this.userPosts = response.result;
      } else {

      }
    });
  }

}
