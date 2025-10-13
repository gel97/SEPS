import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from '../../services/apiUrl.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private baseUrl = 'https://localhost:7118/api/DataRequests'; // backend base route

  constructor(private http: HttpClient) {}

  // ✅ Get all data requests by municipality
  getDataRequestsByMunicipality(munCityId: string) {
  return this.http.get<any[]>(
    this.baseUrl + '/municipality/' + munCityId,
    { responseType: 'json' }
  );
}

}