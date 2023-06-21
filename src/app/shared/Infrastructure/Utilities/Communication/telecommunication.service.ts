import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from 'src/app/services/apiUrl.service';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class TelecommunicationService {

  constructor(private http: HttpClient, private ApiUrl: ApiUrl, private Base:BaseUrl, private auth:AuthService ) {
    // this.api = this.Base.url;
  }

List_telcom(setYear:any,munCityId :any) {
    return this.http.get<any[]>(this.Base.url + this.ApiUrl.get_list_telcom(setYear, munCityId), { responseType: 'json' });
  }


  Add_telcom(Teleco:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_telcom(),Teleco, { responseType: 'json' });
  }

  Update_telcom(Teleco:any) {
    return this.http.put<any[]>(this.Base.url + this.ApiUrl.put_telcom(), Teleco, { responseType: 'json' });
  }

  Delete_telcom(transId:any) {
    return this.http.delete(this.Base.url + this.ApiUrl.delete_telcom(transId), { responseType: 'text' });
  }

  ListBarangay(){
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_list_barangay(this.auth.munCityId), { responseType: 'json' });
  }
  Report():Observable<any[]> {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_report_telcom(), { responseType: 'json' });
  }

  Import():Observable<any[]> {
      return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_import_telcom(), { responseType: 'json' });
  }

}
