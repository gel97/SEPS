import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from 'src/app/services/apiUrl.service';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class PopShareService {
  api: any;
  constructor(
    private http: HttpClient,
    private ApiUrl: ApiUrl,
    private Auth: AuthService,
    private Base: BaseUrl
  ) {
    this.api = this.Base.url;
  }
  GetPopShare(setYear: any) {
    return this.http.get<any[]>(
      this.Base.url + this.ApiUrl.get_list_PopShare(setYear),
      { responseType: 'json' }
    );
  }
  AddPopShare(data: any = {}) {
    console.log(data);
    return this.http.post(this.Base.url + this.ApiUrl.post_PopShare(), data, {
      responseType: 'json',
    });
  }
  EditPopShare(data: any) {
    return this.http.put<any[]>(
      this.Base.url + this.ApiUrl.put_PopShare(),
      data,
      { responseType: 'json' }
    );
  }
  DeletePopShare(transId: any) {
    return this.http.delete(
      this.Base.url + this.ApiUrl.delete_PopShare(transId),
      { responseType: 'text' }
    );
  }
  ListOfMunicipality() {
    return this.http.get<any[]>(this.Base.url + this.ApiUrl.get_all_muncity(), {
      responseType: 'json',
    });
  }
}
