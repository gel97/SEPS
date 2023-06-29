import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from 'src/app/services/apiUrl.service';
@Injectable({
    providedIn: 'root'
  })
export class EducationTechVocStatService {
  api: any;

  constructor(private http: HttpClient, private ApiUrl: ApiUrl, private Base:BaseUrl ) {
    this.api = this.Base.url;
  }

  GetListEducationTechVocStat( setYear:any, munCityId:any) :Observable<any[]> {
    return this.http.get<any[]>(this.Base.url + this.ApiUrl.get_list_education_techvoc_stat(setYear, munCityId ), { responseType: 'json' });
  }

  AddEducationTechVocStat(education:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_education_techvoc_stat(), education, { responseType: 'json' });
  }

  AddListEducationTechVocStat(education:any = []) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_list_education_techvoc_stat(), education, { responseType: 'json' });
  }

  EditEducationTechVocStat(education:any) {
    return this.http.put<any[]>(this.Base.url + this.ApiUrl.put_education_techvoc_stat(), education, { responseType: 'json' });
  }

  DeleteEducationTechVocStat(transId:any) {
    return this.http.delete(this.Base.url + this.ApiUrl.delete_education_techvoc_stat(transId), { responseType: 'text' });
  }

  ListOfBarangay(munCityId:any)
  {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_list_barangay(munCityId), { responseType: 'json' });

  }

  GetListEducationTechVoc( setYear:any, munCityId:any) :Observable<any[]> {
    return this.http.get<any[]>(this.Base.url + this.ApiUrl.get_list_education_techvoc(setYear, munCityId ), { responseType: 'json' });
  }

  GetListEducationTechVocPrograms() :Observable<any[]> {
    return this.http.get<any[]>(this.Base.url + this.ApiUrl.get_list_education_programs_techvoc(), { responseType: 'json' });
  }

  Report():Observable<any[]> {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_report_education_techvoc_stat(), { responseType: 'json' });
  }
  
}
