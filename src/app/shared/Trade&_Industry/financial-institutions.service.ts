import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from 'src/app/services/apiUrl.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FinancialInstitutionsService {

  constructor(private Http: HttpClient, private Auth: AuthService, private Base: BaseUrl, private ApiUrl: ApiUrl, private auth: AuthService) { }

  GetFinancial():Observable<any[]>{
    return this.Http.get<any[]>(this.Base.url + this.ApiUrl.get_financial_Ins(this.Auth.munCityId, this.Auth.setYear), { responseType: 'json' });
  }

  Add_Financial_Ins(Financial: any = {}){
    console.log(Financial)
    return this.Http.post(this.Base.url + this.ApiUrl.post_save_financial_Ins(),Financial, { responseType: 'json' });
  }

  Update_Financial_Ins(Financial:any = {}) {
    console.log(Financial)
    return this.Http.put(this.Base.url + this.ApiUrl.put_update_financial_Ins(), Financial, { responseType: 'json' });
  }
  Delete_Financial_Ins(transId:any) {
    return this.Http.delete(this.Base.url + this.ApiUrl.delete_financial_Ins(transId), { responseType: 'json' });
  }

  ListBarangay(){
    return this.Http.post<any[]>(this.Base.url + this.ApiUrl.post_list_barangay(this.Auth.munCityId), { responseType: 'json' });
  }

  Import():Observable<any[]> {
    return this.Http.post<any[]>(this.Base.url + this.ApiUrl.post_import_financial_Ins(), { responseType: 'json' });
  }

}
