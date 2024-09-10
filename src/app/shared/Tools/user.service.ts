import { AuthService } from 'src/app/services/auth.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiUrl } from '../../services/apiUrl.service';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  verifyToken(requestData: { token: string }): Observable<{ token: string }> {
    return this.Http.post<{ token: string }>(
      this.Base.url + this.ApiUrl.verify_token(),
      requestData, // Send the object with the token
      {
        responseType: 'json',
      }
    );
  }

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
  // service file (e.g., user.service.ts)
  UpdateUser(editmodal: any = {}): Observable<any> {
    const updateData = {
      email: editmodal.email,
      currentPassword: editmodal.currentPassword,
      newPassword: editmodal.newPassword,
      token: editmodal.token, // Include the token in the request data
    };

    return this.Http.post(
      this.Base.url + this.ApiUrl.post_user_update(),
      updateData,
      {
        responseType: 'json',
      }
    );
  }

  verifyTokenAndLogin(requestData: { email: string; token: string }) {
    return this.Http.post(
      this.Base.url + this.ApiUrl.post_user_update(), // Assuming this URL is correct for verifying the token
      requestData,
      {
        responseType: 'json',
      }
    );
  }

  storeToken(token: string) {
    localStorage.setItem('authToken', token);
    return this.Http.post(
      this.Base.url + this.ApiUrl.post_user_update(),
      token,
      {
        responseType: 'json',
      }
    );
  }

  sendPasswordResetLink(request: { EmailAddress: string; ResetUrl: string }) {
    return this.Http.post(
      this.Base.url + this.ApiUrl.post_reset_pass(),
      request,
      {
        responseType: 'json',
      }
    );
  }
  updatePassword(request: {
    email: string;
    currentPassword: string;
    newPassword: string;
  }) {
    return this.Http.post(
      this.Base.url + this.ApiUrl.post_user_update(),
      request,
      {
        responseType: 'json',
      }
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
