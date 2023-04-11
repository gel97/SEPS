import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from 'src/app/services/apiUrl.service';
@Injectable({
    providedIn: 'root'
  })

export class AgricultureProdService {
  api: any;

  constructor(private http: HttpClient, private ApiUrl: ApiUrl, private Base:BaseUrl ) {
    this.api = this.Base.url;
  }

  AddAgricultureProd(provincialcropsproduction:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_agriculture_prod(), provincialcropsproduction, { responseType: 'json' });
  }

  GetListAgricultureProd(setYear  :any,munCityId :any) {
    return this.http.get<any[]>(this.Base.url + this.ApiUrl.get_list_agriculture_prod(setYear, munCityId), { responseType: 'json' });
  }

  DeleteAgricultureProd(transId:any) {
    return this.http.delete(this.Base.url + this.ApiUrl.delete_agriculture_prod(transId), { responseType: 'text' });
  }

  EditAgricultureProd(provincialcropsproduction:any) {
    return this.http.put<any[]>(this.Base.url + this.ApiUrl.put_agriculture_prod(), provincialcropsproduction, { responseType: 'json' });
  }


}