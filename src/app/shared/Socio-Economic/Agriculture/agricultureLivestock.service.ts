import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from 'src/app/services/apiUrl.service';
@Injectable({
    providedIn: 'root'
  })

export class AgricultureLivestockService {

  constructor(private http: HttpClient, private ApiUrl: ApiUrl, private Base:BaseUrl ) {
  }

  AddAgricultureLivestock(agriculturelivestock:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_agriculture_livestock(), agriculturelivestock, { responseType: 'json' });
  }

  GetListAgricultureLivestock(setYear  :any,munCityId :any) {
    return this.http.get<any[]>(this.Base.url + this.ApiUrl.get_list_agriculture_livestock(setYear, munCityId), { responseType: 'json' });
  }

  DeleteAgricultureLivestock(transId:any) {
    return this.http.delete(this.Base.url + this.ApiUrl.delete_agriculture_livestock(transId), { responseType: 'text' });
  }

  EditAgricultureLivestock(agriculturelivestock:any) {
    return this.http.put<any[]>(this.Base.url + this.ApiUrl.put_agriculture_livestock(), agriculturelivestock, { responseType: 'json' });
  }
  Report():Observable<any[]> {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_report_agriculture_livestock(), { responseType: 'json' });
  }

  Import():Observable<any[]> {
      return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_import_agriculture_livestock(), { responseType: 'json' });
  }

  ListOfBarangay(munCityId:any)
  {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_list_barangay(munCityId), { responseType: 'json' });
 
  }

}
