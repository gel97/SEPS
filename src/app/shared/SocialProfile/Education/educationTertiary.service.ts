import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from 'src/app/services/apiUrl.service';
@Injectable({
    providedIn: 'root'
  })
export class EducationTertiaryService {
  api: any;

  constructor(private http: HttpClient, private ApiUrl: ApiUrl, private Base:BaseUrl ) {
    this.api = this.Base.url;
  }

  GetListEducationTertiary( setYear:any, munCityId:any) :Observable<any[]> {
    return this.http.get<any[]>(this.Base.url + this.ApiUrl.get_list_education_tertiary(setYear, munCityId ), { responseType: 'json' });
  }

  AddEducationTertiary(education:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_education_tertiary(), education, { responseType: 'json' });
  }

  EditEducationTertiary(education:any) {
    return this.http.put<any[]>(this.Base.url + this.ApiUrl.put_education_tertiary(), education, { responseType: 'json' });
  }

  DeleteEducationTertiary(transId:any) {
    return this.http.delete(this.Base.url + this.ApiUrl.delete_education_tertiary(transId), { responseType: 'text' });
  }

  ListOfBarangay(munCityId:any)
  {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_list_barangay(munCityId), { responseType: 'json' });

  }
  Report():Observable<any[]> {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_report_education_tertiary(), { responseType: 'json' });
  }
  Import():Observable<any[]> {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_import_education_tertiary(), { responseType: 'json' });
  }
}
