import { Component, OnInit, ViewChild, ElementRef, isDevMode } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared/shared.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerFormGroup: FormGroup;

  @ViewChild('registerForm') registerForm: ElementRef;
  @ViewChild('profilePicture') profilePicture: ElementRef;
  @ViewChild('backgroundImage') backgroundImage: ElementRef;
  profilePictureBase64: string | ArrayBuffer;
  backgroundImageBase64: string | ArrayBuffer;

  constructor(private router: Router, private sharedService: SharedService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.registerFormGroup = new FormGroup(
      {
        username: new FormControl('', Validators.required),
        password: new FormControl('', [Validators.required, Validators.minLength(6)]),
        reEnteredPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
        email: new FormControl('', [Validators.required, Validators.email]),
        profilePicture: new FormControl('', [Validators.required]),
        backgroundImage: new FormControl('', [Validators.required]),
      }
    );

    // tslint:disable-next-line: max-line-length
    this.registerFormGroup.get('password').setValidators([Validators.required, Validators.minLength(6), this.passwordMatchValidation(true)]);
    // tslint:disable-next-line: max-line-length
    this.registerFormGroup.get('reEnteredPassword').setValidators([Validators.required, Validators.minLength(6), this.passwordMatchValidation(true)]);
  }

  public goToLogin() {
    this.router.navigateByUrl('login');
  }

  public regiserUser() {
    if (this.checkPasswordMatch(false)) {
      const formData = new FormData(this.registerForm.nativeElement);
      formData.append('profilePicture', JSON.stringify(this.profilePictureBase64));
      formData.append('backgroundImage', JSON.stringify(this.backgroundImageBase64));
      this.sharedService.post('https://localhost:8000/auth/register', formData).subscribe(response => {
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


  openProfilePictureInput() {
    this.profilePicture.nativeElement.click();
  }

  openBackgroundImageInput() {
    this.backgroundImage.nativeElement.click();
  }

  setProfilePictureName(event) {
    this.registerFormGroup.get('profilePicture').setValue(event?.target?.files[0]?.name);
    this.getBase64(event?.target?.files[0], 1);
  }

  setBackgroundImageName(event) {
    this.registerFormGroup.get('backgroundImage').setValue(event?.target?.files[0]?.name);
    this.getBase64(event?.target?.files[0], 2);
  }

  getBase64(file, type) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    // return reader.result;
    reader.onload = () => {
        type === 1 ?
          this.profilePictureBase64 = reader.result :
          this.backgroundImageBase64 = reader.result;
    };
    reader.onerror = (error) => {
    };
}

}
