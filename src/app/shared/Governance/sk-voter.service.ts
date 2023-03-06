import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { ApiUrl } from '../../services/apiUrl.service';
import { BaseUrl } from 'src/app/services/baseUrl.service';

@Injectable({
  providedIn: 'root'
})
export class SkVoterService {

  constructor(private Http: HttpClient, private Auth: AuthService, private Base: BaseUrl, private ApiUrl: ApiUrl, private auth: AuthService) { }

  GetSKVoter() {
    return this.Http.post<any[]>(this.Base.url + this.ApiUrl. post_get_skvoter(this.Auth.munCityId), { responseType: 'json' });
  }

  AddSKVoter(Voter: any = {}) {
    console.log(Voter)
    return this.Http.post(this.Base.url + this.ApiUrl. post_save_skvoter(), Voter, { responseType: 'json' });
  }

  UpdateSKVoter(Voter: any = {}) {
    console.log(Voter)
    return this.Http.post(this.Base.url + this.ApiUrl. post_update_skvoter(), Voter, { responseType: 'json' });
  }

}
