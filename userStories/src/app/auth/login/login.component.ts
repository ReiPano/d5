import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username = '';
  password = '';
  isLoading: boolean;

  constructor(
    private router: Router,
    private authService: AuthService) { }

  ngOnInit() {
    this.authService.userAuthenticatedObserver.subscribe(response => {
      this.isLoading = false;
    });
  }

  public login() {
    this.isLoading = true;
    this.authService.loginUser(this.username, this.password, false);
  }

  public goToRegister() {
    this.router.navigateByUrl('register');
  }

}
