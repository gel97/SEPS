import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, Observable, retry, tap, throwError } from 'rxjs';
import { Userlogin } from '../models/userlogin';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  
  readonly apiurl = "https://davaodelnorte.ph/sep/apidata/api/Auth/login";

  readonly apiurlUser = "https://davaodelnorte.ph/sep/apidata/api/User";
  readonly baseUrl = "https://davaodelnorte.ph/FMIS/APIData/API";

  
  constructor(private http:HttpClient) { }

  signin(user:any): Observable<any> {
    console.log(user);
    return this.http.post(this.apiurl,user).pipe(tap((response:any) =>
    {
      localStorage.setItem("token", response.token);
      localStorage.setItem("userData", JSON.stringify(response));
    }));  
  }


  
  getUsersList(): Observable<any[]> { // test api only | lag
    return this.http.get<any[]>(this.apiurlUser);
  }

   
  getAuthToken() {
    return localStorage.getItem('token');
    }
    
  public getUserData(){
    return localStorage.getItem('userData');
  }
  public isLoggedIn(){
    return localStorage.getItem('token') !== null;
  }
  public logout(){
    window.location.reload;

    //localStorage.removeItem('token');
  }
}
