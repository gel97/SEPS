import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from 'src/app/services/apiUrl.service';
@Injectable({
    providedIn: 'root'
  })
export class EducationTechVocService {
  api: any;

  constructor(private http: HttpClient, private ApiUrl: ApiUrl, private Base:BaseUrl ) {
    this.api = this.Base.url;
  }

  GetListEducationTechVoc( setYear:any, munCityId:any) :Observable<any[]> {
    return this.http.get<any[]>(this.Base.url + this.ApiUrl.get_list_education_techvoc(setYear, munCityId ), { responseType: 'json' });
  }

  AddEducationTechVoc(education:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_education_techvoc(), education, { responseType: 'json' });
  }

  EditEducationTechVoc(education:any) {
    return this.http.put<any[]>(this.Base.url + this.ApiUrl.put_education_techvoc(), education, { responseType: 'json' });
  }

  DeleteEducationTechVoc(transId:any) {
    return this.http.delete(this.Base.url + this.ApiUrl.delete_education_techvoc(transId), { responseType: 'text' });
  }

  ListOfBarangay(munCityId:any)
  {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_list_barangay(munCityId), { responseType: 'json' });

  }
  Report():Observable<any[]> {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_report_education_techvoc(), { responseType: 'json' });
  }
  Import():Observable<any[]> {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_import_education_techvoc(), { responseType: 'json' });
  }
}
