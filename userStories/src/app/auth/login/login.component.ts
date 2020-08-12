import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared/shared.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username = '';
  password = '';

  constructor(private sharedService: SharedService, private snackBar: MatSnackBar, private router: Router) { }

  ngOnInit() {
  }

  public login() {
    const formData = new FormData();
    formData.append('username', this.username);
    formData.append('password', this.password);
    this.sharedService.post('https://localhost:8000/auth/login', formData).subscribe(response => {
      console.log(response);
      if (response.success) {

      } else {
        this.snackBar.open(response.message, 'Ok', {
          duration: 3300
        });
      }
    });
  }

  public goToRegister() {
    this.router.navigateByUrl('register');
  }

}
