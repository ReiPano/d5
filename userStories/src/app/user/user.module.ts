import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserSidenavComponent } from './user-sidenav/user-sidenav.component';
import { UserPostsComponent } from './user-posts/user-posts.component';
import { FormComponent } from './user-posts/form/form.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import {MatTabsModule} from '@angular/material/tabs';
import { SharedModule } from '../shared/shared.module';
import { PostComponent } from './user-posts/post/post.component';
import { PostFullComponent } from './user-posts/post-full/post-full.component';
import { UserPostService } from './user-posts/user-post.service';
import { SharedService } from '../shared/shared.service';
import {MatListModule} from '@angular/material/list';


@NgModule({
  declarations: [UserSidenavComponent, UserPostsComponent, FormComponent, UserProfileComponent, PostComponent, PostFullComponent],
  imports: [
    CommonModule,
    MatTabsModule,
    SharedModule,
    MatListModule
  ],
  providers: [UserPostService, SharedService],
  exports: [UserSidenavComponent, UserPostsComponent, FormComponent, UserProfileComponent]
})
export class UserModule { }
