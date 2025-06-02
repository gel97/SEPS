import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from '../../services/apiUrl.service';

@Injectable({
  providedIn: 'root',
})
export class pdfpService {
  api: any;
  constructor(
    private http: HttpClient,
    private ApiUrl: ApiUrl,
    private Base: BaseUrl
  ) {
    this.api = this.Base.url;
  }
  Postpdfp(data: any = {}) {
    console.log(data);
    return this.http.post(this.Base.url + this.ApiUrl.post_save_pdfp(), data, {
      responseType: 'json',
    });
  }
  Postupload(data: any = {}) {
    console.log(data);

    return this.http.post(this.Base.url + this.ApiUrl.post_upload(), data, {
      responseType: 'json',
    });
  }
  ListOfMunicipality() {
    return this.http.get<any[]>(this.Base.url + this.ApiUrl.get_all_muncity(), {
      responseType: 'json',
    });
  }
  Getpdfp(setYear: any, munCityId: any) {
    return this.http.get<any[]>(
      this.Base.url + this.ApiUrl.get_list_pdfp(setYear, munCityId),
      { responseType: 'json' }
    );
  }
}
