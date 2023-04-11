import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from 'src/app/services/apiUrl.service';

@Injectable({
  providedIn: 'root'
})
export class IndustrialEstatesService {
  constructor(private Http: HttpClient, private Auth: AuthService, private Base: BaseUrl, private ApiUrl: ApiUrl, private auth: AuthService) { }

  GetIndustrial():Observable<any[]>{
    return this.Http.get<any[]>(this.Base.url + this.ApiUrl.get_Industrial(this.Auth.munCityId, this.Auth.setYear), { responseType: 'json' });
  }

  Add_Industrial(Industrial: any = {}){
    console.log(Industrial)
    return this.Http.post(this.Base.url + this.ApiUrl.post_save_Industrial(),Industrial, { responseType: 'json' });
  }

  Update_Industrial(Industrial:any = {}) {
    console.log(Industrial)
    return this.Http.put(this.Base.url + this.ApiUrl.put_update_Industrial(),Industrial, { responseType: 'json' });
  }
  Delete_Industrial(transId:any) {
    return this.Http.delete(this.Base.url + this.ApiUrl.delete_Industrial(transId), { responseType: 'json' });
  }

  ListBarangay(){
    return this.Http.post<any[]>(this.Base.url + this.ApiUrl.post_list_barangays(this.Auth.munCityId), { responseType: 'json' });
}

}
