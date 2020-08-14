import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SharedService } from '../shared/shared.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userAuthenticatedObserver = new Subject<boolean>();
  username: string;
  token: string;
  constructor(private sharedService: SharedService, private snackBar: MatSnackBar) { }

  loginUser(username: string, password: string, rememberMe: boolean) {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    this.sharedService.post('https://localhost:8000/auth/login', formData).subscribe(response => {
      console.log(response);
      if (response.success) {
        if (rememberMe) {
          localStorage.setItem('username', username);
          localStorage.setItem('token', response.result);
        } else {
          sessionStorage.setItem('username', username);
          sessionStorage.setItem('token', response.result);
        }
        this.username = username;
        this.token = response.result;
        this.userAuthenticatedObserver.next(true);
      } else {
        this.snackBar.open(response.message, 'Ok', {
          duration: 3300
        });
      }
    });
  }

  authentivateUser(username: string, token: string) {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('token', token);
    this.sharedService.post('https://localhost:8000/auth/token-authentication', formData).subscribe(response => {
      console.log(response);
      if (response.success) {
        this.username = username;
        this.token = token;
        this.userAuthenticatedObserver.next(true);
      } else {
        this.logoutUser();
      }
    });
  }

  logoutUser() {
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    this.username = null;
    this.token = null;
    this.userAuthenticatedObserver.next(false);
  }
}
