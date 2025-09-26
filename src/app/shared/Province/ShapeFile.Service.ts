import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from 'src/app/services/apiUrl.service';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ShapeFileService {
  constructor(
    private Http: HttpClient,
    private Auth: AuthService,
    private Base: BaseUrl,
    private ApiUrl: ApiUrl
  ) {}
    uploadShapefile(file: File, setYear: number, name: string): Observable<any> {
    const formData = new FormData();
    formData.append('File', file);       // matches DTO property name
    formData.append('SetYear', setYear.toString());
    formData.append('Name', name);

    return this.Http.post(
      this.Base.url + this.ApiUrl.post_save_shapefile(),
      formData
    );
  }
  getAllShapefiles(): Observable<any[]> {
  return this.Http.get<any[]>(this.Base.url + '/ShapeFile/list');
}

  // Download shapefile
  downloadShapefile(recNo: number): Observable<Blob> {
    return this.Http.get(this.Base.url + this.ApiUrl.get_shapefile(recNo), {
      responseType: 'blob'
    });
  }
}