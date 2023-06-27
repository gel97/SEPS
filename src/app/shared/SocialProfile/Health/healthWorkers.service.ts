import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from 'src/app/services/apiUrl.service';
@Injectable({
    providedIn: 'root'
  })
export class HealthWorkersService {
  api: any;
  

  constructor(private http: HttpClient, private ApiUrl: ApiUrl, private Base:BaseUrl ) {
    this.api = this.Base.url;
  }
  GetHealthWorkers(setYear  :any,munCityId :any) {
    return this.http.get<any[]>(this.Base.url + this.ApiUrl.get_health_workers(setYear, munCityId), { responseType: 'json' });
  }

  AddHealthWorkers(healthWorkers: any={}) {
    console.log(healthWorkers);
    return this.http.post(this.Base.url + this.ApiUrl.post_health_workers(),healthWorkers, { responseType: 'json' });
  }
  

  EditHealthWorkers(healthWorkers:any) {
    return this.http.put<any[]>(this.Base.url + this.ApiUrl.put_health_workers(),healthWorkers, { responseType: 'json' });
  }

  DeleteHealthWorkers(transId: any) {
    return this.http.delete(this.Base.url + this.ApiUrl.delete_health_workers(transId), { responseType: 'text' });
  }

  ListOfBarangay(munCityId:any)
  {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_list_barangay(munCityId), { responseType: 'json' });
 
  }
 ListOfMunicipality(){
  return this.http.get<any[]>(this.Base.url + this.ApiUrl.get_all_muncity(), { responseType: 'json'});
 }
 Import():Observable<any[]> {
  return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_import_health_workers(), { responseType: 'json' });
}
}