import { AuthService } from 'src/app/services/auth.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiUrl } from '../../services/apiUrl.service';
import { BaseUrl } from 'src/app/services/baseUrl.service';

@Injectable({
  providedIn: 'root'
})
export class GeoProfileService {

  constructor(private Http: HttpClient, private Auth: AuthService, private Base: BaseUrl, private ApiUrl: ApiUrl, private auth: AuthService) { }

  GetGeo() {
    return this.Http.post<any[]>(this.Base.url + this.ApiUrl.post_get_geo(this.Auth.munCityId,this.Auth.setYear), { responseType: 'json' });
  }

  AddGeoP(geo: any = {}) {
    console.log(geo)
    return this.Http.post(this.Base.url + this.ApiUrl.post_save_geo(), geo, { responseType: 'json' });
  }

  UpdateGeo(geo: any = {}) {
    console.log(geo)
    return this.Http.post(this.Base.url + this.ApiUrl.post_update_geo(), geo, { responseType: 'json' });
  }

}



