import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, isDevMode } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { MatSelectionList } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-user-sidenav',
  templateUrl: './user-sidenav.component.html',
  styleUrls: ['./user-sidenav.component.css']
})
export class UserSidenavComponent implements OnInit {
  loggedinUser: any;
  profileImg: any;
  backgroundImg: any;
  currentUrl: string;
  profilePictureBase64: string | ArrayBuffer;
  backgroundImageBase64: string | ArrayBuffer;
  @Input() set user(user) {
    if (user) {
      this.loggedinUser = user;
      this.profileImg = this.sanitization.bypassSecurityTrustStyle(`url(${user.profilePicture})`);
      this.backgroundImg = this.sanitization.bypassSecurityTrustStyle(`url(${user.backgroundImage})`);
    }
  }

  @Output() navigationStarted = new EventEmitter<boolean>();
  @ViewChild('options') optionList: MatSelectionList;
  @ViewChild('profilePicture') profilePicture: ElementRef;
  @ViewChild('backgroundImage') backgroundImage: ElementRef;

  constructor(
    private sanitization: DomSanitizer,
    private authService: AuthService,
    private router: Router,
    private sharedService: SharedService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {

    this.router.events.subscribe(res => {
      if (res instanceof NavigationEnd) {
        console.log(res);
        this.currentUrl = res.url;
      }
    });
  }

  public logOut() {
    const formData = new FormData();
    formData.append('username', this.loggedinUser?.username);
    this.sharedService.post(this.sharedService.url + '/auth/logout', formData).subscribe(response => {
      if (isDevMode()) { console.log('Logout response', response); }
      if (response.success) {
        this.authService.logoutUser();
        if (this.optionList) {
          this.optionList.deselectAll();
        }
        this.navigationStarted.emit(false);
        this.loggedinUser = null;
      }
      else {
        this.snackBar.open(response.message, 'Ok', {
          duration: 2000
        });
      }
    });
  }

  public goToAddPost() {
    this.router.navigateByUrl('post-form');
    this.navigationStarted.emit(true);
  }

  public goToPosts() {
    this.router.navigateByUrl('posts');
    this.navigationStarted.emit(true);
  }

  public goToProfile() {
    this.router.navigateByUrl('profile');
    this.navigationStarted.emit(true);
  }

  public openProfilePictureInput() {
    this.profilePicture.nativeElement.click();
  }

  public openBackgroundImageInput() {
    this.backgroundImage.nativeElement.click();
  }

  getBase64(file, type) {
    if (this.isImage(file)) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      // return reader.result;
      reader.onload = () => {
          type === 1 ?
            this.loggedinUser.profilePicture = reader.result :
            this.loggedinUser.backgroundImage = reader.result;
          const formData = new FormData();
          formData.append('username', this.loggedinUser.username);
          formData.append('profilePicture', this.loggedinUser.profilePicture);
          formData.append('backgroundImage', this.loggedinUser.backgroundImage);
          this.authService.updateUser(formData);
      };
      reader.onerror = (error) => {
      };
    } else {
      this.snackBar.open('The selected file was not an image.', 'Ok', {
        duration: 2000
      });
    }
  }

  isImage(file) {
    return ['image/gif', 'image/jpeg', 'image/png'].includes(file.type);
  }
}
