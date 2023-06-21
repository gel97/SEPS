import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from 'src/app/services/apiUrl.service';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class PostalServicesService {
  constructor(private http: HttpClient, private ApiUrl: ApiUrl, private Base:BaseUrl ) {}

  GetPostal(setYear  :any,munCityId :any) :Observable<any[]> {
    return this.http.get<any[]>(this.Base.url + this.ApiUrl.get_com_postal(setYear, munCityId), { responseType: 'json' });
  }

  AddPostal(isp:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_com_postal(), isp, { responseType: 'json' });
  }

  EditPostal(isp:any) {
    return this.http.put<any[]>(this.Base.url + this.ApiUrl.put_com_postal(), isp, { responseType: 'json' });
  }

  DeletePostal(transId:any) {
    return this.http.delete(this.Base.url + this.ApiUrl.delete_com_postal(transId), { responseType: 'text' });
  }

  Report():Observable<any[]> {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_report_com_postal(), { responseType: 'json' });
  }

  Import():Observable<any[]> {
      return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_import_com_postal(), { responseType: 'json' });
  }

}