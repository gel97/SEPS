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
  GetListRequest(dataRequestId?: any) {
    return this.http.get<any>(
      this.Base.url + this.ApiUrl.get_requets(dataRequestId),
      { responseType: 'json' }
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
}
