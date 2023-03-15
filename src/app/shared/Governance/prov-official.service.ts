import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiUrl } from '../../services/apiUrl.service';
import { BaseUrl } from 'src/app/services/baseUrl.service';

@Injectable({
  providedIn: 'root'
})
export class ProvOfficialService {

  constructor(private Http: HttpClient, private Auth: AuthService, private Base: BaseUrl, private ApiUrl: ApiUrl, private auth: AuthService) { }


  GetProvOfficial(): Observable<any[]> {
    return this.Http.post<any[]>(this.Base.url + this.ApiUrl.post_get_prov_official(this.Auth.setYear), { responseType: 'json' });
  }

  AddProvOfficial(ProOfficial: any = {}) {
    console.log(ProOfficial)
    return this.Http.post(this.Base.url + this.ApiUrl.post_save_prov_official(), ProOfficial, { responseType: 'json' });
  }

  UpdateProvOfficial(ProOfficial: any = {}) {
    console.log(ProOfficial)
    return this.Http.post(this.Base.url + this.ApiUrl.post_update_prov_official(), ProOfficial, { responseType: 'json' });
  }
}
