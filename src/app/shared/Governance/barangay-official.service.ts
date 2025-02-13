import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiUrl } from '../../services/apiUrl.service';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { response } from 'express';

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
  //for Purok
  GetBarangayPrk(): Observable<any[]> {
    return this.Http.post<any[]>(
      this.Base.url +
        this.ApiUrl.post_get_prkBrgy(this.Auth.munCityId, this.Auth.setYear),
      { responseType: 'json' }
    );
  }
  AddPrkChair(ViewPrkChair: any = {}) {
    return this.Http.post(
      this.Base.url + this.ApiUrl.post_save_purokchair(),
      ViewPrkChair,
      { responseType: 'json' }
    );
  }
  EditPrk(editPrk: any = {}) {
    console.log(editPrk);
    return this.Http.post(
      this.Base.url + this.ApiUrl.post_update_purok(),
      editPrk,
      { responseType: 'json' }
    );
  }

  DeletePrk(transId: any) {
    return this.Http.delete(this.Base.url + this.ApiUrl.delete_Prk(transId), {
      responseType: 'text',
    });
  }
  ListPrkBrgy() {
    return this.Http.post<any[]>(
      this.Base.url + this.ApiUrl.post_list_PrkBarangay(this.Auth.munCityId),
      { responseType: 'json' }
    );
  }
  Import2(): Observable<any[]> {
    return this.Http.post<any[]>(
      this.Base.url + this.ApiUrl.post_import_purok(),
      { responseType: 'json' }
    );
  }
}
