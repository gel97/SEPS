import { AuthService } from 'src/app/services/auth.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiUrl } from '../../services/apiUrl.service';
import { BaseUrl } from 'src/app/services/baseUrl.service';

@Injectable({
    providedIn: 'root'
})
export class SepDataService {

    constructor(private Http: HttpClient, private Auth: AuthService, private Base: BaseUrl, private ApiUrl: ApiUrl, private auth: AuthService) { }

    ListMunCity() {
        return this.Http.get<any[]>(this.Base.url + this.ApiUrl.get_all_muncity(), { responseType: 'json' });
    }

    ListSepYear () {
        return this.Http.get<any[]>(this.Base.url + this.ApiUrl.get_sep_year(), { responseType: 'json' });
    }

}



