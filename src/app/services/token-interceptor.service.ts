import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { CityOfficialService } from '../shared/Governance/city-official.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(private injector: Injector, private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const auth = this.injector.get(AuthService);
    const service = this.injector.get(CityOfficialService);

    const tokenizedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${auth.getAuthToken()}`
      }
    });

    return next.handle(tokenizedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          //auth.clearSession();
          //this.router.navigate(['/login']);
        }
        return throwError(error);
      })
    );
  }
}
