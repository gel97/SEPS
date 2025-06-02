import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from 'src/app/services/apiUrl.service';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class CDRAService {
  constructor(
    private Http: HttpClient,
    private Auth: AuthService,
    private Base: BaseUrl,
    private ApiUrl: ApiUrl,
    private auth: AuthService
  ) {}
  GetCDRA(setYear: any) {
    return this.Http.get<any[]>(this.Base.url + this.ApiUrl.get_CDRA(setYear), {
      responseType: 'json',
    });
  }
  uploadCDRA(data: FormData) {
    return this.Http.post(this.Base.url + this.ApiUrl.post_save_CDRA(), data, {
      responseType: 'json',
    });
  }
}
