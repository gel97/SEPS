import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from 'src/app/services/apiUrl.service';
@Injectable({
  providedIn: 'root',
})
export class AgricultureService {
  api: any;

  constructor(
    private http: HttpClient,
    private ApiUrl: ApiUrl,
    private Base: BaseUrl
  ) {
    this.api = this.Base.url;
  }

  GetListAgriculture(menuId: any, setYear: any, munCityId: any) {
    return this.http.get<any[]>(
      this.Base.url +
        this.ApiUrl.get_list_agriculture(menuId, setYear, munCityId),
      { responseType: `json` }
    );
  }

  AddAgriculture(ricecropsproduction: any) {
    console.log('check_service', ricecropsproduction);
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_agriculture(),
      ricecropsproduction,
      { responseType: 'json' }
    );
  }

  EditAgriculture(ricecropsproduction: any) {
    console.log('check_service', ricecropsproduction);
    return this.http.put<any[]>(
      this.Base.url + this.ApiUrl.put_agriculture(),
      ricecropsproduction,
      { responseType: 'json' }
    );
  }

  DeleteAgriculture(transId: any) {
    return this.http.delete(
      this.Base.url + this.ApiUrl.delete_agriculture(transId),
      { responseType: 'text' }
    );
  }

  GetBarangayList(munCityId: any) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_list_barangay(munCityId),
      { responseType: `json` }
    );
  }

  Import(menuId: any): Observable<any[]> {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_import_agriculture(menuId),
      { responseType: 'json' }
    );
  }
}
