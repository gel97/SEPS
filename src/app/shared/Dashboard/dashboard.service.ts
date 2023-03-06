import { Injectable } from '@angular/core';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  api: any;

  constructor(private baseUrl:BaseUrl ) {
    this.api = this.baseUrl.url;
  }
}
