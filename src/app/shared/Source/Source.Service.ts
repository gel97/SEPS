import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from 'src/app/services/apiUrl.service';

@Injectable({
  providedIn: 'root',
})
export class SourceService {
  private apiUrl: string;

  constructor(
    private http: HttpClient,
    private apiEndpoint: ApiUrl,
    private base: BaseUrl
  ) {
    this.apiUrl = `${this.base.url}/Sources`;
  }
  // SourceService.ts
  private sourcesSubject = new BehaviorSubject<any[]>([]);
  public sources$ = this.sourcesSubject.asObservable();

  getSources(
    setYear: number,
    munCityId: string,
    sourceFor: string
  ): Observable<any> {
    const url = `${this.apiUrl}/list?setYear=${setYear}&munCityId=${munCityId}&sourceFor=${sourceFor}`;
    return this.http.get(url).pipe(retry(1), catchError(this.handleError));
  }

  // POST: create a new source
  createSource(source: any): Observable<any> {
    return this.http
      .post(this.apiUrl, source)
      .pipe(catchError(this.handleError));
  }

  // PUT: update existing source by ID
  updateSource(id: number, source: any): Observable<any> {
    return this.http
      .put(`${this.apiUrl}/${id}`, source)
      .pipe(catchError(this.handleError));
  }

  // DELETE: soft-delete source by ID (tag = -1)
  deleteSource(id: number): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/${id}`, { responseType: 'text' })
      .pipe(catchError(this.handleError));
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
}
