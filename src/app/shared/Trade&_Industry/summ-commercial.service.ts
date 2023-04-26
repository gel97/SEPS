import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from '../../services/apiUrl.service';

@Injectable({
  providedIn: 'root'
})
export class SummCommercialService {


  constructor(private Http: HttpClient, private Auth: AuthService, private Base: BaseUrl, private ApiUrl: ApiUrl, private auth: AuthService) { }

  Get_Summ_Estab():Observable<any[]>{
    return this.Http.get<any[]>(this.Base.url + this.ApiUrl.get_summ_commercial(this.Auth.munCityId, this.Auth.setYear), { responseType: 'json' });
  }

  Add_Summ_Estab(ManEstab: any = {}){
    console.log(ManEstab)
    return this.Http.post(this.Base.url + this.ApiUrl.post_save_summ_commercial(), ManEstab, { responseType: 'json' });
  }

  Update_Summ_Estab(ManEstab:any = {}) {
    console.log(ManEstab)
    return this.Http.put(this.Base.url + this.ApiUrl.put_update_summ_commercial(), ManEstab, { responseType: 'json' });
  }
  Delete_Summ_Estab(transId:any) {
    return this.Http.delete(this.Base.url + this.ApiUrl.delete_summ_commercial(transId), { responseType: 'json' });
  }

  ListBarangay(){
    return this.Http.post<any[]>(this.Base.url + this.ApiUrl.post_list_barangay(this.Auth.munCityId), { responseType: 'json' });
}

}
