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
export class EnvironmentAffectedFloodService {
  constructor(
    private Http: HttpClient,
    private Auth: AuthService,
    private Base: BaseUrl,
    private ApiUrl: ApiUrl,
    private auth: AuthService
  ) {}

  GetAffectedFlood(): Observable<any[]> {
    return this.Http.get<any[]>(
      this.Base.url + this.ApiUrl.get_environment_affected_flood(),
      { responseType: 'json' }
    ).pipe(
      catchError((error) => {
        console.error('API Error:', error);
        return throwError(error);
      })
    );
  }
  PosToken() {
    return this.Http.post<any>(this.Base.url + this.ApiUrl.post_gis_token(), {
      responseType: 'json',
    });
  }
  Getpdf(setYear: number, munCityId: string) {
    return this.Http.get(
      this.Base.url +
        this.ApiUrl.get_pdf(this.Auth.setYear, this.Auth.munCityId),
      { responseType: 'blob' }
    );
  }

  Add_affected_flood(affected: any = {}) {
    console.log(affected);
    return this.Http.post(
      this.Base.url + this.ApiUrl.post_environment_affected_flood(),
      affected,
      { responseType: 'json' }
    );
  }
  UpdateAffectedFlood(editaffected: any = {}) {
    console.log(editaffected);
    return this.Http.post(
      this.Base.url + this.ApiUrl.post_update_environment_affected_flood(),
      editaffected,
      { responseType: 'json' }
    );
  }
  DeleteAffectedFlood(transId: any) {
    return this.Http.delete(
      this.Base.url + this.ApiUrl.delete_environment_affectd(transId),
      { responseType: 'text' }
    );
  }
}
