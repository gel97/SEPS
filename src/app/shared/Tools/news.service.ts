import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from 'src/app/services/apiUrl.service';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  constructor(private http: HttpClient, private ApiUrl: ApiUrl, private Base:BaseUrl ) {}
  
  
  GetNews() :Observable<any[]> {
    return this.http.get<any[]>(this.Base.url + this.ApiUrl.get_news(), { responseType: 'json' });
  }

  AddNews(news:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_news(), news, { responseType: 'json' });
  }

  EditNews(news:any) {
    return this.http.put<any[]>(this.Base.url + this.ApiUrl.put_news(), news, { responseType: 'json' });
  }

  DeleteNews(transId:any) {
    return this.http.delete(this.Base.url + this.ApiUrl.delete_news(transId), { responseType: 'text' });
  }


}
