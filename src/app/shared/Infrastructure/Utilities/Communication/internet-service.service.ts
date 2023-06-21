import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from 'src/app/services/apiUrl.service';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class InternetServiceService {

  constructor(private http: HttpClient, private ApiUrl: ApiUrl, private Base:BaseUrl ) {}

  GetListISP(setYear  :any,munCityId :any) :Observable<any[]> {
    return this.http.get<any[]>(this.Base.url + this.ApiUrl.get_list_com_isp(setYear, munCityId), { responseType: 'json' });
  }

  AddISP(isp:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_com_isp(), isp, { responseType: 'json' });
  }

  EditISP(isp:any) {
    return this.http.put<any[]>(this.Base.url + this.ApiUrl.put_com_isp(), isp, { responseType: 'json' });
  }

  DeleteISP(transId:any) {
    return this.http.delete(this.Base.url + this.ApiUrl.delete_com_isp(transId), { responseType: 'text' });
  }

  ListOfBarangay(munCityId:any)
  {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_list_barangay(munCityId), { responseType: 'json' });
 
  }
  Report():Observable<any[]> {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_report_com_isp(), { responseType: 'json' });
  }

  Import():Observable<any[]> {
      return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_import_com_isp(), { responseType: 'json' });
  }

}
