import { Injectable } from '@angular/core';
import { SharedService } from 'src/app/shared/shared.service';
import { AuthService } from 'src/app/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserPostService {

  constructor(private sharedService: SharedService, private authService: AuthService) { }

  public getUserPosts() {
    let url = 'https://localhost:8000/posts/get-posts-for-user';
    url += `?username=${this.authService.username}`;
    url += `&token=${this.authService.token}`;
    return this.sharedService.get(url);
  }

}
