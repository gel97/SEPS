import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from 'src/app/services/apiUrl.service';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UseUrbanService {
  constructor(
    private Http: HttpClient,
    private Auth: AuthService,
    private Base: BaseUrl,
    private ApiUrl: ApiUrl
  ) {}

  GetUseUrban(): Observable<any[]> {
    return this.Http.get<any[]>(this.Base.url + this.ApiUrl.get_Urban(), {
      responseType: 'json',
    }).pipe(
      retry(3),
      catchError((error) => {
        console.error('API Error:', error);
        return throwError(error);
      })
    );
  }

  AddUseUrban(urban: any = {}) {
    return this.Http.post(this.Base.url + this.ApiUrl.post_Urban(), urban, {
      responseType: 'json',
    });
  }

  UpdateUseUrban(editurban: any = {}) {
  return this.Http.put(
    this.Base.url + this.ApiUrl.post_update_Urban(),
    editurban,
    { responseType: 'text' }  
  );
}

  DeleteUseUrban(transId: any) {
    return this.Http.delete(this.Base.url + this.ApiUrl.delete_Urban(transId), {
      responseType: 'text',
    });
  }
}
