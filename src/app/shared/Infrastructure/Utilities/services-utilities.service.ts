import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from 'src/app/services/apiUrl.service';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class ServicesUtilitiesService {

  constructor(private http: HttpClient, private ApiUrl: ApiUrl, private Base:BaseUrl, private auth:AuthService ) {
    // this.api = this.Base.url;
  }

List_Services(menuId:any,setYear:any,munCityId :any) {
    return this.http.get<any[]>(this.Base.url + this.ApiUrl.get_list_services(menuId,setYear, munCityId), { responseType: 'json' });
  }


  Add_Services(Services:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_services(),Services, { responseType: 'json' });
  }

  Update_Services(Services:any) {
    return this.http.put<any[]>(this.Base.url + this.ApiUrl.put_services(), Services, { responseType: 'json' });
  }

  Delete_Services(transId:any) {
    return this.http.delete(this.Base.url + this.ApiUrl.delete_services(transId), { responseType: 'text' });
  }

  ListBarangay(){
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_list_barangay(this.auth.munCityId), { responseType: 'json' });
  }

  Report():Observable<any[]> {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_report_services(), { responseType: 'json' });
  }

  Import(menuId :any,):Observable<any[]> {
      return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_import_services(menuId), { responseType: 'json' });
  }

}
