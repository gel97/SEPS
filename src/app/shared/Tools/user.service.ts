import { AuthService } from 'src/app/services/auth.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiUrl } from '../../services/apiUrl.service';
import { BaseUrl } from 'src/app/services/baseUrl.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private Http: HttpClient,
    private Auth: AuthService,
    private Base: BaseUrl,
    private ApiUrl: ApiUrl,
    private auth: AuthService
  ) {}

  AddUser(data: any = {}) {
    return this.Http.post<any[]>(
      this.Base.url + this.ApiUrl.post_user(),
      data,
      { responseType: 'json' }
    );
  }
  UpdateUser(data: any = {}) {
    console.log(data);
    return this.Http.post<any[]>(
      this.Base.url + this.ApiUrl.post_user_update(),
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
  ListMunCity() {
    return this.Http.get<any[]>(this.Base.url + this.ApiUrl.get_all_muncity(), {
      responseType: 'json',
    });
  }
  GetUser() {
    return this.Http.get<any[]>(
      this.Base.url + this.ApiUrl.get_user_account(),
      { responseType: 'json' }
    );
  }
}
