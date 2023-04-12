import { AuthService } from 'src/app/services/auth.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiUrl } from '../../services/apiUrl.service';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CityOfficialService {

  constructor(private Http: HttpClient, private Auth: AuthService, private Base: BaseUrl, private ApiUrl: ApiUrl, private auth: AuthService) { }

  GetOfficial():Observable<any[]> {
    return this.Http.post<any[]>(this.Base.url + this.ApiUrl.post_get_officials(this.Auth.munCityId, this.Auth.setYear), { responseType: 'json' });
  }

  AddOfficial(Official: any = {}) {
    return this.Http.post(this.Base.url + this.ApiUrl.post_save_official(), Official, { responseType: 'json' });
  }

  UpdateOfficial(Official: any = {}) {
    return this.Http.post(this.Base.url + this.ApiUrl.post_update_official(), Official, { responseType: 'json' });
  }
  Delete_Officials(transId:any) {
    return this.Http.delete(this.Base.url + this.ApiUrl.delete_officials(transId), { responseType: 'json' });
  }

  GetMunPosition() {
    return this.Http.get(this.Base.url + this.ApiUrl.get_mun_position(), { responseType: 'json' });
  }

}



