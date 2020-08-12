import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared/shared.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  username;
  password;
  reEnteredPassword;
  email;

  @ViewChild('registerForm', {static: false}) registerForm: ElementRef;

  constructor(private router: Router, private sharedService: SharedService, private snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  public goToLogin() {
    this.router.navigateByUrl('login');
  }

  public regiserUser() {
    if (this.passwordMatch(false)) {
      const formData = new FormData(this.registerForm.nativeElement);
      this.sharedService.post('https://localhost:8000/auth/register', formData).subscribe(response => {
        console.log(response);
        if (response.success) {
          this.goToLogin();
        } else {
          this.snackBar.open(response.message, 'Ok', {
            duration: 3300
          });
        }
      });
    } else {
      this.snackBar.open('Passowrds do not match', 'Ok', {
        duration: 3300
      });
    }
  }

  public passwordMatch(isView) {
    return (isView || this.password && this.reEnteredPassword) && this.password === this.reEnteredPassword;
  }

}
