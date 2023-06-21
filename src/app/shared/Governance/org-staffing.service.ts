import { AuthService } from 'src/app/services/auth.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiUrl } from '../../services/apiUrl.service';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class OrgStaffingService {

    constructor(private Http: HttpClient, private Auth: AuthService, private Base: BaseUrl, private ApiUrl: ApiUrl, private auth: AuthService) { }

    GetOrg():Observable<any[]> {
      console.log(this.Auth.setYear+" "+ this.Auth.munCityId);
        return this.Http.get<any[]>(this.Base.url + this.ApiUrl.get_get_org(this.Auth.munCityId,this.Auth.setYear), { responseType: 'json' });
    }
    AddOrg(vieworg: any = {}){
      console.log(vieworg)
      return this.Http.post(this.Base.url + this.ApiUrl.post_save_org(),vieworg, { responseType: 'json' });
    }
    UpdateOrg(vieworg: any = {}) {
        console.log(vieworg)
        return this.Http.put(this.Base.url + this.ApiUrl.put_update_org(), vieworg, { responseType: 'json' });
    }

    Delete_Org(transId:any) {
      return this.Http.delete(this.Base.url + this.ApiUrl.delete_org(transId), { responseType: 'json' });
    }

    Report():Observable<any[]> {
      return this.Http.post<any[]>(this.Base.url + this.ApiUrl.post_report_org(), { responseType: 'json' });
    }
  
    Import():Observable<any[]> {
        return this.Http.post<any[]>(this.Base.url + this.ApiUrl.post_import_org(), { responseType: 'json' });
    }
}



