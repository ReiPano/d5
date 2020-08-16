import { Component, OnInit, ViewChild, ElementRef, isDevMode } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedService } from 'src/app/shared/shared.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  newPostFormGroup: FormGroup;
  files = [];

  @ViewChild('registerForm') registerForm: ElementRef;
  @ViewChild('attachments') attachments: ElementRef;

  constructor(private sharedService: SharedService, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.newPostFormGroup = new FormGroup({
      title: new FormControl('', Validators.required),
      content: new FormControl('', Validators.required),
      attachments: new FormControl('', Validators.required)
    });
  }

  public onFileDone(selectedFiles) {
    if (selectedFiles) {
      this.files = [];
      for (const selectedFile of selectedFiles) {
        this.files.push(selectedFile);
      }
      this.addOrRemoveFilesToInput();
    }
  }

  public onDeleteFile(deleteFile) {
    console.log(deleteFile);
    const index = this.files.findIndex(o => o === deleteFile);
    if (index !== -1) {
      this.files.splice(index, 1);
    }
    this.addOrRemoveFilesToInput();
  }

  private addOrRemoveFilesToInput() {
    // this.attachmets.nativeElement.files = this.files;
  }

  public addStory() {
    console.log(this.newPostFormGroup);
    const formData = new FormData(this.registerForm.nativeElement);
    for (const file of this.files) {
      formData.append('attachments[]', file, file.fileName);
    }
    formData.append('username', this.authService.username);
    this.sharedService.post('https://localhost:8000/posts/add-post', formData).subscribe(response => {
      if (isDevMode()) { console.log('Added post response: ', response); }
      if (response.success) {
        this.router.navigateByUrl('posts');
      } else {

      }
    });
  }

}
