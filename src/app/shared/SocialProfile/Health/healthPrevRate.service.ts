import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from 'src/app/services/apiUrl.service';
@Injectable({
    providedIn: 'root'
  })
export class HealthPrevRateService {
  api: any;
  

  constructor(private http: HttpClient, private ApiUrl: ApiUrl, private Base:BaseUrl ) {
    this.api = this.Base.url;
  }
  GetHealthPrevRate(setYear  :any) {
    return this.http.get<any[]>(this.Base.url + this.ApiUrl.get_list_health_prev_rate(setYear), { responseType: 'json' });
  }

  AddHealthPrevRate(data: any={}) {
    console.log(data);
    return this.http.post(this.Base.url + this.ApiUrl.post_health_prev_rate(),data, { responseType: 'json' });
  }
  

  EditHealthPrevRate(data:any) {
    return this.http.put<any[]>(this.Base.url + this.ApiUrl.put_health_prev_rate(),data, { responseType: 'json' });
  }

  DeleteHealthPrevRate(transId: any) {
    return this.http.delete(this.Base.url + this.ApiUrl.delete_health_prev_rate(transId), { responseType: 'text' });
  }

  ListOfBarangay(munCityId:any)
  {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_list_barangay(munCityId), { responseType: 'json' });
 
  }
 ListOfMunicipality(){
  return this.http.get<any[]>(this.Base.url + this.ApiUrl.get_all_muncity(), { responseType: 'json'});
 }
 Import():Observable<any[]> {
  return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_import_health_prev_rate(), { responseType: 'json' });
 }
 Report():Observable<any[]> {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_import_health_prev_rate(), { responseType: 'json' });
   }
}