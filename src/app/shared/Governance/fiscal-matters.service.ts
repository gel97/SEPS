import { AuthService } from 'src/app/services/auth.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiUrl } from '../../services/apiUrl.service';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FiscalMattersService {

  constructor(private Http: HttpClient, private Auth: AuthService, private Base: BaseUrl, private ApiUrl: ApiUrl, private auth: AuthService) { }


  GetFiscal():Observable<any[]> {
    return this.Http.post<any[]>(this.Base.url + this.ApiUrl.post_get_fiscal_matters(this.Auth.munCityId), { responseType: 'json' });
  }
  Addfiscal(fiscal: any = {}) {
    console.log(fiscal)
    return this.Http.post(this.Base.url + this.ApiUrl.post_save_fiscal_matters(), fiscal, { responseType: 'json' });
  }
  Updatefiscal(fiscal: any = {}) {
    console.log(fiscal)
    return this.Http.post(this.Base.url + this.ApiUrl.post_update_fiscal_matters(), fiscal, { responseType: 'json' });
  }

  Delete(transId:any) {
    return this.Http.delete(this.Base.url + this.ApiUrl.delete_fiscal(transId), { responseType: 'json' });
  }

}



