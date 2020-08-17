import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { PostFullComponent } from './post-full/post-full.component';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  @Input() post;
  profileIcon: any;
  constructor(private sanitization: DomSanitizer, public dialog: MatDialog) { }

  ngOnInit() {
    this.profileIcon = this.sanitization.bypassSecurityTrustStyle(`url(${this.post.user.profilePicture})`);
  }

  public getContent() {
    return this.post.content.length > 100 ?
      this.post.content.substring(0, 100) + '...' :
      this.post.content;
  }

  private prepareAttachments () {

  }

  public openFullPost(post) {
    const dialogRef = this.dialog.open(
      PostFullComponent,
      {
        // height: '90%',
        minWidth: '85%',
        data: {
          post
        }
      }
    );
  }

}
