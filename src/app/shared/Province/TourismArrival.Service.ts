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
export class TourismArrivalService {
  api: any;
  constructor(
    private http: HttpClient,
    private ApiUrl: ApiUrl,
    private Auth: AuthService,
    private Base: BaseUrl
  ) {
    this.api = this.Base.url;
  }
  GetArrival(setYear: any) {
    return this.http.get<any[]>(
      this.Base.url + this.ApiUrl.get_list_Arrival(setYear),
      { responseType: 'json' }
    );
  }
  AddArrival(data: any = {}) {
    console.log(data);
    return this.http.post(this.Base.url + this.ApiUrl.post_Arrival(), data, {
      responseType: 'json',
    });
  }
  EditArrival(data: any) {
    return this.http.put<any[]>(
      this.Base.url + this.ApiUrl.put_Arrival(),
      data,
      { responseType: 'json' }
    );
  }
  DeleteArrival(transId: any) {
    return this.http.delete(
      this.Base.url + this.ApiUrl.delete_Arrival(transId),
      { responseType: 'text' }
    );
  }
  ListOfMunicipality() {
    return this.http.get<any[]>(this.Base.url + this.ApiUrl.get_all_muncity(), {
      responseType: 'json',
    });
  }
  uploadExcel(formData: FormData) {
    return this.http.post<any>(
      this.Base.url + this.ApiUrl.upload_excel_Arrival(),
      formData
    );
  }

  downloadExcel() {
    return this.http.get(
      this.Base.url + this.ApiUrl.download_template_Arrival(),
      {
        responseType: 'blob', // <- important to receive a file
      }
    );
  }
}
