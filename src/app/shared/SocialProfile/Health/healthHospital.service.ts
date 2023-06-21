import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from 'src/app/services/apiUrl.service';
@Injectable({
    providedIn: 'root'
  })
export class HealthHospitalService {
  api: any;

  constructor(private http: HttpClient, private ApiUrl: ApiUrl, private Base:BaseUrl ) {
    this.api = this.Base.url;
  }
  GetHealtHospital(setYear: any) {
    return this.http.get<any[]>(this.Base.url + this.ApiUrl.get_list_health_hospital(setYear), { responseType: 'json' });
  }

  AddHealthHospital(HealthHosp: any={}) {
    console.log(HealthHosp);
    return this.http.post(this.Base.url + this.ApiUrl.post_health_hospital(),HealthHosp, { responseType: 'json' });
  }
  

  EditHealthHospital(HealthHosp:any) {
    return this.http.put<any[]>(this.Base.url + this.ApiUrl.put_health_hospital(),HealthHosp, { responseType: 'json' });
  }

  DeleteHealtHospital(transId: any) {
    return this.http.delete(this.Base.url + this.ApiUrl.delete_health_hospital(transId), { responseType: 'text' });
  }

  ListOfBarangay(munCityId:any)
  { 
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_list_barangay(munCityId), { responseType: 'json' });
 
  }

  ListOfMunicipality(){
    return this.http.get<any[]>(this.Base.url + this.ApiUrl.get_all_muncity(), { responseType: 'json' });
  }
  Import():Observable<any[]> {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_import_health_hospital(), { responseType: 'json' });
  }

}