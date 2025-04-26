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
export class ChilDevService {
  api: any;
  constructor(
    private http: HttpClient,
    private ApiUrl: ApiUrl,
    private Auth: AuthService,
    private Base: BaseUrl
  ) {
    this.api = this.Base.url;
  }
  GetChilDev(setYear: any) {
    return this.http.get<any[]>(
      this.Base.url + this.ApiUrl.get_list_ChildDev(setYear),
      { responseType: 'json' }
    );
  }
  AddChilDev(data: any = {}) {
    console.log(data);
    return this.http.post(this.Base.url + this.ApiUrl.post_ChildDev(), data, {
      responseType: 'json',
    });
  }
  EditChilDev(data: any) {
    return this.http.put<any[]>(
      this.Base.url + this.ApiUrl.put_ChildDev(),
      data,
      { responseType: 'json' }
    );
  }
  DeleteChildDev(transId: any) {
    return this.http.delete(
      this.Base.url + this.ApiUrl.delete_ChildDev(transId),
      { responseType: 'text' }
    );
  }
  ListOfMunicipality() {
    return this.http.get<any[]>(this.Base.url + this.ApiUrl.get_all_muncity(), {
      responseType: 'json',
    });
  }
  ListOfBarangay(munCityId: any) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_list_barangay(munCityId),
      { responseType: 'json' }
    );
  }
  //-------------------BrgyChildDev----------------
  GetBrgyChildDev(): Observable<any[]> {
    return this.http.get<any[]>(
      this.Base.url +
        this.ApiUrl.get_list_brgyChildDev(
          this.Auth.munCityId,
          this.Auth.setYear
        ),
      { responseType: 'json' }
    );
  }
  AddBrgyChildDev(brgydev: any = {}) {
    console.log(brgydev);
    return this.http.post(
      this.Base.url + this.ApiUrl.post_save_brgyChildDev(),
      brgydev,
      {
        responseType: 'json',
      }
    );
  }
  EditBrgyChilDev(brgydev: any = {}) {
    console.log(brgydev);
    return this.http.put(
      this.Base.url + this.ApiUrl.put_update_brgyChildDev(),
      brgydev,
      {
        responseType: 'json',
      }
    );
  }
  DeleteBrgyChildDev(transId: any) {
    return this.http.delete(
      this.Base.url + this.ApiUrl.delete_brgyChildDev(transId),
      { responseType: 'text' }
    );
  }
}
