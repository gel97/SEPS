import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { ApiUrl } from '../../services/apiUrl.service';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AgeGroupService {
  constructor(
    private Http: HttpClient,
    private Auth: AuthService,
    private Base: BaseUrl,
    private ApiUrl: ApiUrl,
    private auth: AuthService
  ) {}

  GetAgeGroup(): Observable<any[]> {
    return this.Http.post<any[]>(
      this.Base.url + this.ApiUrl.post_get_groupage(this.Auth.setYear),
      { responseType: 'json' }
    );
  }

  AddAgeGroup(group: any = {}) {
    console.log(group);
    return this.Http.post(
      this.Base.url + this.ApiUrl.post_save_AgeGroup(),
      group,
      { responseType: 'json' }
    );
  }
  Updateagegroup(group: any = {}) {
    console.log(group);
    return this.Http.put(
      this.Base.url + this.ApiUrl.post_update_agegroup(),
      group,
      {
        responseType: 'json',
      }
    );
  }
  ListBarangay() {
    return this.Http.post<any[]>(
      this.Base.url + this.ApiUrl.post_list_PrkBarangay(this.Auth.munCityId),
      { responseType: 'json' }
    );
  }

  GetAgeGroupList() {
    return this.Http.get<any[]>(
      this.Base.url + this.ApiUrl.get_list_ageGroup(),
      { responseType: `json` }
    );
  }

  GetAgeGroupListByYear() {
    return this.Http.get<any[]>(
      this.Base.url +
        this.ApiUrl.get_list_ageGroupbyYear(
          this.Auth.setYear,
          this.Auth.munCityId
        ),
      { responseType: `json` }
    );
  }

  DeleteAgeGroup(transId: any) {
    return this.Http.delete(
      this.Base.url + this.ApiUrl.delete_agegroup(transId),
      { responseType: 'json' }
    );
  }
}
