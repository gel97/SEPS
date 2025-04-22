import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from '../../services/apiUrl.service';

@Injectable({
  providedIn: 'root',
})
export class AgriProfService {
  constructor(
    private Http: HttpClient,
    private Auth: AuthService,
    private Base: BaseUrl,
    private ApiUrl: ApiUrl,
    private auth: AuthService
  ) {}
  GetProvAgri(setYear: any, munCityId: any) {
    return this.Http.get<any[]>(
      this.Base.url + this.ApiUrl.get_provincial_agri(setYear, munCityId),
      { responseType: 'json' }
    );
  }
  AddProvAgri(provagri: any = {}) {
    console.log(provagri);
    return this.Http.post(
      this.Base.url + this.ApiUrl.post_provincial_agri(),
      provagri,
      { responseType: 'json' }
    );
  }
  UpdateProvAgri(editData: any) {
    console.log();
    return this.Http.put(
      this.Base.url + this.ApiUrl.put_provincial_agri(),
      editData,
      {
        responseType: 'json',
      }
    );
  }
  DeleteProv(transId: any) {
    return this.Http.delete(
      this.Base.url + this.ApiUrl.delete_provincial_agri(transId),
      { responseType: 'text' }
    );
  }

  GetProvTypes() {
    return this.Http.get<any[]>(
      this.Base.url + this.ApiUrl.get_list_provincial_agri(),
      { responseType: 'json' }
    );
  }
  ListOfMunicipality() {
    return this.Http.get<any[]>(this.Base.url + this.ApiUrl.get_dis_muncity(), {
      responseType: 'json',
    });
  }
}
