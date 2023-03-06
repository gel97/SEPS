import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from '../../services/apiUrl.service';



@Injectable({
  providedIn: 'root'
})
export class MajorEconomicService {


  constructor(private Http: HttpClient, private Auth: AuthService, private Base: BaseUrl, private ApiUrl: ApiUrl, private auth: AuthService) { }

  GetMajorEco(): any{
    return this.Http.get<any[]>(this.Base.url + this.ApiUrl.get_major_eco(this.Auth.munCityId, this.Auth.setYear), { responseType: 'json' });
  }

  AddMajorEco(MajorAct: any = {}) {
    console.log(MajorAct)
    return this.Http.post(this.Base.url + this.ApiUrl.post_save_major_eco(), MajorAct, { responseType: 'json' });
  }

  UpdateMajorEco(MajorAct:any = {}) {
    console.log(MajorAct)
    return this.Http.put(this.Base.url + this.ApiUrl.put_update_major_eco(), MajorAct, { responseType: 'json' });
  }

}
