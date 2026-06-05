import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, NotFoundError, ObservedValueOf, retry } from 'rxjs';
import { environment } from 'src/environments/environment';


const httpOptions = {
  headers: new HttpHeaders({
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor(private http: HttpClient) { }

  //User

  SearchEmployee(term: string | null): Observable<Object> {
    var url = environment.apiUrl + '/User/Search/' + term;
    return this.http.get(url, httpOptions);
  }

  //Agency
  GetAgency() : Observable<any> {
    var url = environment.apiUrl + '/Agency';
    return this.http.get(url, httpOptions);
  }

  getUsersSortByOffice(){
    return this.http.get(environment.apiUrl + '/User/GetUserSortByOffice', httpOptions);
  }

  GetUserRoutes(id: string) : Observable<any> {
    return this.http.get(environment.apiUrl + '/UserRoute/ByUserId/' + id
    , httpOptions);
    }
    SetUserRoutes(route:any) {
    return this.http.post(environment.apiUrl + '/UserRoute/setUserRoutes', route, httpOptions);
  }

  Set_UserStatus(id :any,status: any) {
    return this.http.put(environment.apiUrl + '/User/SetStatus?id=' + id + '&status=' + status, httpOptions);
  }

  Put_UserAccount(id:any,officeId:any,userType:any){
    return this.http.put(environment.apiUrl + '/User?id=' + id + '&officeId=' + officeId + '&userType=' + userType, httpOptions);
  }

  Post_User(data:any) {
    return this.http.post(environment.apiUrl + '/User/Userss', data, httpOptions);
  }

  GetAccessTemplate(userId:any){
    var url = environment.apiUrl + '/Template/AccessTemplate/' + userId;
    return this.http.get(url, httpOptions);
  }

  SetUserAccessTemplate(template:any) {
    return this.http.post(environment.apiUrl + '/Template/SetUserTemplate/', template
    ,httpOptions);
  }
  
}