import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiUrl } from '../../services/apiUrl.service';
import { BaseUrl } from 'src/app/services/baseUrl.service';

@Injectable({
  providedIn: 'root',
})
export class ProvOfficialService {
  constructor(
    private Http: HttpClient,
    private Auth: AuthService,
    private Base: BaseUrl,
    private ApiUrl: ApiUrl,
    private auth: AuthService
  ) {}

  GetGovernance(): Observable<any> {
    const url =
      this.Base.url +
      this.ApiUrl.get_Governance(this.auth.activeSetYear, this.auth.munCityId);
    return this.Http.get<any>(url); // Use Http.get for GET requests
  }
  GetSocioEcAct(): Observable<any> {
    const url =
      this.Base.url +
      this.ApiUrl.get_SocioEcAct(this.auth.activeSetYear, this.auth.munCityId);
    return this.Http.get<any>(url); // Use Http.get for GET requests
  }
  GetProvOfficial(): Observable<any[]> {
    return this.Http.post<any[]>(
      this.Base.url + this.ApiUrl.post_get_prov_official(this.Auth.setYear),
      { responseType: 'json' }
    );
  }

  AddProvOfficial(ProOfficial: any = {}) {
    console.log(ProOfficial);
    return this.Http.post(
      this.Base.url + this.ApiUrl.post_save_prov_official(),
      ProOfficial,
      { responseType: 'json' }
    );
  }

  UpdateProvOfficial(ProOfficial: any = {}) {
    console.log(ProOfficial);
    return this.Http.post(
      this.Base.url + this.ApiUrl.post_update_prov_official(),
      ProOfficial,
      { responseType: 'json' }
    );
  }

  Import(): Observable<any[]> {
    return this.Http.post<any[]>(
      this.Base.url + this.ApiUrl.post_import_prov_officials(),
      { responseType: 'json' }
    );
  }

  GetMunPosition() {
    return this.Http.get(this.Base.url + this.ApiUrl.get_prov_position(), {
      responseType: 'json',
    });
  }
  GetPercentageGov(
    setYear: string | number,
    munCityId: string
  ): Observable<any> {
    const url =
      this.Base.url + this.ApiUrl.get_percentage_Gov(munCityId, setYear);
    return this.Http.get<any>(url, { responseType: 'json' });
  }

  GetAllPercentage(
    setYear: string | number,
    munCityId: string,
    notApplicableModules: string[] = []
  ): Observable<any> {
    let params = new HttpParams()
      .set('setYear', setYear.toString())
      .set('munCityId', munCityId);

    notApplicableModules.forEach(
      (module) => (params = params.append('notApplicableModules', module))
    );

    return this.Http.get<any>(this.Base.url + '/Menu/municipality-percentage', {
      params,
      responseType: 'json',
    });
  }

  ListOfMunicipality(): Observable<any[]> {
    return this.Http.get<any[]>(this.Base.url + this.ApiUrl.get_all_muncity());
  }
}
