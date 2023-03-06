import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { ApiUrl } from '../../services/apiUrl.service';
import { BaseUrl } from 'src/app/services/baseUrl.service';

@Injectable({
  providedIn: 'root'
})
export class MunCityLocService {

  constructor(private Http: HttpClient, private Auth: AuthService, private Base: BaseUrl, private ApiUrl: ApiUrl, private auth: AuthService) { }

  GetMunCity(){
    return this.Http.get<any[]>(this.Base.url + this.ApiUrl.get_all_muncity(),{ responseType: 'json' });
  }

  UpdateMunCity(MunLoc: any = {}) {
    console.log(MunLoc)
    return this.Http.post(this.Base.url + this.ApiUrl.post_update_muncity(), MunLoc, { responseType: 'json' });
  }

}



