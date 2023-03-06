import { AuthService } from 'src/app/services/auth.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiUrl } from '../../services/apiUrl.service';
import { BaseUrl } from 'src/app/services/baseUrl.service';

@Injectable({
  providedIn: 'root'
})
export class CityOfficialService {

  constructor(private Http: HttpClient, private Auth: AuthService, private Base: BaseUrl, private ApiUrl: ApiUrl, private auth: AuthService) { }

  GetOfficial() {
    return this.Http.post<any[]>(this.Base.url + this.ApiUrl.post_get_officials(this.Auth.munCityId, this.Auth.setYear), { responseType: 'json' });
  }

  AddOfficial(Official: any = {}) {
    return this.Http.post(this.Base.url + this.ApiUrl.post_save_official(), Official, { responseType: 'json' });
  }

  UpdateOfficial(Official: any = {}) {
    return this.Http.post(this.Base.url + this.ApiUrl.post_update_official(), Official, { responseType: 'json' });
  }

  GetMunPosition() {
    return this.Http.get(this.Base.url + this.ApiUrl.get_mun_position(), { responseType: 'json' });
  }

}



