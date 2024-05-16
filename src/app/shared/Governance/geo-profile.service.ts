import { AuthService } from 'src/app/services/auth.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiUrl } from '../../services/apiUrl.service';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeoProfileService {
  UpdateMunCity(editmodal: any) {
    throw new Error('Method not implemented.');
  }

  constructor(private Http: HttpClient, private Auth: AuthService, private Base: BaseUrl, private ApiUrl: ApiUrl, private auth: AuthService) { }

  GetGeo():Observable<any[]> {
    return this.Http.get<any[]>(this.Base.url + this.ApiUrl.get_get_geo (this.Auth.munCityId,this.Auth.setYear), { responseType: 'json' });
  }

  AddGeoP(geo: any = {}) {
    console.log(geo)
    return this.Http.post(this.Base.url + this.ApiUrl.post_save_geo(), geo, { responseType: 'json' });
  }

  UpdateGeo(geo: any = {}) {
    console.log(geo)
    return this.Http.put(this.Base.url + this.ApiUrl.put_update_geo (), geo, { responseType: 'json' });
  }
  Delete(transId:any) {
    return this.Http.delete(this.Base.url + this.ApiUrl.delete_geo(transId), { responseType: 'json' });
  }

  Report():Observable<any[]> {
    return this.Http.post<any[]>(this.Base.url + this.ApiUrl.post_report_geo(), { responseType: 'json' });
  }

  Import():Observable<any[]> {
      return this.Http.post<any[]>(this.Base.url + this.ApiUrl.post_import_geo(), { responseType: 'json' });
  }
  

}



