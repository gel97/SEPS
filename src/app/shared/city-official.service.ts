import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CityOfficialService {
  readonly apiurl = "https://davaodelnorte.ph/SEP/APIDATA/api" // address of api

  constructor(private Http:HttpClient, private Router:Router) { }

//DISPLAY//
  GetOfficial(){ //create function to display
      return this.Http.post<any[]>(this.apiurl + "/MunCityOfficial/GetOfficials", {responseType: 'json'} ); // http . post(=swagger + address)
  }


  //Add Data//
  AddOfficial(Official:any={}){ // get the function from ts + the array that holds your data
  console.log(Official)
  return this.Http.post (this.apiurl + '/MunCityOfficial/SaveOfficial', Official, {responseType: 'json'}); // http.post = swagger + address of api + array that holds your data
 }

 UpdateOfficial(Official:any={}){
  console.log(Official)
  return this.Http.post (this.apiurl + "/MunCityOfficial/Update", Official, {responseType: 'json'} ) ;
 }

 DeleteOfficial(Official:any={}){
  console.log(Official)
  return this.Http.post(this.apiurl + "/MunCityOfficial/Update",Official, {responseType: 'json'} ) ;
 }
 getAuthToken() {
  return localStorage.getItem('token');
  }



}



