import { AuthService } from 'src/app/services/auth.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiUrl } from '../../services/apiUrl.service';
import { BaseUrl } from 'src/app/services/baseUrl.service';

@Injectable({
    providedIn: 'root'
})
export class OrgStaffingService {

    constructor(private Http: HttpClient, private Auth: AuthService, private Base: BaseUrl, private ApiUrl: ApiUrl, private auth: AuthService) { }

    GetOrg() {
        return this.Http.post<any[]>(this.Base.url + this.ApiUrl.post_get_org(this.Auth.munCityId, this.Auth.setYear), { responseType: 'json' });
    }
    AddOrg(org: any = {}) {
        return this.Http.post(this.Base.url + this.ApiUrl.post_save_org(), org, { responseType: 'json' });
    }
    UpdateOrg(org: any = {}) {
        console.log(org)
        return this.Http.post(this.Base.url + this.ApiUrl.post_update_org, org, { responseType: 'json' });
    }

}



