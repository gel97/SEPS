import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BaseUrl {
  // readonly apiurl = "https://davaodelnorte.ph/sep/apidata/api/Auth/login";
  // readonly url = "https://localhost:44396/api"; //IIS
  //readonly url = "https://localhost:7292/api";
  readonly url = 'https://localhost:7118/api';

  //readonly url = "https://davaodelnorte.ph/sep/apidata/api"

  //readonly url = "http://172.16.188.144/SEPApi/api"
}
