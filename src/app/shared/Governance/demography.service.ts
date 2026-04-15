import { AuthService } from 'src/app/services/auth.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiUrl } from '../../services/apiUrl.service';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DemographyService {
  private apiUrl: string;
  sources$: any;
  readonly apiurl = 'https://davaodelnorte.ph/sep/apidata/api'; // API

  constructor(
    private Http: HttpClient,
    private Auth: AuthService,
    private Base: BaseUrl,
    private ApiUrl: ApiUrl,
    private auth: AuthService
  ) {
    this.apiUrl = `${this.Base.url}/Sources`;
  }
  //sources
  // GET all sources
  getDemoSources(setYear: number, munCityId: string): Observable<any> {
    const url = `${this.apiUrl}/list?setYear=${setYear}&munCityId=${munCityId}`;
    return this.Http.get(url).pipe(retry(1), catchError(this.handleError));
  }

  // POST: create a new source
  createDemoSource(source: any): Observable<any> {
    return this.Http.post(this.apiUrl, source).pipe(
      catchError(this.handleError)
    );
  }

  // PUT: update existing source by ID
  updateDemoSource(id: number, source: any): Observable<any> {
    return this.Http.put(`${this.apiUrl}/${id}`, source).pipe(
      catchError(this.handleError)
    );
  }

  // DELETE: soft-delete source by ID (tag = -1)
  deleteDemoSource(id: number): Observable<any> {
    return this.Http.delete(`${this.apiUrl}/${id}`, {
      responseType: 'text',
    }).pipe(catchError(this.handleError));
  }

  // Error handling
  private handleError(error: any) {
    let errorMessage = '';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server Error: ${error.status}\nMessage: ${error.message}`;
    }

    return throwError(() => errorMessage);
  }

  //DEMOGRAPHY//
  GetDemography(): Observable<any[]> {
    //return this.Http.post<any[]>(this.apiurl + `/Demography/List?munCityId=${this.auth.munCityId}&setYear=${this.auth.activeSetYear}`,{responseType: 'json'} );
    return this.Http.get<any[]>(
      this.Base.url +
        this.ApiUrl.get_demography(this.auth.munCityId, this.auth.setYear),
      { responseType: 'json' }
    );
  }
  AddDemography(Demo: any = {}) {
    console.log(Demo);
    return this.Http.post(this.Base.url + '/Demography/Save', Demo, {
      responseType: 'json',
    });
  }

  UpdateDemography(Demo: any = {}) {
    console.log(Demo);
    return this.Http.post(this.Base.url + '/Demography/Update', Demo, {
      responseType: 'json',
    });
  }

  DeleteDemography(transId: any) {
    return this.Http.delete(
      this.Base.url + this.ApiUrl.delete_demography(transId),
      { responseType: 'json' }
    );
  }

  GetBarangay(): Observable<any[]> {
    const url = this.Base.url + this.ApiUrl.post_get_prkBrgy(this.auth.munCityId, this.auth.setYear);
    return this.Http.post<any[]>(url, {}).pipe(
      catchError(this.handleError)
    );
  }
  GetPurokDemo(munCityId: any, setYear: any) {
  return this.Http.get(`${this.Base.url}/api/PrkDemography/${munCityId}/${setYear}`);
}
ListPurokDemo(): Observable<any[]> {
    const url = this.Base.url + this.ApiUrl.post_get_prkDemoBrgy(this.auth.munCityId, this.auth.setYear);
    return this.Http.post<any[]>(url, {}).pipe(
      catchError(this.handleError)
    );
  }

  ListBarangay() {
    return this.Http.post<any[]>(
      this.Base.url + this.ApiUrl.post_list_barangay(this.Auth.munCityId),
      { responseType: 'json' }
    );
  }

  getAuthToken() {
    return localStorage.getItem('token');
  }

  Report(): Observable<any[]> {
    return this.Http.post<any[]>(
      this.Base.url + this.ApiUrl.post_report_demography(),
      { responseType: 'json' }
    );
  }
  Import(): Observable<any[]> {
    return this.Http.post<any[]>(
      this.Base.url + this.ApiUrl.post_import_demo(),
      {
        responseType: 'json',
      }
    );
  }
  //purok
  AddPrkDemo(PrkDemo: any = {}){
    console.log(PrkDemo);
    return this.Http.post(this.Base.url + '/PrkDemography/Save', PrkDemo, {
      responseType: 'json',
    });
  }
  DeletePrkDemo(transId: any){
    return this.Http.delete(this.Base.url + this.ApiUrl.delete_PrkDemo(transId), {
      responseType: 'text',
    });
  }
  EditPrkDemo(editPrkDemo: any = {}) {
    console.log(editPrkDemo);
    return this.Http.post(
      this.Base.url + this.ApiUrl.post_update_prkDemo(),
      editPrkDemo,
      { responseType: 'json' }
    );
  }
   GetPurokDemoPdf(setYear: number, munCityId: string) {
  return this.Http.get(
    this.Base.url + this.ApiUrl.get_purokDemo_pdf(setYear, munCityId),
    { responseType: 'blob' }
  );
}
}
