import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServiceResponse } from '../viewModels/serviceResponse';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  drawerStatus: Subject<boolean> = new Subject<boolean>();

  constructor(private httpClient: HttpClient) { }

  public post(url, data) {
    return this.httpClient.post(url, data).pipe(
      map(response => {
          const serviceResponse: ServiceResponse = ServiceResponse.InitResponse();
          try {
              Object.assign(serviceResponse, response);
          } catch (error) {
              serviceResponse.message = error;
          }
          return serviceResponse;
      })
    );
  }

  public patch(url, data) {
    return this.httpClient.patch(url, data).pipe(
      map(response => {
          const serviceResponse: ServiceResponse = ServiceResponse.InitResponse();
          try {
              Object.assign(serviceResponse, response);
          } catch (error) {
              serviceResponse.message = error;
          }
          return serviceResponse;
      })
    );
  }

  public get(url) {
    return this.httpClient.get(url).pipe(
      map(response => {
          const serviceResponse: ServiceResponse = ServiceResponse.InitResponse();
          try {
              Object.assign(serviceResponse, response);
          } catch (error) {
              serviceResponse.message = error;
          }
          return serviceResponse;
      })
    );
  }

  public setDrawerStatus(status) {
    this.drawerStatus.next(status);
  }
}
