import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from 'src/app/services/apiUrl.service';

@Injectable({
  providedIn: 'root'
})
export class SafetyServicesService {

  api: any;


  constructor(private http: HttpClient, private ApiUrl: ApiUrl, private Base:BaseUrl) { 
    this.api = this.Base.url;
  }
  GetSafetyServices(menuId :any, setYear  :any,munCityId :any) {
    return this.http.get<any[]>(this.Base.url + this.ApiUrl.get_list_safety_services(menuId, setYear, munCityId), { responseType: 'json' });
  }

  AddSafetyServices(SafetyServices: any={}) {
    console.log(SafetyServices);
    return this.http.post(this.Base.url + this.ApiUrl.post_safety_services(),SafetyServices, { responseType: 'json' });
  }
  

  EditSafetyServices(SafetyServices:any) {
    return this.http.put<any[]>(this.Base.url + this.ApiUrl.put_safety_services(),SafetyServices, { responseType: 'json' });
  }

  DeleteSafetyServices(transId: any) {
    return this.http.delete(this.Base.url + this.ApiUrl.delete_safety_services(transId), { responseType: 'text' });
  }

  ListOfBarangay(munCityId:any)
  {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_list_barangay(munCityId), { responseType: 'json' });
 
  }
  ListOfMunicipality(){
    return this.http.get<any[]>(this.Base.url + this.ApiUrl.get_all_muncity(), { responseType: 'json'});
   }

}
