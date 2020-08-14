import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared/shared.service';
import { MatSnackBar } from '@angular/material/snack-bar';
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

  constructor(
    private sharedService: SharedService,
    private snackBar: MatSnackBar,
    private router: Router,
    private authService: AuthService) { }

  ngOnInit() {
  }

  public login() {
    this.authService.loginUser(this.username, this.password, false);
  }

  public goToRegister() {
    this.router.navigateByUrl('register');
  }

}
