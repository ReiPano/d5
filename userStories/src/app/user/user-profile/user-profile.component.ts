import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import * as moment from 'moment';
import { Moment } from 'moment';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  providers: [{
    provide: DateAdapter,
    useClass: MomentDateAdapter,
    deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
  },
  {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},]
})
export class UserProfileComponent implements OnInit, AfterViewInit {

  public user;
  public userCopy;

  displayedColumns: string[] = ['ID', 'Ideja', 'Perfundimtare', 'Actions'];
  pageSizeOptions: number[] = [5, 10, 25, 100];
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  data: any[] = [];
  fieldBeingEditted = 0;
  isUserDataSaving: boolean;

  @ViewChild('profilePicture') profilePicture: ElementRef;
  @ViewChild('backgroundImage') backgroundImage: ElementRef;

  constructor(
    private router: Router,
    private _adapter: DateAdapter<any>,
    private authService: AuthService) { }

  ngOnInit(): void {
    this._adapter.setLocale('en-BG');
    this.user = this.authService.user;
  }

  ngAfterViewInit() {
    // If the user changes the sort order, reset back to the first page.
    // this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
  }

  public openIdea(id: string, view = false) {
    try {
      const existingToken: any = JSON.parse(sessionStorage.getItem('token'));
      const idea = this.data.find(o => o.ID === id);
      if (!!existingToken && !!idea) {
        existingToken.tokenData = idea;
        sessionStorage.setItem('token', JSON.stringify(existingToken));
        view ? this.router.navigate(['pyetesori-view']) : this.router.navigate(['pyetesori']);
      }
    } catch (e) {
      console.log(e);
    }
  }

  public editData(index: number) {
    this.fieldBeingEditted = index;
    this.isUserDataSaving = false;
  }

  public getDateAsString(providedDate: Moment) {
    const date = providedDate.date();
    const month = providedDate.month() + 1;
    const year = providedDate.year();
    return date + '/' + month + '/' + year;
  }

  public getDateFromString(dateAsString: string) {
    const values = dateAsString.split('/');
    if (values && values.length === 3) {
      return new Date(Number.parseInt(values[2], 10), Number.parseInt(values[1], 10), Number.parseInt(values[0], 10));
    }
    return new Date();
  }

  public saveData(columnName: string) {
    this.isUserDataSaving = true;
    const existingToken: any = JSON.parse(sessionStorage.getItem('token'));
    let valueToBeSaved = this.user[columnName];

    if (columnName === 'Datlindja') {
      valueToBeSaved = this.getDateAsString(this.user[columnName]);
    }

    if (existingToken) {
      // this.dataService.updateUserData(
      //   existingToken.tokenUserID, columnName, this.user[columnName]
      // ).subscribe((response: string) => {
      //   if (response.indexOf('OK') !== -1) {
      //     this.userCopy = this.user;
      //   }
      //   this.fieldBeingEditted = 0;
      //   this.isUserDataSaving = false;
      // });
    }
  }

  public openProfilePictureInput() {
    this.profilePicture.nativeElement.click();
  }

  public openBackgroundImageInput() {
    this.backgroundImage.nativeElement.click();
  }

}
