import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from 'src/app/services/apiUrl.service';
import { Observable } from 'rxjs/internal/Observable';
@Injectable({
  providedIn: 'root'
})
export class ServiceIrrigationService {

  constructor(private http: HttpClient, private ApiUrl: ApiUrl, private Base:BaseUrl ) {}

  GetServiceIrrigation(munCityId :any, setYear  :any) :Observable<any[]> {
    return this.http.get<any[]>(this.Base.url + this.ApiUrl.get_service_irrigation(setYear, munCityId ), { responseType: 'json' });
  }

  AddServiceIrrigation(irrigation:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_service_irrigation(), irrigation, { responseType: 'json' });
  }

  EditServiceIrrigation(irrigation:any) {
    return this.http.put<any[]>(this.Base.url + this.ApiUrl.put_service_irrigation(), irrigation, { responseType: 'json' });
  }

  DeleteServiceIrrigation(transId:any) {
    return this.http.delete(this.Base.url + this.ApiUrl.delete_service_irrigation(transId), { responseType: 'text' });
  }

  ListOfBarangay(munCityId:any)
  {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_list_barangay(munCityId), { responseType: 'json' });
 
  }
  Report():Observable<any[]> {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_report_service_irrigation(), { responseType: 'json' });
  }

  Import():Observable<any[]> {
      return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_import_service_irrigation(), { responseType: 'json' });
  }
}
