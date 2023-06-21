import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from 'src/app/services/apiUrl.service';
@Injectable({
    providedIn: 'root'
  })
export class HealthHandicapService {
  api: any;

  constructor(private http: HttpClient, private ApiUrl: ApiUrl, private Base:BaseUrl ) {
    this.api = this.Base.url;
  }

  GetHealthHandicap(setYear  :any, munCityId :any) {
    return this.http.get<any[]>(this.Base.url + this.ApiUrl.get_list_health_handicap(setYear, munCityId), { responseType: 'json' });
  }

  AddHealthHandicap(healthHandicap: any={}) {
    console.log(healthHandicap);
    return this.http.post(this.Base.url + this.ApiUrl.post_health_handicap(),healthHandicap, { responseType: 'json' });
  }
  

  EditHealthHandicap(healthHandicap:any) {
    return this.http.put<any[]>(this.Base.url + this.ApiUrl.put_health_handicap(),healthHandicap, { responseType: 'json' });
  }

  DeleteHealthHandicap(transId: any) {
    return this.http.delete(this.Base.url + this.ApiUrl.delete_health_handicap(transId), { responseType: 'text' });
  }

  ListOfBarangay(munCityId:any)
  {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_list_barangay(munCityId), { responseType: 'json' });
 
  }
  Import():Observable<any[]> {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_import_health_handicap(), { responseType: 'json' });
  }
}