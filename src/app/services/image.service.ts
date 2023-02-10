import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseUrl } from './baseUrl.service';

@Injectable({
    providedIn: 'root'
  })
export class ImagesService {
  api: any;

  constructor(private http: HttpClient, private baseUrl:BaseUrl ) {
    this.api = this.baseUrl.apiurl;
  }

  public GetLogo(munCityId:any){
    return this.http.get(this.api + "Image/GetMunLogo/" + munCityId, {responseType: 'blob'});
  }
  public UploadLogo(inpudata:any){
    return this.http.post(this.api + "Image/UploadMunLogo", inpudata, {
      reportProgress:true,
      observe:'events'
    });
  }
  public GetImage(munCityId:any){
    return this.http.get(this.api + "Image/GetImage/" + munCityId, {responseType: 'blob'});
  }
  public UploadImage(inpudata:any){
    return this.http.post(this.api + "Image/UploadImage", inpudata, {
      reportProgress:true,
      observe:'events'
    });
  }
}