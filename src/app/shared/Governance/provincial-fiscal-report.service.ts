import { AuthService } from 'src/app/services/auth.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiUrl } from '../../services/apiUrl.service';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProvincialFiscalReportService {

  constructor(private Http: HttpClient, private Auth: AuthService, private Base: BaseUrl, private ApiUrl: ApiUrl, private auth: AuthService) { }


  GetFiscalReport():Observable<any[]> {
    return this.Http.post<any[]>(this.Base.url + this.ApiUrl.post_get_provincialfiscal(this.Auth.setYear), { responseType: 'json' });
  }
  AddfiscalReport(fiscal: any = {}) {
    console.log(fiscal)
    return this.Http.post(this.Base.url + this.ApiUrl.post_save_provincialfiscal(), fiscal, { responseType: 'json' });
  }
  UpdatefiscalReport(fiscal: any = {}) {
    console.log(fiscal)
    return this.Http.post(this.Base.url + this.ApiUrl.post_update_provincialfiscal (), fiscal, { responseType: 'json' });
  }

}



