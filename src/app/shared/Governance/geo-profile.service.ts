import { AuthService } from 'src/app/services/auth.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiUrl } from '../../services/apiUrl.service';
import { BaseUrl } from 'src/app/services/baseUrl.service';

@Injectable({
  providedIn: 'root',
})
export class GeoProfileService {
  api: any;
  UpdateMunCity(editmodal: any) {
    throw new Error('Method not implemented.');
  }

  constructor(
    private Http: HttpClient,
    private Auth: AuthService,
    private Base: BaseUrl,
    private ApiUrl: ApiUrl
  ) {}

  GetGeoProfile(setYear: any, munCityId: any) {
    return this.Http.get<any[]>(
      this.Base.url + this.ApiUrl.get_list_prof(setYear, munCityId),
      { responseType: 'json' }
    );
  }

  AddGeoProfile(geo: any = {}) {
    console.log(geo);
    return this.Http.post(this.Base.url + this.ApiUrl.post_save_prof(), geo, {
      responseType: 'json',
    });
  }

  EditGeoProfile(geo: any = {}) {
    geo.latitude = Number(geo.latitude);
    geo.longitude = Number(geo.longitude);
    console.log(geo);
    return this.Http.put(this.Base.url + this.ApiUrl.put_update_prof(), geo, {
      responseType: 'json',
    });
  }
  DeleteGeoProfile(transId: any) {
    return this.Http.delete(this.Base.url + this.ApiUrl.delete_prof(transId), {
      responseType: 'text',
    });
  }

  // Report(): Observable<any[]> {
  //   return this.Http.post<any[]>(
  //     this.Base.url + this.ApiUrl.post_report_geo(),
  //     { responseType: 'json' }
  //   );
  // }

  // Import(): Observable<any[]> {
  //   return this.Http.post<any[]>(
  //     this.Base.url + this.ApiUrl.post_import_geo(),
  //     { responseType: 'json' }
  //   );
  // }
  ListBarangay(munCityId: any) {
    return this.Http.post<any[]>(
      this.Base.url + this.ApiUrl.post_list_barangay(munCityId),
      { responseType: 'json' }
    );
  }
}
