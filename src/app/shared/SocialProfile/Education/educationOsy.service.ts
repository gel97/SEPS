import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from 'src/app/services/apiUrl.service';
@Injectable({
    providedIn: 'root'
  })
export class EducationOsyService {
  api: any;

  constructor(private http: HttpClient, private ApiUrl: ApiUrl, private Base:BaseUrl ) {
    this.api = this.Base.url;
  }

  GetListEducationOsy(munCityId :any, setYear:any) :Observable<any[]> {
    return this.http.get<any[]>(this.Base.url + this.ApiUrl.get_list_education_osy(setYear, munCityId ), { responseType: 'json' });
  }

  AddEducationOsy(education:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_education_osy(), education, { responseType: 'json' });
  }

  EditEducationOsy(education:any) {
    return this.http.put<any[]>(this.Base.url + this.ApiUrl.put_education_osy(), education, { responseType: 'json' });
  }

  DeleteEducationOsy(transId:any) {
    return this.http.delete(this.Base.url + this.ApiUrl.delete_education_osy(transId), { responseType: 'text' });
  }

  ListOfBarangay(munCityId:any)
  {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_list_barangay(munCityId), { responseType: 'json' });
 
  }
  
}