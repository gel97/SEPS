import { AuthService } from 'src/app/services/auth.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiUrl } from '../../services/apiUrl.service';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegVoterService {

  constructor(private Http: HttpClient, private Auth: AuthService, private Base: BaseUrl, private ApiUrl: ApiUrl, private auth: AuthService) { }


  GetRegVoter():Observable<any[]> {
    return this.Http.post<any[]>(this.Base.url + this.ApiUrl.post_get_regvoter(this.Auth.munCityId,this.Auth.setYear), { responseType: 'json' });
  }

  AddRegVoter(Voter: any = {}) {
    console.log(Voter)
    return this.Http.post(this.Base.url + this.ApiUrl.post_save_regvoter(), Voter, { responseType: 'json' });
  }

  UpdateRegVoter(Voter: any = {}) {
    console.log(Voter)
    return this.Http.post(this.Base.url + this.ApiUrl.post_update_regvoter(), Voter, { responseType: 'json' });
  }

  DeleteRegVoter(transId:any) {
    return this.Http.delete(this.Base.url + this.ApiUrl.delete_regVoter(transId), { responseType: 'json' });
  }

  ListBarangay(){
    return this.Http.post<any[]>(this.Base.url + this.ApiUrl.post_list_barangay_demo(this.Auth.munCityId), { responseType: 'json' });
  }

}



