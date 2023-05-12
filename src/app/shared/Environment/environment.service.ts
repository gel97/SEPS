import { Injectable } from '@angular/core';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from 'src/app/services/apiUrl.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {

  constructor(private http: HttpClient, private ApiUrl: ApiUrl, private Base:BaseUrl) { }

  GetEnvironment(menuId: any, setYear: any, munCityId: any){
    return this.http.get<any[]>(this.Base.url + this.ApiUrl.get_list_environment(menuId, setYear, munCityId), {responseType: 'json'});
  }
  
  AddEnvironment(environment: any={}){
    return this.http.post(this.Base.url + this.ApiUrl.post_environment(), environment, {responseType: 'json'});
  }

  EditEnvironment(environment: any={}){
    return this.http.put<any[]>(this.Base.url + this.ApiUrl.put_environment(), environment, {responseType: 'json'});
  }

  DeleteEnvironment(transId:any){
    return this.http.delete(this.Base.url + this.ApiUrl.delete_environment(transId), {responseType: 'text'});
  }

} 
