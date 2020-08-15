import { Component, OnInit, Input, Inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-post-full',
  templateUrl: './post-full.component.html',
  styleUrls: ['./post-full.component.css']
})
export class PostFullComponent implements OnInit {

  post;
  profileIcon;
  constructor(private sanitization: DomSanitizer, @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit() {
    this.post = this.data.post;
    this.profileIcon = this.sanitization.bypassSecurityTrustStyle(`url(${this.post.user.profilePicture})`);
  }

}
