import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from 'src/app/services/apiUrl.service';
import { environment } from 'src/environments/environment';
@Injectable({
    providedIn: 'root'
  })

export class EnvironmentActService {
  api: any;

  constructor(private http: HttpClient, private ApiUrl: ApiUrl, private Base:BaseUrl ) {
  }

  GetEnvironmentalActivities(setYear:any, munCityId:any){
    return this.http.get<any[]>(this.Base.url + this.ApiUrl.get_list_environment_activities(setYear, munCityId),{ responseType: `json`});
  }

  AddEnvironmentalActivities(environment:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_environment_activities(), environment, { responseType: 'json' });
  }
 
  EditEnvironmentalActivities(environment:any) {
    return this.http.put<any[]>(this.Base.url + this.ApiUrl.put_environment_activities(), environment, { responseType: 'json' });
  }

  DeleteEnvironmentalActivities(transId:any) {
    return this.http.delete(this.Base.url + this.ApiUrl.delete_environment_activities(transId), { responseType: 'text' });
  }

  GetBarangayList(munCityId:any){
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_list_barangay(munCityId),{responseType: `json`});
  }



}