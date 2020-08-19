import { Component, OnInit, Input, isDevMode, Output, EventEmitter, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { PostFullComponent } from './post-full/post-full.component';
import { positionService } from '@ng-bootstrap/ng-bootstrap/util/positioning';
import { UserPostService } from '../user-post.service';
import { AuthService } from 'src/app/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  @Input() post;
  @Input() allowDelete: boolean;

  @Output() deleted: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('deleteModal') deleteModalTemplate: TemplateRef<any>;

  profileIcon: any;
  constructor(
    private sanitization: DomSanitizer,
    public dialog: MatDialog,
    private postService: UserPostService,
    private authService: AuthService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.profileIcon = this.sanitization.bypassSecurityTrustStyle(`url(${this.post.user.profilePicture})`);
  }

  public getContent() {
    return this.post.content.length > 100 ?
      this.post.content.substring(0, 100) + '...' :
      this.post.content;
  }

  public deletePost() {
    const formData = new FormData();
    formData.append('username', this.authService.username);
    formData.append('token', this.authService.token);
    formData.append('storyId', this.post.id);
    this.postService.deletePost(formData).subscribe(response => {
      if (isDevMode()) { console.log('Delete post: ', response); }
      if (response.success) {
        this.deleted.next(this.post.id);
      } else {
        this.snackBar.open('Post could not be deleted.', 'Ok', {
          duration: 2000
        });
      }
    });
  }

  public openDeleteDialog() {
    const deleteDialog = this.dialog.open(this.deleteModalTemplate);
    deleteDialog.afterClosed().subscribe(res => {
      if (res) {
        this.deletePost();
      }
    });
  }

  public openFullPost(post) {
    const dialogRef = this.dialog.open(
      PostFullComponent,
      {
        minWidth: '85%',
        data: {
          post
        }
      }
    );
  }

}
