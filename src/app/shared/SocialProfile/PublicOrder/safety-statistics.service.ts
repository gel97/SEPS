import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from 'src/app/services/apiUrl.service';
@Injectable({
  providedIn: 'root'
})
export class SafetyStatisticsService {
  api: any;

  constructor( private http: HttpClient, private ApiUrl: ApiUrl, private Base:BaseUrl ) {
      this.api = this.Base.url;

  }


  GetSafetyStatistics(setYear  :any, munCityId :any) {
    return this.http.get<any[]>(this.Base.url + this.ApiUrl.get_safety_statistics(setYear, munCityId), { responseType: 'json' });
  }

  AddSafetyStatistics(safetyStatistics: any={}) {
    console.log(safetyStatistics);
    return this.http.post(this.Base.url + this.ApiUrl.post_safety_statistics(),safetyStatistics, { responseType: 'json' });
  }

  EditSafetyStatistics(safetyStatistics:any) {
    return this.http.put<any[]>(this.Base.url + this.ApiUrl.put_safety_statistics(),safetyStatistics, { responseType: 'json' });
  }

  DeleteSafetyStatistics(transId: any) {
    return this.http.delete(this.Base.url + this.ApiUrl.delete_safety_statistics(transId), { responseType: 'text' });
  }

  ListOfMunicipality(){
    return this.http.get<any[]>(this.Base.url + this.ApiUrl.get_all_muncity(), { responseType: 'json'});
   }



}

