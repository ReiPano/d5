import { Component, OnInit, ViewChild, ElementRef, isDevMode } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared/shared.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerFormGroup: FormGroup;

  @ViewChild('registerForm') registerForm: ElementRef;
  isLoading: boolean;

  constructor(private router: Router, private sharedService: SharedService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.registerFormGroup = new FormGroup(
      {
        username: new FormControl('', Validators.required),
        password: new FormControl('', [Validators.required, Validators.minLength(6)]),
        reEnteredPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
        email: new FormControl('', [Validators.required, Validators.email]),
      }
    );

    this.registerFormGroup.get('password').setValidators(
      [Validators.required, Validators.minLength(6), this.passwordMatchValidation(true)]
    );

    this.registerFormGroup.get('reEnteredPassword').setValidators(
      [Validators.required, Validators.minLength(6), this.passwordMatchValidation(true)]
    );
  }

  public goToLogin() {
    this.router.navigateByUrl('login');
  }

  public regiserUser() {
    if (this.checkPasswordMatch(false)) {
      this.isLoading = true;
      const formData = new FormData(this.registerForm.nativeElement);
      this.sharedService.post(this.sharedService.url + '/auth/register', formData).subscribe(response => {
        this.isLoading = false;
        if (isDevMode()) { console.log('regiserUser', response); }
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

  public validateForm() {
    this.registerFormGroup.get('password').updateValueAndValidity();
    this.registerFormGroup.get('reEnteredPassword').updateValueAndValidity();
  }

  public passwordMatchValidation(isView) {
    // return true;
    return (control: AbstractControl): ValidationErrors | null => {
      const passowrdMatch = this.checkPasswordMatch(isView);
      return !passowrdMatch ? {passwordNotMatch: !passowrdMatch} : null;
    };
  }

  private checkPasswordMatch(isView) {
    const passwordControl = this.registerFormGroup.get('password');
    const reEnterPasswordControl = this.registerFormGroup.get('reEnteredPassword');
    if (!passwordControl.touched || !reEnterPasswordControl.touched) {
      return true;
    }
    return (isView || (passwordControl && reEnterPasswordControl)) &&
     passwordControl.value === reEnterPasswordControl.value;
  }
}
