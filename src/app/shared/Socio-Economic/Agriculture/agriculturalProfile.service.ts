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
  api: any;

  constructor(private http: HttpClient, private ApiUrl: ApiUrl, private Base:BaseUrl ) {
    this.api = this.Base.url;
  }

  AddAgricultureProfile(agricultureprofile:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_agriculture(), agricultureprofile, { responseType: 'json' });
  }

  GetListAgricultureProfile(setYear  :any,munCityId :any) {
    return this.http.get<any[]>(this.Base.url + this.ApiUrl.get_list_agriculture(setYear, munCityId), { responseType: 'json' });
  }

  DeleteAgricultureProfile(transId:any) {
    return this.http.delete(this.Base.url + this.ApiUrl.delete_agriculture(transId), { responseType: 'text' });
  }

  EditAgricultureProfile(agricultureprofile:any) {
    return this.http.put<any[]>(this.Base.url + this.ApiUrl.put_agriculture(), agricultureprofile, { responseType: 'json' });
  }

  GetAgricultureProfile(transId  :any) {
    return this.http.get<any[]>(this.Base.url + this.ApiUrl.get_agriculture(transId), { responseType: 'json' });
  }
  GetAgriculture_Profile() {
    return this.http.get<any[]>(this.Base.url + this.ApiUrl.get_agriculture_profile());
  }
}