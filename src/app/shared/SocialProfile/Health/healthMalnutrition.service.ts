import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from 'src/app/services/apiUrl.service';
@Injectable({
    providedIn: 'root'
  })
export class HealthMalnutritionService {
  api: any;

  constructor(private http: HttpClient, private ApiUrl: ApiUrl, private Base:BaseUrl ) {
    this.api = this.Base.url;
  }

  GetHealthMalnutrition(setYear  :any, munCityId :any) {
    return this.http.get<any[]>(this.Base.url + this.ApiUrl.get_list_health_malnutrition(setYear, munCityId), { responseType: 'json' });
  }

  AddHealthMalnutrition(healthMalnutrition: any={}) {
    console.log(healthMalnutrition);
    return this.http.post(this.Base.url + this.ApiUrl.post_health_malnutrition(),healthMalnutrition, { responseType: 'json' });
  }
  

  EditHealthMalnutrition(healthMalnutrition:any) {
    return this.http.put<any[]>(this.Base.url + this.ApiUrl.put_health_malnutrition(),healthMalnutrition, { responseType: 'json' });
  }

  DeleteHealthMalnutrition(transId: any) {
    return this.http.delete(this.Base.url + this.ApiUrl.delete_health_malnutrition(transId), { responseType: 'text' });
  }

  ListOfBarangay(munCityId:any)
  {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_list_barangay(munCityId), { responseType: 'json' });
 
  }
  Import():Observable<any[]> {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_import_health_malnutrition(), { responseType: 'json' });
  }
}