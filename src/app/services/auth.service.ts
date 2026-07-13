import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, Observable, retry, tap, throwError } from 'rxjs';
import { BaseUrl } from './baseUrl.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUserId: any;
  userType: string = '';
  files: any;
  menuId(setYear: any, munCityId: any, menuId: any, arg3: string, brgyId: any) {
    throw new Error('Method not implemented.');
  }
  login(username: string, password: string) {
    throw new Error('Method not implemented.');
  }
  constructor(private http: HttpClient, private Base: BaseUrl) {}

  readonly apiurl = this.Base.url + '/Auth/login';
  readonly apiurlGoogle = this.Base.url + '/AuthGoogle';
  readonly apiurlFb = this.Base.url + '/AuthFb';
  readonly apiurlUser = this.Base.url + '/User';
  readonly apiSignOut = this.Base.url + '/Auth/logout';
  readonly apiDatefilter = this.Base.url + '/Auth/logs/filter-by-month';
  readonly apiGetLogs = this.Base.url + '/Auth/logs';

  token: any = localStorage.getItem('token');
  hash: any = localStorage.getItem('hash');
  munCityId: any = localStorage.getItem('munCityId');
  munCityName: any = localStorage.getItem('munCityName');
  brgyId: any = localStorage.getItem('brgyId');
  brgyName: any = localStorage.getItem('brgyName');
  o_munCityId: any = localStorage.getItem('o_munCityId');
  o_munCityName: any = localStorage.getItem('o_munCityName');
  activeSetYear: any = localStorage.getItem('activeSetYear');
  setYear: any = localStorage.getItem('setYear');
  userId: any = localStorage.getItem('userId');
  designation: any = localStorage.getItem('designation');
  activesetYear: any;

  // public get userType(): string {
  //   return localStorage.getItem('designation') || '';
  // }
  // auth.service.ts

public get isValidatorUser(): boolean {

  const cityId = localStorage.getItem('munCityId') || '';
  

  return cityId.startsWith('Validator');
}
public get realMunCityId(): string {
  const cityId = localStorage.getItem('munCityId') || '';
  if (cityId.startsWith('Validator-')) {
    // I-split ang string ug kuhaa ang ikaduha nga parte (ang numeric ID)
    return cityId.split('-')[1]; 
  }
  return cityId;
}
//let httpUrl = environment.apiUrl + "/api/Auth/Login";

  signin(user: any): Observable<any> {
  const loginTime = new Date().toLocaleString();
  const logoutTime = 'Still Logged';
  const now = new Date();
  const formattedDate = now.toLocaleString();
  console.log(formattedDate);
  console.log(user);

  return this.http.post(this.apiurl, user).pipe(
    tap((response: any) => {
      const uData = response?.userData ? response.userData : response;
      const token = uData?.token;

      // Kung walay token (sama sa kaso sa Unregistered HRIS), ayaw i-save sa localStorage apan ayaw sab i-block ang response
      if (!token) return;

      localStorage.setItem('token', token);
      localStorage.setItem('userData', JSON.stringify(response)); 
      localStorage.setItem('expire', response.expire || uData?.expire || '');
      localStorage.setItem('ipAddress', response.ipAddress || '');
      localStorage.setItem('userId', uData?.userId || response.userId || '');
      localStorage.setItem('userType', uData?.userType || response.role || '');
      localStorage.setItem('designation', uData?.designation || response.designation || '');
      localStorage.setItem('hash', response.hash || '');
      localStorage.setItem('munCityId', response.munCityId || '');
      localStorage.setItem('munCityName', response.munCityName || '');
      localStorage.setItem('o_munCityId', response.munCityId || '');
      localStorage.setItem('o_munCityName', response.munCityName || '');
      localStorage.setItem('activeSetYear', response.activeSetYear || '');
      localStorage.setItem('setYear', response.activeSetYear || '');

      this.token = token;
      this.hash = response.hash;
      this.userId = uData?.userId || response.userId;
      this.munCityId = response.munCityId;
      this.munCityName = response.munCityName;
      this.o_munCityId = response.munCityId;
      this.o_munCityName = response.munCityName;
      this.activeSetYear = response.activeSetYear;
      this.setYear = response.activeSetYear;
      this.designation = uData?.designation || response.designation;

      // Create activity log object
      const activityLog = {
        munCityId: response.munCityId,
        munCityName: response.munCityName,
        loginTime: loginTime,
        logoutTime: logoutTime,
        ipAddress: response.ipAddress,
        browserInfo: navigator.userAgent,
        userId: uData?.userId || response.userId,
        role: uData?.userType || response.role,
      };

     
      setTimeout(() => {
        this.http.post(`${this.Base.url}/logs`, activityLog, {
          headers: { 'Authorization': `Bearer ${token}` } 
        }).subscribe({
          next: (logResponse) => console.log('Log recorded successfully:', logResponse),
          error: (error) => console.error('Background log failed (but login is safe):', error)
        });
      }, 500);

      // Save activity logs locally
      let activityLogs = JSON.parse(localStorage.getItem('activityLogs') || '[]');
      activityLogs.push(activityLog);
      localStorage.setItem('activityLogs', JSON.stringify(activityLogs));
    }),
    catchError((error: HttpErrorResponse) => {
      console.error('Login error:', error);
      return throwError(() => error);
    })
  );
}
  
loadExcelFiles() {
  // Gamita ang helper function imbes nga ang raw string gikan sa storage
  const cleanId = this.realMunCityId; 
  
  if (cleanId) {
  
    this.http.get(`${this.apiurl}/lists/${cleanId}`).subscribe((data: any) => {
      this.files = data;
    });
  }
}

  getActivityLogsByMonth(params: any): Observable<any> {
    return this.http.get(this.apiDatefilter, { params }).pipe(
      retry(2),
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching activity logs:', error);
        return throwError(() => new Error('Failed to fetch activity logs'));
      })
    );
  }
  getAllLogs(params: any): Observable<any> {
    return this.http
      .get(`${this.Base.url}/Logs/version1`, { params })
      .pipe(retry(2), catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error fetching activity logs:', error);
    return throwError(() => new Error('Failed to fetch activity logs'));
  }

  getAllActivityLogs(): Observable<any> {
    return this.http.get('api/Logs');
  }

  signOut(out: any): Observable<any> {
    return this.http.post(this.apiSignOut, out).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Logout error:', error);
        return throwError(() => new Error('Logout failed')); 
      })
    );
  }

  // Logs(userId: any) {
  //   return this.http.post;
  // }
  clearActivityLogs() {
    localStorage.removeItem('activityLogs'); 
    console.log('Activity logs cleared.');
  }
  signinGoogle(user: any): Observable<any> {
    const now = new Date();
    const formattedDate = now.toLocaleString(); 
    console.log(formattedDate);
    console.log(user);
    return this.http.post(this.apiurlGoogle, user).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('hash', response.hash);
        localStorage.setItem('activeSetYear', response.activeSetYear);
        localStorage.setItem('setYear', response.activeSetYear);
        localStorage.setItem('expire', response.expire);

        this.token = localStorage.getItem('token');
        this.activeSetYear = localStorage.getItem('activeSetYear');
        this.setYear = localStorage.getItem('setYear');
      })
    );
  }

  signinFb(user: any): Observable<any> {
    const now = new Date();
    const formattedDate = now.toLocaleString(); // formats the date and time as a string
    console.log(formattedDate);
    console.log(user);
    return this.http.post(this.apiurl + '/logout', user).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('activeSetYear', response.activeSetYear);
        localStorage.setItem('setYear', response.activeSetYear);
        localStorage.setItem('expire', response.expire);

        this.token = localStorage.getItem('token');
        this.activeSetYear = localStorage.getItem('activeSetYear');
        this.setYear = localStorage.getItem('setYear');
      })
    );
  }
  setSession(response: any) {
    localStorage.setItem('token', response.token);
    localStorage.setItem('hash', response.hash);
    localStorage.setItem('userId', response.userId);
    localStorage.setItem('munCityId', response.munCityId);
    localStorage.setItem('munCityName', response.munCityName);
    localStorage.setItem('o_munCityId', response.munCityId);
    localStorage.setItem('o_munCityName', response.munCityName);
    localStorage.setItem('activeSetYear', response.activeSetYear);
    localStorage.setItem('setYear', response.activeSetYear);
    localStorage.setItem('userData', JSON.stringify(response));
    localStorage.setItem('expire', response.expire);
    localStorage.setItem('designation', response.designation);
  }

  clearSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('hash');
    localStorage.removeItem('userId');
    localStorage.removeItem('munCityId');
    localStorage.removeItem('o_munCityId');
    localStorage.removeItem('o_munCityName');
    localStorage.removeItem('munCityName');
    localStorage.removeItem('activeSetYear');
    localStorage.removeItem('setYear');
    localStorage.removeItem('expire');
    localStorage.removeItem('userData');
    localStorage.removeItem('userId');
    localStorage.removeItem('designation');
    this.o_munCityId = '';
  }

  getUsersList(): Observable<any[]> {
    // test api only | lag
    return this.http.get<any[]>(this.apiurlUser);
  }

  getAuthToken() {
    return localStorage.getItem('token');
  }

  public getUserData() {
    return localStorage.getItem('userData');
  }
  public isLoggedIn() {
    const expireToken = localStorage.getItem('expire');
    const isTokenPresent = !!localStorage.getItem('token');
    const isTokenValid = expireToken
      ? new Date(expireToken) >= new Date()
      : false;

    return isTokenPresent && isTokenValid;
  }

  public logout() {
    this.clearSession();
    this.isLoggedIn();
  }
}
