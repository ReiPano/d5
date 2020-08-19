import { Injectable } from '@angular/core';
import { SharedService } from 'src/app/shared/shared.service';
import { AuthService } from 'src/app/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserPostService {

  constructor(private sharedService: SharedService, private authService: AuthService) { }

  public getUserPosts() {
    let url = 'http://192.168.100.12:8000/posts/get-stories-for-user';
    url += `?username=${this.authService.username}`;
    url += `&token=${this.authService.token}`;
    return this.sharedService.get(url);
  }

  public getAllPosts() {
    let url = 'http://192.168.100.12:8000/posts/get-other-stories';
    url += `?username=${this.authService.username}`;
    url += `&token=${this.authService.token}`;
    return this.sharedService.get(url);
  }

  public deletePost(data) {
    return this.sharedService.post('http://192.168.100.12:8000/posts/delete-story', data);
  }

}
