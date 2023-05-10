import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from 'src/app/services/apiUrl.service';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from 'src/app/services/auth.service';
@Injectable({
  providedIn: 'root'
})
export class NotifSeenService {

  constructor(private http: HttpClient, private ApiUrl: ApiUrl, private Base:BaseUrl, private Auth:AuthService ) {}

  GetSeenNotif() :Observable<any[]> {
    return this.http.get<any[]>(this.Base.url + this.ApiUrl.get_notif_seen(this.Auth.userId), { responseType: 'json' });
  }

  SeenNotif(notif:any = {})
  {
    notif.userId = this.Auth.userId;
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_notif_seen(), notif, { responseType: 'json' });
  }
}
