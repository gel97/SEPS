import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from 'src/app/services/apiUrl.service';
@Injectable({
  providedIn: 'root'
})
export class SafetyPoliceService {

  constructor(private http: HttpClient, private ApiUrl: ApiUrl, private Base:BaseUrl ) {
  }

  GetListSafetyPolice(setYear  :any, munCityId :any) {
    return this.http.get<any[]>(this.Base.url + this.ApiUrl.get_list_safety_police(setYear, munCityId), { responseType: 'json' });
  }

  AddSafetyPolice(data: any={}) {
    console.log(data);
    return this.http.post(this.Base.url + this.ApiUrl.post_safety_police(),data, { responseType: 'json' });
  }

  EditSafetyPolice(data:any) {
    return this.http.put<any[]>(this.Base.url + this.ApiUrl.put_safety_police(),data, { responseType: 'json' });
  }

  DeleteSafetyPolice(transId: any) {
    return this.http.delete(this.Base.url + this.ApiUrl.delete_safety_police(transId), { responseType: 'text' });
  }

  ListOfBarangay(munCityId:any)
  {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_list_barangay(munCityId), { responseType: 'json' });

  }
  Report():Observable<any[]> {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_report_safety_police(), { responseType: 'json' });
  }

  Import():Observable<any[]> {
      return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_import_safety_police(), { responseType: 'json' });
  }
}
