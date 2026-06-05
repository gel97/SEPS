import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from 'src/app/services/apiUrl.service';
@Injectable({
    providedIn: 'root'
  })

export class AgricultureLivestockServiceV2 {

  constructor(private http: HttpClient, private ApiUrl: ApiUrl, private Base:BaseUrl ) {
  }

  AddAgricultureLivestockV2(agriculturelivestock2:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_agriculture_livestock2(), agriculturelivestock2, { responseType: 'json' });
  }

  GetListAgricultureLivestockV2(setYear  :any,munCityId :any) {
    return this.http.get<any[]>(this.Base.url + this.ApiUrl.get_list_agriculture_livestock2(setYear, munCityId), { responseType: 'json' });
  }

  DeleteAgricultureLivestockV2(transId:any) {
    return this.http.delete(this.Base.url + this.ApiUrl.delete_agriculture_livestock2(transId), { responseType: 'text' });
  }

  EditAgricultureLivestockV2(agriculturelivestock2:any) {
    return this.http.put<any[]>(this.Base.url + this.ApiUrl.put_agriculture_livestock2(), agriculturelivestock2, { responseType: 'json' });
  }


  ListOfBarangay(munCityId:any)
  {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_list_barangay(munCityId), { responseType: 'json' });
 
  }

}
