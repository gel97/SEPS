import { AuthService } from 'src/app/services/auth.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiUrl } from '../../services/apiUrl.service';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DemographyService {
  GetBarangay() {
    throw new Error('Method not implemented.');
  }
  readonly apiurl = 'https://davaodelnorte.ph/sep/apidata/api'; // API

  constructor(
    private Http: HttpClient,
    private Auth: AuthService,
    private Base: BaseUrl,
    private ApiUrl: ApiUrl,
    private auth: AuthService
  ) {}

  //DEMOGRAPHY//
  GetDemography(): Observable<any[]> {
    //return this.Http.post<any[]>(this.apiurl + `/Demography/List?munCityId=${this.auth.munCityId}&setYear=${this.auth.activeSetYear}`,{responseType: 'json'} );
    return this.Http.get<any[]>(
      this.Base.url +
        this.ApiUrl.get_demography(this.auth.munCityId, this.auth.setYear),
      { responseType: 'json' }
    );
  }
  AddDemography(Demo: any = {}) {
    console.log(Demo);
    return this.Http.post(this.Base.url + '/Demography/Save', Demo, {
      responseType: 'json',
    });
  }

  UpdateDemography(Demo: any = {}) {
    console.log(Demo);
    return this.Http.post(this.Base.url + '/Demography/Update', Demo, {
      responseType: 'json',
    });
  }

  DeleteDemography(transId: any) {
    return this.Http.delete(
      this.Base.url + this.ApiUrl.delete_demography(transId),
      { responseType: 'json' }
    );
  }

  ListBarangay() {
    return this.Http.post<any[]>(
      this.Base.url + this.ApiUrl.post_list_barangay(this.Auth.munCityId),
      { responseType: 'json' }
    );
  }

  getAuthToken() {
    return localStorage.getItem('token');
  }

  Report(): Observable<any[]> {
    return this.Http.post<any[]>(
      this.Base.url + this.ApiUrl.post_report_demography(),
      { responseType: 'json' }
    );
  }
  Import(): Observable<any[]> {
    return this.Http.post<any[]>(
      this.Base.url + this.ApiUrl.post_import_demo(),
      {
        responseType: 'json',
      }
    );
  }
}
