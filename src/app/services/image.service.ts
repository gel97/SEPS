import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseUrl } from './baseUrl.service';
import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { ApiUrl } from './apiUrl.service';

@Injectable({
    providedIn: 'root'
  })
export class ImagesService {
  api: any;

  constructor(private http: HttpClient, private ApiUrl: ApiUrl, private Base:BaseUrl ) {
    this.api = this.Base.url;
  }

  public GetLogo(munCityId:any){
    return this.http.get(this.api + this.ApiUrl.get_muncity_logo(munCityId), {responseType: 'blob'});
  }

  public UploadLogo(inpudata:any){
    return this.http.post(this.api + this.ApiUrl.post_upload_muncity_logo(), inpudata, {
      reportProgress:true,
      observe:'events'
    });
  }

  public GetImage(munCityId:any){
    return this.http.get(this.api + this.ApiUrl.get_image_banner(munCityId) , {responseType: 'blob'}).pipe(retry(1), catchError(this.handleError));
  }

  public UploadImage(inpudata:any){
    return this.http.post(this.api + this.ApiUrl.post_upload_image_banner(), inpudata, {
      reportProgress:true,
      observe:'events'
    });
  }

  handleError(error:any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(() => {
        return errorMessage;
    });
  }
}