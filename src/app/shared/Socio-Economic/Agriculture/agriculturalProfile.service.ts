import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from 'src/app/services/apiUrl.service';
@Injectable({
    providedIn: 'root'
  })

export class AgricultureProfileService {

  constructor(private http: HttpClient, private ApiUrl: ApiUrl, private Base:BaseUrl ) {
  }

  AddAgricultureProfile(agricultureprofile:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_agriculture_profile(), agricultureprofile, { responseType: 'json' });
  }

  GetListAgricultureProfile(setYear  :any,munCityId :any) {
    return this.http.get<any[]>(this.Base.url + this.ApiUrl.get_list_agriculture_profile(setYear, munCityId), { responseType: 'json' });
  }

  DeleteAgricultureProfile(transId:any) {
    return this.http.delete(this.Base.url + this.ApiUrl.delete_agriculture_profile(transId), { responseType: 'text' });
  }

  EditAgricultureProfile(agricultureprofile:any) {
    return this.http.put<any[]>(this.Base.url + this.ApiUrl.put_agriculture_profile(), agricultureprofile, { responseType: 'json' });
  }

}