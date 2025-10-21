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
    return this.Http.put(this.Base.url + this.ApiUrl.post_update_official(), Official, { responseType: 'json' });
  }
  Delete_Officials(transId:any) {
    return this.Http.delete(this.Base.url + this.ApiUrl.delete_officials(transId), { responseType: 'json' });
  }

  GetMunPosition() {
    return this.Http.get(this.Base.url + this.ApiUrl.get_mun_position(), { responseType: 'json' });
  }

  Report():Observable<any[]> {
    return this.Http.post<any[]>(this.Base.url + this.ApiUrl.post_report_officials(), { responseType: 'json' });
  }

  Import():Observable<any[]> {
      return this.Http.post<any[]>(this.Base.url + this.ApiUrl.post_import_officials(), { responseType: 'json' });
  }
  //yearterm
  AddYearTerm(yearterm: any = {}) {
    return this.Http.post(this.Base.url + this.ApiUrl.post_save_TearnYear(), yearterm, { responseType: 'json' });
  }
  UpdateTerm(yearterm: any = {}) {
    return this.Http.put(this.Base.url + this.ApiUrl.put_update_termYear(), yearterm, { responseType: 'json' });
  }
  Term():Observable<any[]> {
    return this.Http.get<any[]>(this.Base.url + this.ApiUrl.get_termYear(this.Auth.munCityId, this.Auth.setYear), { responseType: 'json' });
  }

  
}



