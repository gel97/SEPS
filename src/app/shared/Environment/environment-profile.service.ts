import { Injectable } from '@angular/core';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from 'src/app/services/apiUrl.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentProfileService {

  constructor(private http: HttpClient, private ApiUrl: ApiUrl, private Base:BaseUrl) { }

  GetEnvironmentProfile(setYear: any, munCityId: any){
    return this.http.get<any[]>(this.Base.url + this.ApiUrl.get_list_environment_profile(setYear, munCityId), {responseType: 'json'});
  }
  
  AddEnvironmentProile(environment: any={}){
    return this.http.post(this.Base.url + this.ApiUrl.post_environment_profile(), environment, {responseType: 'json'});
  }

  EditEnvironmentProfile(environment: any={}){
    return this.http.put<any[]>(this.Base.url + this.ApiUrl.put_environment_profile(), environment, {responseType: 'json'});
  }

  DeleteEnvironmentProfile(transId:any){
    return this.http.delete(this.Base.url + this.ApiUrl.delete_environment_profile(transId), {responseType: 'text'});
  }

}