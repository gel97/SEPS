import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { ApiUrl } from '../../services/apiUrl.service';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { Observable } from 'rxjs';
import { response } from 'express';

@Injectable({
  providedIn: 'root',
})
export class MunCityLocService {
  constructor(
    private Http: HttpClient,
    private Auth: AuthService,
    private Base: BaseUrl,
    private ApiUrl: ApiUrl,
    private auth: AuthService
  ) {}

  GetMunCity(): Observable<any[]> {
    return this.Http.get<any[]>(this.Base.url + this.ApiUrl.get_all_muncity(), {
      responseType: 'json',
    });
  }

  UpdateMunCity(MunLoc: any = {}) {
    console.log(MunLoc);
    return this.Http.post(
      this.Base.url + this.ApiUrl.post_update_muncity(),
      MunLoc,
      { responseType: 'json' }
    );
  }
  // Mun Buildings

  GetBuilding() {
    return this.Http.get<any[]>(
      this.Base.url +
        this.ApiUrl.get_mun_building(this.Auth.munCityId, this.Auth.setYear),
      { responseType: 'json' }
    );
  }

  AddBuilding(MunBuild: any = {}) {
    console.log(MunBuild);
    return this.Http.post(
      this.Base.url + this.ApiUrl.post_save_building(),
      MunBuild,
      {
        responseType: 'json',
      }
    );
  }
  UpdateMunBuilding(MunBuild: any = {}) {
    MunBuild.latitude = Number(MunBuild.latitude);
    MunBuild.longtitude = Number(MunBuild.longtitude);
    console.log(MunBuild);
    return this.Http.post(
      this.Base.url + this.ApiUrl.put_update_Building(),
      MunBuild,
      { responseType: 'json' }
    );
  }

  DeleteBuilding(transId: any) {
    return this.Http.delete(
      this.Base.url + this.ApiUrl.delete_building(transId),
      { responseType: 'json' }
    );
  }
}
