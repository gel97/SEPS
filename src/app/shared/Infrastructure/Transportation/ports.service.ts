import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from 'src/app/services/apiUrl.service';
import { Observable } from 'rxjs/internal/Observable';
@Injectable({
  providedIn: 'root'
})
export class PortsService {

  constructor(private http: HttpClient, private ApiUrl: ApiUrl, private Base:BaseUrl ) {}

  GetListPort(setYear  :any,munCityId :any) :Observable<any[]> {
    return this.http.get<any[]>(this.Base.url + this.ApiUrl.get_list_port(setYear, munCityId), { responseType: 'json' });
  }

  AddPort(port:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_port(), port, { responseType: 'json' });
  }

  EditPort(port:any) {
    return this.http.put<any[]>(this.Base.url + this.ApiUrl.put_port(), port, { responseType: 'json' });
  }

  DeletePort(transId:any) {
    return this.http.delete(this.Base.url + this.ApiUrl.delete_port(transId), { responseType: 'text' });
  }

  ListOfBarangay(munCityId:any)
  {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_list_barangay(munCityId), { responseType: 'json' }); 
  }

  Report():Observable<any[]> {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_report_port(), { responseType: 'json' });
  }

  Import():Observable<any[]> {
      return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_import_port(), { responseType: 'json' });
  }

}
