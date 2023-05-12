import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from 'src/app/services/apiUrl.service';

@Injectable({
  providedIn: 'root'
})
export class SafetyTanodService {

  api: any;

  constructor(private http: HttpClient, private ApiUrl: ApiUrl, private Base:BaseUrl ) {
    this.api = this.Base.url;
  }



  GetSafetyTanod(setYear  :any, munCityId :any) {
    return this.http.get<any[]>(this.Base.url + this.ApiUrl.get_list_safety_tanod(setYear, munCityId), { responseType: 'json' });
  }

  AddSafetyTanod(safetyTanod: any={}) {
    console.log(safetyTanod);
    return this.http.post(this.Base.url + this.ApiUrl.post_safety_tanod(),safetyTanod, { responseType: 'json' });
  }


  EditSafetyTanod(safetyTanod:any) {
    return this.http.put<any[]>(this.Base.url + this.ApiUrl.put_safety_tanod(),safetyTanod, { responseType: 'json' });
  }

  DeleteSafetyTanod(transId: any) {
    return this.http.delete(this.Base.url + this.ApiUrl.delete_safety_tanod(transId), { responseType: 'text' });
  }

  ListOfBarangay(munCityId:any)
  {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_list_barangay(munCityId), { responseType: 'json' });

  }

}
