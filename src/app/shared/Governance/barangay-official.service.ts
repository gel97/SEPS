import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiUrl } from '../../services/apiUrl.service';
import { BaseUrl } from 'src/app/services/baseUrl.service';

@Injectable({
  providedIn: 'root',
})
export class BarangayOfficialService {
  constructor(
    private Http: HttpClient,
    private Auth: AuthService,
    private Base: BaseUrl,
    private ApiUrl: ApiUrl,
    private auth: AuthService
  ) {}

  GetBarangay(): Observable<any[]> {
    return this.Http.post<any[]>(
      this.Base.url +
        this.ApiUrl.post_get_barangay_officials(
          this.Auth.munCityId,
          this.Auth.setYear
        ),
      { responseType: 'json' }
    );
  }

  AddBarangay(ViewBarangayOfficial: any = {}) {
    return this.Http.post(
      this.Base.url + this.ApiUrl.post_save_barangay(),
      ViewBarangayOfficial,
      { responseType: 'json' }
    );
  }

  UpdateBarangay(ViewBarangayOfficial: any = {}) {
    ViewBarangayOfficial.latitude = Number(ViewBarangayOfficial.latitude);
    ViewBarangayOfficial.longitude = Number(ViewBarangayOfficial.longitude);
    console.log(ViewBarangayOfficial);
    return this.Http.post(
      this.Base.url + this.ApiUrl.post_update_barangay(),
      ViewBarangayOfficial,
      { responseType: 'json' }
    );
  }

  Delete_Barangay(transId: any) {
    return this.Http.delete(
      this.Base.url + this.ApiUrl.delete_barangay(transId),
      { responseType: 'text' }
    );
  }

  ListBarangay() {
    return this.Http.post<any[]>(
      this.Base.url + this.ApiUrl.post_list_barangay(this.Auth.munCityId),
      { responseType: 'json' }
    );
  }

  Report(): Observable<any[]> {
    return this.Http.post<any[]>(
      this.Base.url + this.ApiUrl.post_barangay_report(),
      { responseType: 'json' }
    );
  }

  Import(): Observable<any[]> {
    return this.Http.post<any[]>(
      this.Base.url + this.ApiUrl.post_import_report(),
      { responseType: 'json' }
    );
  }
  //PrkChairman
  GetPurokChair(): Observable<any[]> {
    return this.Http.get<any[]>(
      this.Base.url +
        this.ApiUrl.get_list_purok(this.Auth.munCityId, this.Auth.setYear),
      { responseType: 'json' }
    );
  }
  AddPurokChair(prk: any = {}) {
    console.log(prk);
    return this.Http.post(
      this.Base.url + this.ApiUrl.post_save_purokchair(),
      prk,
      {
        responseType: 'json',
      }
    );
  }
  EditPhyGeoBrgy(prk: any = {}) {
    console.log(prk);
    return this.Http.put(this.Base.url + this.ApiUrl.post_update_purok(), prk, {
      responseType: 'json',
    });
  }
  Deleteprk(transId: any) {
    return this.Http.delete(this.Base.url + this.ApiUrl.delete_purok(transId), {
      responseType: 'text',
    });
  }
}
