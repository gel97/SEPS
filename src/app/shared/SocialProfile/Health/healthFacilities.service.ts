import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from 'src/app/services/apiUrl.service';
@Injectable({
    providedIn: 'root'
  })
export class HealthFacilitiesService {

  constructor(private http: HttpClient, private ApiUrl: ApiUrl, private Base:BaseUrl ) {
  }
  GetHealthFacilities(menuId :any, setYear  :any,munCityId :any) {
    return this.http.get<any[]>(this.Base.url + this.ApiUrl.get_list_health_facilities(menuId, setYear, munCityId), { responseType: 'json' });
  }

  AddHealthFacilities(healthFacilities: any={}) {
    console.log(healthFacilities);
    return this.http.post(this.Base.url + this.ApiUrl.post_health_facility(),healthFacilities, { responseType: 'json' });
  }
  

  EditHealthFacilities(healthFacilities:any) {
    return this.http.put<any[]>(this.Base.url + this.ApiUrl.put_health_facility(),healthFacilities, { responseType: 'json' });
  }

  DeleteHealthFacilities(transId: any) {
    return this.http.delete(this.Base.url + this.ApiUrl.delete_health_facility(transId), { responseType: 'text' });
  }

  ListOfBarangay(munCityId:any)
  {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_list_barangay(munCityId), { responseType: 'json' });
 
  }
  Import(menuId :any):Observable<any[]> {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_import_health_facility(menuId), { responseType: 'json' });
  }

}