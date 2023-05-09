import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from 'src/app/services/apiUrl.service';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class ExpressMailService {

  constructor(private http: HttpClient, private ApiUrl: ApiUrl, private Base:BaseUrl ) {}

  GetListExpressMail(setYear  :any,munCityId :any) :Observable<any[]> {
    return this.http.get<any[]>(this.Base.url + this.ApiUrl.get_list_com_express_mail(setYear, munCityId), { responseType: 'json' });
  }

  AddExpressMail(exmail:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_com_express_mail(), exmail, { responseType: 'json' });
  }

  EditExpressMail(exmail:any) {
    return this.http.put<any[]>(this.Base.url + this.ApiUrl.put_com_express_mail(), exmail, { responseType: 'json' });
  }

  DeleteExpressMail(transId:any) {
    return this.http.delete(this.Base.url + this.ApiUrl.delete_com_express_mail(transId), { responseType: 'text' });
  }

  ListOfBarangay(munCityId:any)
  {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_list_barangay(munCityId), { responseType: 'json' });
 
  }

}
