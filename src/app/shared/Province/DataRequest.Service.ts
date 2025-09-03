import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from '../../services/apiUrl.service';

@Injectable({
  providedIn: 'root',
})
export class DataRequestService {
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
  ListOfMunicipality() {
    return this.http.get<any[]>(this.Base.url + this.ApiUrl.get_all_muncity(), {
      responseType: 'json',
    });
  }
  GetRequestsByMunicipality(munCityId: string, year?: number) {
    let url = this.Base.url + `/DataRequests/byMunicipality/${munCityId}`;
    if (year) {
      url += `/${year}`;
    }
    return this.http.get<any[]>(url, { responseType: 'json' });
  }
  CoreElements() {
    return this.http.get<any[]>(
      this.Base.url + this.ApiUrl.get_Core_Elements(),
      {
        responseType: 'json',
      }
    );
  }

  GetSepYears() {
    return this.http.get<any[]>(this.Base.url + this.ApiUrl.get_sep_year(), {
      responseType: 'json',
    });
  }

  GetTemplateById(transId: any) {
    return this.http.get<any>(
      this.Base.url + this.ApiUrl.get_template(transId),
      { responseType: 'json' }
    );
  }
  GetAllTemplates() {
    return this.http.get<any[]>(this.Base.url + this.ApiUrl.get_templates(), {
      responseType: 'json',
    });
  }
  SaveRequest(data: any) {
    return this.http.post<any>(
      this.Base.url + this.ApiUrl.post_save_request(),
      data,
      { responseType: 'json' }
    );
  }
}
