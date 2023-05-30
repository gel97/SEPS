import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from 'src/app/services/apiUrl.service';

@Injectable({
  providedIn: 'root'
})
export class HousingSubdivisionsService {

  constructor(private http: HttpClient, private ApiUrl: ApiUrl, private Base: BaseUrl) {
  }

  GetSubdivision(setYear: any, munCityId: any) {
    return this.http.get<any[]>(this.Base.url + this.ApiUrl.get_list_housing_subdivision(setYear, munCityId), { responseType: `json` });
  }

  AddSubdivision(subdivisions: any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_housing_subdivision(), subdivisions, { responseType: 'json' });
  }

  EditSubdivision(subdivisions: any) {
    return this.http.put<any[]>(this.Base.url + this.ApiUrl.put_housing_subdivision(), subdivisions, { responseType: 'json' });
  }

  DeleteSubdivision(transId: any) {
    return this.http.delete(this.Base.url + this.ApiUrl.delete_housing_subdivision(transId), { responseType: 'text' });
  }

  GetBarangayList(munCityId: any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_list_barangay(munCityId), { responseType: `json` });
  }



}