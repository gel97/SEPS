import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { ApiUrl } from '../../services/apiUrl.service';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SkVoterService {

  constructor(private Http: HttpClient, private Auth: AuthService, private Base: BaseUrl, private ApiUrl: ApiUrl, private auth: AuthService) { }

  GetSKVoter():Observable<any[]> {
    return this.Http.post<any[]>(this.Base.url + this.ApiUrl.post_get_skvoter(this.Auth.munCityId,this.Auth.setYear), { responseType: 'json' });
  }

  AddSKVoter(Voter: any = {}) {
    console.log(Voter)
    return this.Http.post(this.Base.url + this.ApiUrl. post_save_skvoter(), Voter, { responseType: 'json' });
  }

  UpdateSKVoter(Voter: any = {}) {
    console.log(Voter)
    return this.Http.post(this.Base.url + this.ApiUrl. post_update_skvoter(), Voter, { responseType: 'json' });
  }


  DeleteSKVoter(transId:any) {
    return this.Http.delete(this.Base.url + this.ApiUrl.delete_skVoter(transId), { responseType: 'json' });
  }

  ListBarangay(){
    return this.Http.post<any[]>(this.Base.url + this.ApiUrl.post_list_barangay(this.Auth.munCityId), { responseType: 'json' });
  }

  Report():Observable<any[]> {
    return this.Http.post<any[]>(this.Base.url + this.ApiUrl.post_report_skVoter(), { responseType: 'json' });
  }

  Import():Observable<any[]> {
      return this.Http.post<any[]>(this.Base.url + this.ApiUrl.post_import_skVoter(), { responseType: 'json' });
  }

}
