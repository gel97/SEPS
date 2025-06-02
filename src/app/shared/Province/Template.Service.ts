import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from '../../services/apiUrl.service';

@Injectable({
  providedIn: 'root',
})
export class TemplateService {
  api: any;
  constructor(
    private http: HttpClient,
    private Auth: AuthService,
    private Base: BaseUrl,
    private ApiUrl: ApiUrl,
    private auth: AuthService
  ) {
    this.api = this.Base.url;
  }
  CoreElements() {
    return this.http.get<any[]>(
      this.Base.url + this.ApiUrl.get_Core_Elements(),
      {
        responseType: 'json',
      }
    );
  }
}
