import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from 'src/app/services/apiUrl.service';
@Injectable({
    providedIn: 'root'
  })
export class EducationTertiaryGradService {
  api: any;

  constructor(private http: HttpClient, private ApiUrl: ApiUrl, private Base:BaseUrl ) {
    this.api = this.Base.url;
  }

  GetListEducationTertiaryGrad( setYear:any, munCityId:any) :Observable<any[]> {
    return this.http.get<any[]>(this.Base.url + this.ApiUrl.get_list_education_tertiary_grad(setYear, munCityId ), { responseType: 'json' });
  }

  AddEducationTertiaryGrad(education:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_education_tertiary_grad(), education, { responseType: 'json' });
  }

  EditEducationTertiaryGrad(education:any) {
    return this.http.put<any[]>(this.Base.url + this.ApiUrl.put_education_tertiary_grad(), education, { responseType: 'json' });
  }

  DeleteEducationTertiaryGrad(transId:any) {
    return this.http.delete(this.Base.url + this.ApiUrl.delete_education_tertiary_grad(transId), { responseType: 'text' });
  }

  ListOfBarangay(munCityId:any)
  {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_list_barangay(munCityId), { responseType: 'json' });

  }
  Report():Observable<any[]> {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_report_education_tertiary_grad(), { responseType: 'json' });
  }
  
}
