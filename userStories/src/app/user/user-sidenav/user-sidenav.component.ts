import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-user-sidenav',
  templateUrl: './user-sidenav.component.html',
  styleUrls: ['./user-sidenav.component.css']
})
export class UserSidenavComponent implements OnInit {
  loggedinUser: any;
  profileImg: any;
  backgroundImg: any;
  @Input() set user(user) {
    if (user) {
      this.loggedinUser = user;
      this.profileImg = this.sanitization.bypassSecurityTrustStyle(`url(${user.profilePicture})`);
      this.backgroundImg = this.sanitization.bypassSecurityTrustStyle(`url(${user.backgroundImage})`);
    }
  }
  constructor(private sanitization: DomSanitizer) { }

  ngOnInit() {
  }

}
