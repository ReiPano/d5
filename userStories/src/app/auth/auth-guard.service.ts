import { Injectable, isDevMode } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(public auth: AuthService, public router: Router) {}
  canActivate(): boolean | Observable<boolean> {
    const formData = new FormData();
    if (!!sessionStorage.getItem('username') && !!sessionStorage.getItem('token')) {
      formData.append('username', sessionStorage.getItem('username'));
      formData.append('token', sessionStorage.getItem('token'));
    } else if (!!localStorage.getItem('username') && !!localStorage.getItem('token')) {
      formData.append('username', localStorage.getItem('username'));
      formData.append('token', localStorage.getItem('token'));
    } else {
      return false;
    }
    return new Observable<boolean>((observer) => {
        this.auth.authenticateUser(formData).subscribe(response => {
            if (isDevMode()) { console.log('Authorization', response); }
            if (response.success) {
                observer.next(true);
            } else {
                this.router.navigateByUrl('login');
                observer.next(false);
            }
        });
    });
  }
}
