import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from 'src/app/services/apiUrl.service';
@Injectable({
    providedIn: 'root'
  })
export class HealthSanitaryService {
  api: any;

  constructor(private http: HttpClient, private ApiUrl: ApiUrl, private Base:BaseUrl ) {
    this.api = this.Base.url;
  }

  GetHealthSanitary( setYear  :any,munCityId :any) {
    return this.http.get<any[]>(this.Base.url + this.ApiUrl.get_list_health_sanitary( setYear, munCityId), { responseType: 'json' });
  }

  AddHealthSanitary(healthSanitary: any={}) {
    console.log(healthSanitary);
    return this.http.post(this.Base.url + this.ApiUrl.post_health_sanitary(),healthSanitary, { responseType: 'json' });
  }
  

  EditHealthSanitary(healthSanitary:any) {
    return this.http.put<any[]>(this.Base.url + this.ApiUrl.put_health_sanitary(),healthSanitary, { responseType: 'json' });
  }

  DeleteHealthSanitary(transId: any) {
    return this.http.delete(this.Base.url + this.ApiUrl.delete_health_sanitary(transId), { responseType: 'text' });
  }

  ListOfBarangay(munCityId:any)
  {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_list_barangay(munCityId), { responseType: 'json' });
 
  }
}