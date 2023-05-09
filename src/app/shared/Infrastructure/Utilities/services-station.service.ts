import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from 'src/app/services/apiUrl.service';

@Injectable({
  providedIn: 'root'
})
export class ServicesStationService {
  constructor(private http: HttpClient, private ApiUrl: ApiUrl, private Base:BaseUrl, private auth:AuthService ) {
    // this.api = this.Base.url;
  }

List_Station(menuId:any,setYear:any,munCityId :any) {
    return this.http.get<any[]>(this.Base.url + this.ApiUrl.get_list_station(menuId,setYear, munCityId), { responseType: 'json' });
  }


  Add_Station(Station:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_station(),Station, { responseType: 'json' });
  }

  Update_Station(Station:any) {
    return this.http.put<any[]>(this.Base.url + this.ApiUrl.put_station(), Station, { responseType: 'json' });
  }

  Delete_Station(transId:any) {
    return this.http.delete(this.Base.url + this.ApiUrl.delete_station(transId), { responseType: 'text' });
  }

  ListBarangay(){
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_list_barangay(this.auth.munCityId), { responseType: 'json' });
}

}
