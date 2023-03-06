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

   token:any = localStorage.getItem("token");
   munCityId:any = localStorage.getItem("munCityId");
   munCityName:any = localStorage.getItem("munCityName");
   o_munCityId:any = localStorage.getItem("o_munCityId");
   o_munCityName:any = localStorage.getItem("o_munCityName");
   activeSetYear:any = localStorage.getItem("activeSetYear");
   setYear:any = localStorage.getItem("setYear");
  activesetYear: any;

  constructor(private http:HttpClient) { }

  signin(user:any): Observable<any> {
    console.log(user);
    return this.http.post(this.apiurl,user).pipe(tap((response:any) =>
    {

      localStorage.setItem("token", response.token);
      localStorage.setItem("munCityId", response.munCityId);
      localStorage.setItem("munCityName",response.munCityName);
      localStorage.setItem("o_munCityId", response.munCityId);
      localStorage.setItem("o_munCityName",response.munCityName);
      localStorage.setItem("activeSetYear",response.activeSetYear);
      localStorage.setItem("setYear",response.activeSetYear);
      localStorage.setItem("userData", JSON.stringify(response));
      //console.log(localStorage.getItem("userData"));
      this.token = localStorage.getItem("token");
      this.munCityId = localStorage.getItem("munCityId");
      this.munCityName = localStorage.getItem("munCityName");
      this.o_munCityId = localStorage.getItem("o_munCityId");
      this.o_munCityName = localStorage.getItem("o_munCityName");
      this.activeSetYear = localStorage.getItem("activeSetYear");
      this.setYear = localStorage.getItem("setYear");
      console.log(this.munCityId);

    }));
  }

  clearSession() {
      localStorage.removeItem("token");
      localStorage.removeItem("munCityId");
      localStorage.removeItem("munCityName");
      localStorage.removeItem("activeSetYear");
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
