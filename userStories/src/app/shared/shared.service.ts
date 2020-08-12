import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServiceResponse } from '../viewModels/serviceResponse';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private httpClient: HttpClient) { }

  post(url, data) {
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
}
