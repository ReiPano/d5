import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserSidenavComponent } from './user-sidenav/user-sidenav.component';
import { UserPostsComponent } from './user-posts/user-posts.component';
import { FormComponent } from './user-posts/form/form.component';
import { UserProfileComponent } from './user-profile/user-profile.component';


@NgModule({
  declarations: [UserSidenavComponent, UserPostsComponent, FormComponent, UserProfileComponent],
  imports: [
    CommonModule
  ],
  exports: [UserSidenavComponent, UserPostsComponent, FormComponent, UserProfileComponent]
})
export class UserModule { }
