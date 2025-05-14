import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from '../../services/apiUrl.service';

@Injectable({
  providedIn: 'root',
})
export class GuestService {
  api: any;
  constructor(
    private Http: HttpClient,
    private Auth: AuthService,
    private Base: BaseUrl,
    private ApiUrl: ApiUrl,
    private auth: AuthService
  ) {
    this.api = this.Base.url;
  }
  ListOfMunicipality() {
    return this.Http.get<any[]>(this.Base.url + this.ApiUrl.get_all_muncity(), {
      responseType: 'json',
    });
  }
  Register(data: any = {}) {
    return this.Http.post<any[]>(
      this.Base.url + this.ApiUrl.post_user(),
      data,
      { responseType: 'json' }
    );
  }
  UsernameCheck(username: any) {
    return this.Http.post<any[]>(
      this.Base.url + this.ApiUrl.post_user_username_check(username),
      { responseType: 'json' }
    );
  }
}
