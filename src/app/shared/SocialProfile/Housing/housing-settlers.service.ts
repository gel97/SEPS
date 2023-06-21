import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiUrl } from 'src/app/services/apiUrl.service';
import { BaseUrl } from 'src/app/services/baseUrl.service';

@Injectable({
  providedIn: 'root',
})
export class HousingSettlersService {
  constructor(
    private http: HttpClient,
    private Auth: AuthService,
    private Base: BaseUrl,
    private ApiUrl: ApiUrl,
    private auth: AuthService
  ) {}

  GetHousingSettlers(setYear: any, munCityId: any) {
    return this.http.get<any[]>(
      this.Base.url + this.ApiUrl.get_list_housing_settlers(setYear, munCityId),
      { responseType: 'json' }
    );
  }

  AddHousingSettlers(ViewHousingSettlers: any = {}) {
    return this.http.post(
      this.Base.url + this.ApiUrl.post_housing_settlers(),
      ViewHousingSettlers,
      { responseType: 'json' }
    );
  }

  UpdateHousingSettlers(ViewHousingSettlers: any = {}) {
    ViewHousingSettlers.latitude = Number(ViewHousingSettlers.latitude);
    ViewHousingSettlers.longitude = Number(ViewHousingSettlers.longitude);
    console.log(ViewHousingSettlers);
    return this.http.put(
      this.Base.url + this.ApiUrl.put_housing_settlers(),
      ViewHousingSettlers,
      { responseType: 'json' }
    );
  }

  DeleteHousingSettlers(transId: any) {
    return this.http.delete(
      this.Base.url + this.ApiUrl.delete_housing_settlers(transId),
      { responseType: 'text' }
    );
  }

  ListBarangay() {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_list_barangay(this.Auth.munCityId),
      { responseType: 'json' }
    );
  }

  Report():Observable<any[]> {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_report_housing_project(), { responseType: 'json' });
  }

  Import():Observable<any[]> {
      return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_import_housing_project(), { responseType: 'json' });
  }
}