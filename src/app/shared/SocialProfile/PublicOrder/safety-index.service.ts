import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from 'src/app/services/apiUrl.service';
@Injectable({
  providedIn: 'root'
})
export class SafetyIndexService {

  constructor(private http: HttpClient, private ApiUrl: ApiUrl, private Base:BaseUrl ) {
  }

  GetListSafetyIndex(setYear  :any, munCityId :any) {
    return this.http.get<any[]>(this.Base.url + this.ApiUrl.get_list_safety_index(setYear, munCityId), { responseType: 'json' });
  }

  AddSafetyIndex(data: any={}) {
    console.log(data);
    return this.http.post(this.Base.url + this.ApiUrl.post_safety_index(),data, { responseType: 'json' });
  }

  EditSafetyIndex(data:any) {
    return this.http.put<any[]>(this.Base.url + this.ApiUrl.put_safety_index(),data, { responseType: 'json' });
  }

  DeleteSafetyIndex(transId: any) {
    return this.http.delete(this.Base.url + this.ApiUrl.delete_safety_index(transId), { responseType: 'text' });
  }

  ListOfBarangay(munCityId:any)
  {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_list_barangay(munCityId), { responseType: 'json' });

  }
  Report():Observable<any[]> {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_import_safety_index(), { responseType: 'json' });
  }

  Import():Observable<any[]> {
      return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_report_safety_index(), { responseType: 'json' });
  }
}
