import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from 'src/app/services/apiUrl.service';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class PyapService {
  api: any;
  constructor(
    private http: HttpClient,
    private ApiUrl: ApiUrl,
    private Auth: AuthService,
    private Base: BaseUrl
  ) {
    this.api = this.Base.url;
  }
  GetPYA(setYear: any) {
    return this.http.get<any[]>(
      this.Base.url + this.ApiUrl.get_list_PYAP(setYear),
      { responseType: 'json' }
    );
  }
  AddPYA(data: any = {}) {
    console.log(data);
    return this.http.post(this.Base.url + this.ApiUrl.post_PYAP(), data, {
      responseType: 'json',
    });
  }
  EditPYA(data: any) {
    return this.http.put<any[]>(this.Base.url + this.ApiUrl.put_PYAP(), data, {
      responseType: 'json',
    });
  }
  DeletePYA(transId: any) {
    return this.http.delete(this.Base.url + this.ApiUrl.delete_PYAP(transId), {
      responseType: 'text',
    });
  }
  ListOfMunicipality() {
    return this.http.get<any[]>(this.Base.url + this.ApiUrl.get_all_muncity(), {
      responseType: 'json',
    });
  }
  //Barangay
  ListOfBarangay(munCityId: any) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_list_barangay(munCityId),
      { responseType: 'json' }
    );
  }
  GetBrgyPYAP(): Observable<any[]> {
    return this.http.get<any[]>(
      this.Base.url +
        this.ApiUrl.get_list_brgyPYAP(this.Auth.munCityId, this.Auth.setYear),
      { responseType: 'json' }
    );
  }
  AddBrgyPYAP(brgpyap: any = {}) {
    console.log(brgpyap);
    return this.http.post(
      this.Base.url + this.ApiUrl.post_save_brgyPYAP(),
      brgpyap,
      {
        responseType: 'json',
      }
    );
  }
  EditBrgyPYAP(brgpyap: any = {}) {
    console.log(brgpyap);
    return this.http.put(
      this.Base.url + this.ApiUrl.put_update_brgyPYAP(),
      brgpyap,
      {
        responseType: 'json',
      }
    );
  }
  DeleteBrgyPYAP(transId: any) {
    return this.http.delete(
      this.Base.url + this.ApiUrl.delete_brgyPYAP(transId),
      { responseType: 'text' }
    );
  }
}
