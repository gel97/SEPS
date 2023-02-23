import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';
import { AuthService } from './auth.service';
import { CityOfficialService } from '../shared/Governance/city-official.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(private injector: Injector) { }
  intercept(req:any, next:any){
    let auth = this.injector.get(AuthService);
    let service = this.injector.get(CityOfficialService);

    let tokenizedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${auth.getAuthToken()}`
      }
    })
  //  console.log(tokenizedReq);
    return next.handle(tokenizedReq);
  }
}
