import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from 'src/app/services/apiUrl.service';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class ServiceFacilitiesService {

  constructor(private http: HttpClient, private ApiUrl: ApiUrl, private Base:BaseUrl ) {}

  GetListServiceFacilities(menuId :any, setYear  :any,munCityId :any) :Observable<any[]> {
    return this.http.get<any[]>(this.Base.url + this.ApiUrl.get_list_service_facilities(menuId, setYear, munCityId), { responseType: 'json' });
  }

  AddServiceFacility(education:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_services_faclitity(), education, { responseType: 'json' });
  }

  EditServiceFacility(education:any) {
    return this.http.put<any[]>(this.Base.url + this.ApiUrl.put_serivce_facility(), education, { responseType: 'json' });
  }

  DeleteServiceFacility(transId:any) {
    return this.http.delete(this.Base.url + this.ApiUrl.delete_service_facility(transId), { responseType: 'text' });
  }

  ListOfBarangay(munCityId:any)
  {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_list_barangay(munCityId), { responseType: 'json' });
 
  }
  Report():Observable<any[]> {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_report_service_facility(), { responseType: 'json' });
  }

  Import(menuId :any,):Observable<any[]> {
      return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_import_service_facility(menuId), { responseType: 'json' });
  }

}
