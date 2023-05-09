import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from 'src/app/services/apiUrl.service';
@Injectable({
    providedIn: 'root'
})

export class TourismService {
    api: any;

    constructor(private http: HttpClient, private ApiUrl: ApiUrl, private Base: BaseUrl) {
        this.api = this.Base.url;
    }

    GetListTourism(menuId: any, setYear: any, munCityId: any) {
        return this.http.get<any[]>(this.Base.url + this.ApiUrl.get_list_tourism(menuId, setYear, munCityId), { responseType: `json` });
    }

    AddTourism(tourism: any) {
        return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_tourism(), tourism, { responseType: 'json' });
    }

    EditTourism(tourism: any) {
        return this.http.put<any[]>(this.Base.url + this.ApiUrl.put_tourism(), tourism, { responseType: 'json' });
    }

    DeleteTourism(transId: any) {
        return this.http.delete(this.Base.url + this.ApiUrl.delete_tourism(transId), { responseType: 'text' });
    }

    GetBarangayList(munCityId: any) {
        return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_list_barangay(munCityId), { responseType: `json` });
    }

}