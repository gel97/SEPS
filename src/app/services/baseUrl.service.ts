import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
var url = window.location.host;
@Injectable({
  providedIn: 'root',
})
export class BaseUrl {
  // readonly apiurl = "https://davaodelnorte.ph/sep/apidata/api/Auth/login";
  // readonly url = "https://localhost:44396/api"; //IIS
  //readonly url = "https://localhost:7292/api";

  //readonly url = 'https://localhost:7118/api';

  //readonly url = `http://${url}/sepsAPI/api`; for IIS

  readonly url = environment.apiUrl;

  //readonly url = "https://davaodelnorte.ph/sep/apidata/api"
  //readonly url = "https://davaodelnorte.ph/SEPS/api"
  //readonly url = "http://172.16.188.144/SEPApi/api"
}
