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

  GetManEstabCategory():Observable<any[]>{
    return this.Http.get<any[]>(this.Base.url + this.ApiUrl.get_manuf_estab_cat(), { responseType: 'json' });
  }

  GetManEstabType():Observable<any[]>{
    return this.Http.get<any[]>(this.Base.url + this.ApiUrl.get_manuf_estab_types(), { responseType: 'json' });
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

  Report():Observable<any[]> {
    return this.Http.post<any[]>(this.Base.url + this.ApiUrl.post_report_manuf_estab(), { responseType: 'json' });
  }

  Import():Observable<any[]> {
      return this.Http.post<any[]>(this.Base.url + this.ApiUrl.post_import_manuf_estab(), { responseType: 'json' });
  }
//   ExImport():Observable<any[]> {
//     return this.Http.post<any[]>(this.Base.url + this.ApiUrl.post_ExImport_manuf_estab(this.Auth.munCityId, this.Auth.setYear), { responseType: 'json' });
// }
//   ExExport():Observable<any[]>  {
//   return this.Http.get<any[]>(this.Base.url + this.ApiUrl.get_ExExport_maunuf_estab(this.Auth.munCityId, this.Auth.setYear), { responseType: 'json' });
// }
}
