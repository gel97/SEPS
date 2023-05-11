import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, Observable, retry, tap, throwError } from 'rxjs';
import { BaseUrl } from './baseUrl.service';
@Injectable({
  providedIn: 'root'
})

export class AuthService {
  constructor(private http:HttpClient, private Base:BaseUrl) { }

  readonly apiurl       = this.Base.url + "/Auth/login";
  readonly apiurlGoogle = this.Base.url + "/AuthGoogle";
  readonly apiurlFb     = this.Base.url + "/AuthFb";
  readonly apiurlUser   = this.Base.url + "/User";

  token:any         = localStorage.getItem("token");
  munCityId:any     = localStorage.getItem("munCityId");
  munCityName:any   = localStorage.getItem("munCityName");
  o_munCityId:any   = localStorage.getItem("o_munCityId");
  o_munCityName:any = localStorage.getItem("o_munCityName");
  activeSetYear:any = localStorage.getItem("activeSetYear");
  setYear:any       = localStorage.getItem("setYear");
  userId:any        = localStorage.getItem("userId");

  activesetYear: any;

  signin(user:any): Observable<any> {
    const now = new Date();
    const formattedDate = now.toLocaleString(); // formats the date and time as a string
    console.log(formattedDate); 
    console.log(user);
    return this.http.post(this.apiurl,user).pipe(tap((response:any) =>
    {

      localStorage.setItem("token", response.token);
      localStorage.setItem("userId",response.userId);
      localStorage.setItem("munCityId", response.munCityId);
      localStorage.setItem("munCityName",response.munCityName);
      localStorage.setItem("o_munCityId", response.munCityId);
      localStorage.setItem("o_munCityName",response.munCityName);
      localStorage.setItem("activeSetYear",response.activeSetYear);
      localStorage.setItem("setYear",response.activeSetYear);
      localStorage.setItem("userData", JSON.stringify(response));
      localStorage.setItem("expire",response.expire);

      //console.log(localStorage.getItem("userData"));
      this.token         = localStorage.getItem("token");
      this.userId        = localStorage.getItem("userId");
      this.munCityId     = localStorage.getItem("munCityId");
      this.munCityName   = localStorage.getItem("munCityName");
      this.o_munCityId   = localStorage.getItem("o_munCityId");
      this.o_munCityName = localStorage.getItem("o_munCityName");
      this.activeSetYear = localStorage.getItem("activeSetYear");
      this.setYear       = localStorage.getItem("setYear");
      console.log(this.munCityId);

    }));

   
  }

  signinGoogle(user:any): Observable<any> {
    const now = new Date();
    const formattedDate = now.toLocaleString(); // formats the date and time as a string
    console.log(formattedDate); 
    console.log(user);
    return this.http.post(this.apiurlGoogle,user).pipe(tap((response:any) =>
    {

      localStorage.setItem("token", response.token);
      localStorage.setItem("activeSetYear",response.activeSetYear);
      localStorage.setItem("setYear",response.activeSetYear);
      localStorage.setItem("expire",response.expire);

      this.token = localStorage.getItem("token");
      this.activeSetYear = localStorage.getItem("activeSetYear");
      this.setYear = localStorage.getItem("setYear");
    }));
  }

  signinFb(user:any): Observable<any> {
    const now = new Date();
    const formattedDate = now.toLocaleString(); // formats the date and time as a string
    console.log(formattedDate); 
    console.log(user);
    return this.http.post(this.apiurlFb,user).pipe(tap((response:any) =>
    {

      localStorage.setItem("token", response.token);
      localStorage.setItem("activeSetYear",response.activeSetYear);
      localStorage.setItem("setYear",response.activeSetYear);
      localStorage.setItem("expire",response.expire);

      this.token         = localStorage.getItem("token");
      this.activeSetYear = localStorage.getItem("activeSetYear");
      this.setYear       = localStorage.getItem("setYear");
    }));
  }

  clearSession() {
    localStorage.removeItem("token");
    localStorage.removeItem("munCityId");
    localStorage.removeItem("o_munCityId");
    localStorage.removeItem("o_munCityName");
    localStorage.removeItem("munCityName");
    localStorage.removeItem("activeSetYear");
    localStorage.removeItem("setYear");
    localStorage.removeItem("expire");
    localStorage.removeItem('userData');
    localStorage.removeItem('userId');
    this.o_munCityId = "";
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
    const datenow = new Date();
    var get_expire_token = localStorage.getItem('expire')?.toLowerCase();
    const expire_token = new Date(get_expire_token!);
    return localStorage.getItem('token') !== null && expire_token >= datenow;
  }

  public logout(){
    this.clearSession();
    this.isLoggedIn();
   
  }
}
