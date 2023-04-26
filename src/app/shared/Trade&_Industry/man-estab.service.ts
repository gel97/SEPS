import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from '../../services/apiUrl.service';


@Injectable({
  providedIn: 'root'
})
export class ManEstabService {


  constructor(private Http: HttpClient, private Auth: AuthService, private Base: BaseUrl, private ApiUrl: ApiUrl, private auth: AuthService) { }

  GetManEstab():Observable<any[]>{
    return this.Http.get<any[]>(this.Base.url + this.ApiUrl.get_manuf_estab(this.Auth.munCityId, this.Auth.setYear), { responseType: 'json' });
  }

  AddManEstab(ManEstab: any = {}){
    console.log(ManEstab)
    return this.Http.post(this.Base.url + this.ApiUrl.post_save_manuf_estab(), ManEstab, { responseType: 'json' });
  }

  UpdateManEstab(ManEstab:any = {}) {
    console.log(ManEstab)
    return this.Http.put(this.Base.url + this.ApiUrl.put_update_manuf_estab(), ManEstab, { responseType: 'json' });
  }
  DeleteManEstab(transId:any) {
    return this.Http.delete(this.Base.url + this.ApiUrl.delete_manuf_estab(transId), { responseType: 'json' });
  }

  ListBarangay(){
    return this.Http.post<any[]>(this.Base.url + this.ApiUrl.post_list_barangay(this.Auth.munCityId), { responseType: 'json' });
}

}
