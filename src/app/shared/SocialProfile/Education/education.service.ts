import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from 'src/app/services/apiUrl.service';
@Injectable({
    providedIn: 'root'
  })
export class EducationService {
  api: any;

  constructor(private http: HttpClient, private ApiUrl: ApiUrl, private Base:BaseUrl ) {
    this.api = this.Base.url;
  }

  GetListEducation(menuId :any, setYear  :any,munCityId :any) :Observable<any[]> {
    return this.http.get<any[]>(this.Base.url + this.ApiUrl.get_list_education(menuId, setYear, munCityId), { responseType: 'json' });
  }

  AddEducation(education:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_education(), education, { responseType: 'json' });
  }

  EditEducation(education:any) {
    return this.http.put<any[]>(this.Base.url + this.ApiUrl.put_education(), education, { responseType: 'json' });
  }

  DeleteEducation(transId:any) {
    return this.http.delete(this.Base.url + this.ApiUrl.delete_education(transId), { responseType: 'text' });
  }

  Import(menuId: any):Observable<any[]> {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_import_education(menuId), { responseType: 'json' });
  }

  ListOfBarangay(munCityId:any)
  {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_list_barangay(munCityId), { responseType: 'json' });
 
  }
  ListOfAreaEx()
  {
    return this.http.get<any[]>(this.Base.url + this.ApiUrl.get_list_education_area_ex(), { responseType: 'json' });
  }
}