import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from '../../services/apiUrl.service';

@Injectable({
  providedIn: 'root',
})
export class TravelAndOperationsService {
  api: any;
  constructor(
    private http: HttpClient,
    private Auth: AuthService,
    private Base: BaseUrl,
    private ApiUrl: ApiUrl,
    private auth: AuthService
  ) {
    this.api = this.Base.url;
  }
  GetTrav(setYear: any) {
    return this.http.get<any[]>(
      this.Base.url + this.ApiUrl.get_list_Trav(setYear),
      { responseType: 'json' }
    );
  }
  AddTrav(data: any = {}) {
    console.log(data);
    return this.http.post(this.Base.url + this.ApiUrl.post_Trav(), data, {
      responseType: 'json',
    });
  }
  EditTrav(data: any) {
    return this.http.put<any[]>(this.Base.url + this.ApiUrl.put_Trav(), data, {
      responseType: 'json',
    });
  }
  DeleteTrav(transId: any) {
    return this.http.delete(this.Base.url + this.ApiUrl.delete_Trav(transId), {
      responseType: 'text',
    });
  }
  ListOfMunicipality() {
    return this.http.get<any[]>(this.Base.url + this.ApiUrl.get_all_muncity(), {
      responseType: 'json',
    });
  }
}
