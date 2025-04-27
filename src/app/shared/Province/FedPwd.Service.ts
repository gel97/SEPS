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
export class FedPwdService {
  api: any;
  constructor(
    private http: HttpClient,
    private ApiUrl: ApiUrl,
    private Auth: AuthService,
    private Base: BaseUrl
  ) {
    this.api = this.Base.url;
  }
  GetPWD(setYear: any) {
    return this.http.get<any[]>(
      this.Base.url + this.ApiUrl.get_list_PWD(setYear),
      { responseType: 'json' }
    );
  }
  AddPWD(data: any = {}) {
    console.log(data);
    return this.http.post(this.Base.url + this.ApiUrl.post_PWD(), data, {
      responseType: 'json',
    });
  }
  EditPWD(data: any) {
    return this.http.put<any[]>(this.Base.url + this.ApiUrl.put_PWD(), data, {
      responseType: 'json',
    });
  }
  DeletePWD(transId: any) {
    return this.http.delete(this.Base.url + this.ApiUrl.delete_PWD(transId), {
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
  GetBrgyPWD(): Observable<any[]> {
    return this.http.get<any[]>(
      this.Base.url +
        this.ApiUrl.get_list_BrgyFedPWD(this.Auth.munCityId, this.Auth.setYear),
      { responseType: 'json' }
    );
  }
  AddBrgyPWD(brgpyap: any = {}) {
    console.log(brgpyap);
    return this.http.post(
      this.Base.url + this.ApiUrl.post_save_BrgyFedPWD(),
      brgpyap,
      {
        responseType: 'json',
      }
    );
  }
  EditBrgyPWD(brgpyap: any = {}) {
    console.log(brgpyap);
    return this.http.put(
      this.Base.url + this.ApiUrl.put_update_BrgyFedPWD(),
      brgpyap,
      {
        responseType: 'json',
      }
    );
  }
  DeleteBrgyPWD(transId: any) {
    return this.http.delete(
      this.Base.url + this.ApiUrl.delete_BrgyFedPWD(transId),
      { responseType: 'text' }
    );
  }
}
