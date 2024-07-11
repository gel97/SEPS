import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiUrl } from 'src/app/services/apiUrl.service';
import { AuthService } from 'src/app/services/auth.service';
import { BaseUrl } from 'src/app/services/baseUrl.service';

@Injectable({
  providedIn: 'root',
})
export class TrasportationService {
  getTransportTypes() {
    throw new Error('Method not implemented.');
  }
  constructor(
    private Http: HttpClient,
    private Auth: AuthService,
    private Base: BaseUrl,
    private ApiUrl: ApiUrl,
    private auth: AuthService
  ) {}

  get_list_transpo_road(): Observable<any[]> {
    return this.Http.get<any[]>(
      this.Base.url +
        this.ApiUrl.get_list_transpo_road(
          this.Auth.setYear,
          this.Auth.munCityId
        ),
      { responseType: 'json' }
    );
  }
  post_save_transpo_road(list: any = {}) {
    return this.Http.post(
      this.Base.url + this.ApiUrl.post_save_transpo_road(),
      list,
      { responseType: 'json' }
    );
  }
  put_update_transpo_road(list: any = {}) {
    return this.Http.put(
      this.Base.url + this.ApiUrl.put_update_transpo_road(),
      list,
      { responseType: 'json' }
    );
  }
  delete_transpo_road(transId: any = '') {
    return this.Http.delete(
      this.Base.url + this.ApiUrl.delete_transpo_road(transId),
      { responseType: 'text' }
    );
  }
  post_import_transpo_road(): Observable<any[]> {
    return this.Http.post<any[]>(
      this.Base.url + this.ApiUrl.post_import_transpo_road(),
      { responseType: 'json' }
    );
  }

  post_report_transpo_road(): Observable<any[]> {
    return this.Http.post<any[]>(
      this.Base.url + this.ApiUrl.post_report_transpo_road(),
      { responseType: 'json' }
    );
  }

  get_list_barangay(): Observable<any[]> {
    return this.Http.post<any[]>(
      this.Base.url + this.ApiUrl.post_list_barangay(this.Auth.munCityId),
      { responseType: 'json' }
    );
  }

  get_list_transpo_bridge(): Observable<any[]> {
    return this.Http.get<any[]>(
      this.Base.url +
        this.ApiUrl.get_list_transpo_bridge(
          this.Auth.setYear,
          this.Auth.munCityId
        ),
      { responseType: 'json' }
    );
  }

  post_save_transpo_bridge(list: any = {}) {
    return this.Http.post(
      this.Base.url + this.ApiUrl.post_save_transpo_bridge(),
      list,
      { responseType: 'json' }
    );
  }
  put_update_transpo_bridge(list: any = {}) {
    return this.Http.put(
      this.Base.url + this.ApiUrl.put_update_transpo_bridge(),
      list,
      { responseType: 'json' }
    );
  }
  delete_transpo_bridge(transId: any = '') {
    return this.Http.delete(
      this.Base.url + this.ApiUrl.delete_transpo_bridge(transId),
      { responseType: 'text' }
    );
  }
  post_import_transpo_bridge(): Observable<any[]> {
    return this.Http.post<any[]>(
      this.Base.url + this.ApiUrl.post_import_transpo_bridge(),
      { responseType: 'json' }
    );
  }

  post_report_transpo_bridge(): Observable<any[]> {
    return this.Http.post<any[]>(
      this.Base.url + this.ApiUrl.post_report_transpo_bridge(),
      { responseType: 'json' }
    );
  }

  get_list_transpo_terminal(): Observable<any[]> {
    return this.Http.get<any[]>(
      this.Base.url +
        this.ApiUrl.get_list_transpo_terminal(
          this.Auth.setYear,
          this.Auth.munCityId
        ),
      { responseType: 'json' }
    );
  }

  post_save_transpo_terminal(list: any = {}) {
    return this.Http.post(
      this.Base.url + this.ApiUrl.post_save_transpo_terminal(),
      list,
      { responseType: 'json' }
    );
  }
  put_update_transpo_terminal(list: any = {}) {
    return this.Http.put(
      this.Base.url + this.ApiUrl.put_update_transpo_terminal(),
      list,
      { responseType: 'json' }
    );
  }
  delete_transpo_terminal(transId: any) {
    return this.Http.delete(
      this.Base.url + this.ApiUrl.delete_transpo_terminal(transId),
      { responseType: 'text' }
    );
  }
  post_import_transpo_terminal(): Observable<any[]> {
    return this.Http.post<any[]>(
      this.Base.url + this.ApiUrl.post_import_transpo_terminal(),
      { responseType: 'json' }
    );
  }

  post_report_transpo_terminal(): Observable<any[]> {
    return this.Http.post<any[]>(
      this.Base.url + this.ApiUrl.post_report_transpo_terminal(),
      { responseType: 'json' }
    );
  }
  ListOfTranspoType() {
    return this.Http.get<any[]>(
      this.Base.url + this.ApiUrl.get_list_transpo_terminal_type(),
      { responseType: 'json' }
    );
  }
}
