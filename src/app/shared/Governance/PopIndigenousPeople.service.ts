import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiUrl } from '../../services/apiUrl.service';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { response } from 'express';

@Injectable({
  providedIn: 'root',
})
export class PopulationOfIndigenousPeopleService {
  constructor(
    private Http: HttpClient,
    private Auth: AuthService,
    private Base: BaseUrl,
    private ApiUrl: ApiUrl,
    private auth: AuthService
  ) {}

  GetBarangayList() {
    return this.Http.post<any[]>(
      this.Base.url + this.ApiUrl.post_list_barangay(this.Auth.munCityId),
      { responseType: `json` }
    );
  }
  GetIPListByYear(setYear: any, munCityId: any) {
    return this.Http.get<any[]>(
      this.Base.url + this.ApiUrl.get_list_IPbyYear(setYear, munCityId),
      { responseType: `json` }
    );
  }
  AddIP(IP: any = {}) {
    console.log(IP);
    return this.Http.post(this.Base.url + this.ApiUrl.post_save_IP(), IP, {
      responseType: 'json',
    });
  }
  UpdateIP(IP: any = {}) {
    console.log(IP);
    return this.Http.post(this.Base.url + this.ApiUrl.post_update_IP(), IP, {
      responseType: 'json',
    });
  }
  DeleteIP(transId: string): Observable<any> {
    return this.Http.delete<any>(
      this.Base.url + this.ApiUrl.delete_IP(transId),
      { responseType: 'json' }
    );
  }
  Import(): Observable<any[]> {
    return this.Http.post<any[]>(this.Base.url + this.ApiUrl.post_import_IP(), {
      responseType: 'json',
    });
  }
}
