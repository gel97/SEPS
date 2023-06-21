import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from 'src/app/services/apiUrl.service';
@Injectable({
    providedIn: 'root'
  })
export class HealthProfileService {
  api: any;

  constructor(private http: HttpClient, private ApiUrl: ApiUrl, private Base:BaseUrl ) {
    this.api = this.Base.url;
  }
  GetHealthProfile(setYear  :any) {
    return this.http.get<any[]>(this.Base.url + this.ApiUrl.get_list_health_profile(setYear), { responseType: 'json' });
  }

  AddHealthProfile(healthProfile: any={}) {
    console.log(healthProfile);
    return this.http.post(this.Base.url + this.ApiUrl.post_health_profile(),healthProfile, { responseType: 'json' });
  }
  

  EditHealthProfile(healthProfile:any) {
    return this.http.put<any[]>(this.Base.url + this.ApiUrl.put_health_profile(),healthProfile, { responseType: 'json' });
  }

  DeleteHealthProfile(transId: any) {
    return this.http.delete(this.Base.url + this.ApiUrl.delete_health_profile(transId), { responseType: 'text' });
  }

  ListOfBarangay(munCityId:any)
  { 
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_list_barangay(munCityId), { responseType: 'json' });
 
  }

  ListOfMunicipality(){
    return this.http.get<any[]>(this.Base.url + this.ApiUrl.get_all_muncity(), { responseType: 'json' });
  }
  Import():Observable<any[]> {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_import_health_profile(), { responseType: 'json' });
  }
}