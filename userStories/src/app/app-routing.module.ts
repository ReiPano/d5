import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { UserPostsComponent } from './user/user-posts/user-posts.component';
import { AuthGuardService } from './auth/auth-guard.service';
import { FormComponent } from './user/user-posts/form/form.component';
import { UserProfileComponent } from './user/user-profile/user-profile.component';


const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'posts', component: UserPostsComponent, canActivate: [AuthGuardService], runGuardsAndResolvers: 'always'},
  {path: 'post-form', component: FormComponent, canActivate: [AuthGuardService], runGuardsAndResolvers: 'always'},
  {path: 'profile', component: UserProfileComponent, canActivate: [AuthGuardService], runGuardsAndResolvers: 'always'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload'
  })],
  providers: [AuthGuardService],
  exports: [RouterModule]
})
export class AppRoutingModule { }
