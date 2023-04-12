import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from '../../services/apiUrl.service';


@Injectable({
  providedIn: 'root'
})
export class CommercialEstablishmentService {

  constructor(private Http: HttpClient, private Auth: AuthService, private Base: BaseUrl, private ApiUrl: ApiUrl, private auth: AuthService) { }

  Get_Com_Estab():Observable<any[]>{
    return this.Http.get<any[]>(this.Base.url + this.ApiUrl.get_com_estab(this.Auth.munCityId, this.Auth.setYear), { responseType: 'json' });
  }

  Add_Com_Estab(ComEstab: any = {}){
    console.log(ComEstab)
    return this.Http.post(this.Base.url + this.ApiUrl.post_save_com_estab(),ComEstab, { responseType: 'json' });
  }

  Update_Com_Estab(ComEstab:any = {}) {
    console.log(ComEstab)
    return this.Http.put(this.Base.url + this.ApiUrl.put_update_com_estab(),ComEstab, { responseType: 'json' });
  }
  Delete_Com_Estab(transId:any) {
    return this.Http.delete(this.Base.url + this.ApiUrl.delete_com_estab(transId), { responseType: 'json' });
  }

  ListBarangay(){
    return this.Http.post<any[]>(this.Base.url + this.ApiUrl.post_list_barangays(this.Auth.munCityId), { responseType: 'json' });
}

}
