import { Injectable } from '@angular/core';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from 'src/app/services/apiUrl.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

// sector-data.service.ts
@Injectable({ providedIn: 'root' })
export class SectorDataService {
  constructor(
    private http: HttpClient,
    private ApiUrl: ApiUrl,
    private Base: BaseUrl
  ) {}

  private municipalitySubject = new BehaviorSubject<any[]>([]);
  public municipalityData$ = this.municipalitySubject.asObservable();

  updateMunicipalities(data: any[]) {
    this.municipalitySubject.next(data);
  }

  get currentMunicipalities(): any[] {
    return this.municipalitySubject.value;
  }
}
