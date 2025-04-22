import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from 'src/app/services/apiUrl.service';

@Injectable({
  providedIn: 'root',
})
export class RainInducedService {
  api: any;
  constructor(
    private http: HttpClient,
    private ApiUrl: ApiUrl,
    private Base: BaseUrl
  ) {
    this.api = this.Base.url;
  }
  GetRainIn(setYear: any) {
    return this.http.get<any[]>(
      this.Base.url + this.ApiUrl.get_list_rainInduced(setYear),
      { responseType: 'json' }
    );
  }
  AddRainIn(data: any = {}) {
    console.log(data);
    return this.http.post(
      this.Base.url + this.ApiUrl.post_rainInduced(),
      data,
      { responseType: 'json' }
    );
  }
  EditRainIn(data: any) {
    return this.http.put<any[]>(
      this.Base.url + this.ApiUrl.put_rainInduced(),
      data,
      { responseType: 'json' }
    );
  }
  DeleteSusFlood(transId: any) {
    return this.http.delete(
      this.Base.url + this.ApiUrl.delete_rainInduced(transId),
      { responseType: 'text' }
    );
  }
  ListOfMunicipality() {
    return this.http.get<any[]>(this.Base.url + this.ApiUrl.get_all_muncity(), {
      responseType: 'json',
    });
  }
}
