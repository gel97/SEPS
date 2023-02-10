import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BaseUrl {
   // readonly apiurl = "https://davaodelnorte.ph/sep/apidata/api/Auth/login";
   readonly apiurl = "https://localhost:44396/api/";
}