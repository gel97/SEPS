import { AuthService } from 'src/app/services/auth.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiUrl } from '../../services/apiUrl.service';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class DemographyService {
  GetBarangay() {
    throw new Error('Method not implemented.');
  }
  readonly apiurl = "https://davaodelnorte.ph/sep/apidata/api" // API

  constructor(private Http: HttpClient, private Auth: AuthService, private Base: BaseUrl, private ApiUrl: ApiUrl, private auth: AuthService) { }

//DEMOGRAPHY//
GetDemography():Observable<any[]>{
  return this.Http.post<any[]>(this.apiurl + `/Demography/List?munCityId=${this.auth.munCityId}&setYear=${this.auth.activeSetYear}`,{responseType: 'json'} );
}
AddDemography(Demo:any={}){
  console.log(Demo)
  return this.Http.post (this.apiurl + "/Demography/Save", Demo , {responseType: 'json'});
}

UpdateDemography(Demo:any={}){
  console.log(Demo)
  return this.Http.post (this.apiurl + "/Demography/Update", Demo , {responseType: 'json'});
}



 getAuthToken() {
  return localStorage.getItem('token');
  }


}
