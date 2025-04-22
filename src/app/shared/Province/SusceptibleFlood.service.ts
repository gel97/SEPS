import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from 'src/app/services/apiUrl.service';

@Injectable({
  providedIn: 'root',
})
export class SusceptibleFloodService {
  api: any;
  constructor(
    private http: HttpClient,
    private ApiUrl: ApiUrl,
    private Base: BaseUrl
  ) {
    this.api = this.Base.url;
  }
  GetSusFlood(setYear: any) {
    return this.http.get<any[]>(
      this.Base.url + this.ApiUrl.get_list_susceptible(setYear),
      { responseType: 'json' }
    );
  }
  AddSusFlood(data: any = {}) {
    console.log(data);
    return this.http.post(
      this.Base.url + this.ApiUrl.post_susceptible(),
      data,
      { responseType: 'json' }
    );
  }
  EditSusFlood(data: any) {
    return this.http.put<any[]>(
      this.Base.url + this.ApiUrl.put_susceptible(),
      data,
      { responseType: 'json' }
    );
  }
  DeleteSusFlood(transId: any) {
    return this.http.delete(
      this.Base.url + this.ApiUrl.delete_susceptible(transId),
      { responseType: 'text' }
    );
  }
  ListOfMunicipality() {
    return this.http.get<any[]>(this.Base.url + this.ApiUrl.get_all_muncity(), {
      responseType: 'json',
    });
  }
}
