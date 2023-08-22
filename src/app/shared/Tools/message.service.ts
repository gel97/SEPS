import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from '../../services/apiUrl.service';


@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private Http: HttpClient, private Auth: AuthService, private Base: BaseUrl, private ApiUrl: ApiUrl, private auth: AuthService) { }

  GetListMessage():Observable<any[]>{
    return this.Http.get<any[]>(this.Base.url + this.ApiUrl.get_list_message(), { responseType: 'json' });
  }
  GetListMyMessage():Observable<any[]>{
    return this.Http.get<any[]>(this.Base.url + this.ApiUrl.get_list_my_message(), { responseType: 'json' });
  }
  GetListMessageData(userId:string):Observable<any[]>{
    return this.Http.get<any[]>(this.Base.url + this.ApiUrl.get_list_message_data(userId), { responseType: 'json' });
  }

  AddMessage(data: any = {}){
    return this.Http.post(this.Base.url + this.ApiUrl.post_message(),data, { responseType: 'json' });
  }

  UpdateMessage(data:any = {}) {
    return this.Http.put(this.Base.url + this.ApiUrl.put_message(),data, { responseType: 'json' });
  }

  DeleteMessage(transId:any) {
    return this.Http.delete(this.Base.url + this.ApiUrl.delete_message(transId), { responseType: 'json' });
  }

  SeenMessage(transId: any){
    return this.Http.post(this.Base.url + this.ApiUrl.post_message_seen(transId), { responseType: 'json' });
  }

}
