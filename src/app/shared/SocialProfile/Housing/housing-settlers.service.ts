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
    private Http: HttpClient,
    private Auth: AuthService,
    private Base: BaseUrl,
    private ApiUrl: ApiUrl,
    private auth: AuthService
  ) {}

  GetHousingSettlers(setYear: any, munCityId: any) {
    return this.Http.get<any[]>(
      this.Base.url + this.ApiUrl.get_list_housing_settlers(setYear, munCityId),
      { responseType: 'json' }
    );
  }

  AddHousingSettlers(ViewHousingSettlers: any = {}) {
    return this.Http.post(
      this.Base.url + this.ApiUrl.post_housing_settlers(),
      ViewHousingSettlers,
      { responseType: 'json' }
    );
  }

  UpdateHousingSettlers(ViewHousingSettlers: any = {}) {
    ViewHousingSettlers.latitude = Number(ViewHousingSettlers.latitude);
    ViewHousingSettlers.longitude = Number(ViewHousingSettlers.longitude);
    console.log(ViewHousingSettlers);
    return this.Http.put(
      this.Base.url + this.ApiUrl.put_housing_settlers(),
      ViewHousingSettlers,
      { responseType: 'json' }
    );
  }

  DeleteHousingSettlers(transId: any) {
    return this.Http.delete(
      this.Base.url + this.ApiUrl.delete_housing_settlers(transId),
      { responseType: 'text' }
    );
  }

  ListBarangay() {
    return this.Http.post<any[]>(
      this.Base.url + this.ApiUrl.post_list_barangay(this.Auth.munCityId),
      { responseType: 'json' }
    );
  }
}