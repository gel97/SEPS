import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiUrl } from '../../services/apiUrl.service';
import { BaseUrl } from 'src/app/services/baseUrl.service';


@Injectable({
    providedIn: 'root'
})
export class BarangayOfficialService {

    constructor(private Http: HttpClient, private Auth: AuthService, private Base: BaseUrl, private ApiUrl: ApiUrl, private auth: AuthService) { }

    GetBarangay():Observable<any[]> {
        return this.Http.post<any[]>(this.Base.url + this.ApiUrl.post_get_barangay_officials(this.Auth.munCityId, this.Auth.setYear), { responseType: 'json' });
    }

    AddBarangay(ViewBarangayOfficial: any = {}) {
        return this.Http.post(this.Base.url + this.ApiUrl.post_save_barangay(), ViewBarangayOfficial, { responseType: 'json' });
    }

    UpdateBarangay(ViewBarangayOfficial: any = {}) {
        ViewBarangayOfficial.latitude = Number(ViewBarangayOfficial.latitude);
        ViewBarangayOfficial.longitude = Number(ViewBarangayOfficial.longitude);
        console.log(ViewBarangayOfficial);
        return this.Http.post(this.Base.url + this.ApiUrl.post_update_barangay(), ViewBarangayOfficial, { responseType: 'json' });
    }

    ListBarangay(){
        return this.Http.post<any[]>(this.Base.url + this.ApiUrl.post_list_barangay(this.Auth.munCityId), { responseType: 'json' });
    }
}



