import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiUrl } from '../../services/apiUrl.service';
import { BaseUrl } from 'src/app/services/baseUrl.service';

@Injectable({
  providedIn: 'root',
})
export class PGDepartmentHeadsService {
  constructor(
    private Http: HttpClient,
    private Auth: AuthService,
    private Base: BaseUrl,
    private ApiUrl: ApiUrl,
    private auth: AuthService
  ) {}

  GetPgDepHead(): Observable<any[]> {
    return this.Http.post<any[]>(
      this.Base.url + this.ApiUrl.post_get_pg_official(this.Auth.setYear),
      { responseType: 'json' }
    );
  }

  AddPgHead(ProOfficial: any = {}) {
    console.log(ProOfficial);
    return this.Http.post(
      this.Base.url + this.ApiUrl.post_save_pg_official(),
      ProOfficial,
      { responseType: 'json' }
    );
  }

  UpdatePgHead(ProOfficial: any = {}) {
    console.log(ProOfficial);
    return this.Http.post(
      this.Base.url + this.ApiUrl.post_update_pg_official(),
      ProOfficial,
      { responseType: 'json' }
    );
  }
}
