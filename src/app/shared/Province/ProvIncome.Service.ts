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
export class ProvIncomeService {
  api: any;
  constructor(
    private http: HttpClient,
    private ApiUrl: ApiUrl,
    private Auth: AuthService,
    private Base: BaseUrl
  ) {
    this.api = this.Base.url;
  }
  GetIncome(setYear: any) {
    return this.http.get<any[]>(
      this.Base.url + this.ApiUrl.get_list_Income(setYear),
      { responseType: 'json' }
    );
  }
  AddIncome(data: any = {}) {
    console.log(data);
    return this.http.post(this.Base.url + this.ApiUrl.post_Income(), data, {
      responseType: 'json',
    });
  }
  EditIncome(data: any) {
    return this.http.put<any[]>(
      this.Base.url + this.ApiUrl.put_Income(),
      data,
      { responseType: 'json' }
    );
  }
  DeleteIncome(transId: any) {
    return this.http.delete(
      this.Base.url + this.ApiUrl.delete_Income(transId),
      { responseType: 'text' }
    );
  }
  ListOfMunicipality() {
    return this.http.get<any[]>(this.Base.url + this.ApiUrl.get_all_muncity(), {
      responseType: 'json',
    });
  }
}
