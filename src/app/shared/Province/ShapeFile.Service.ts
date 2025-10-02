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
  uploadShapefile(file: File, setYear: number, name: string, munCityId: string): Observable<any> {
  const formData = new FormData();
  formData.append('File', file);
  formData.append('SetYear', setYear.toString());
  formData.append('Name', name);
  formData.append('MunCityId', munCityId); // ✅ directly as string

  return this.Http.post(
    this.Base.url + this.ApiUrl.post_save_shapefile(),
    formData
  );
}
  getAllShapefiles(munCityId?: string): Observable<any[]> {
  let url = this.Base.url + '/ShapeFile/list';
  if (munCityId) {
    url += `/${munCityId}`; // ✅ string in URL
  }
  return this.Http.get<any[]>(url);
}

  // Download shapefile
  downloadShapefile(recNo: number): Observable<Blob> {
    return this.Http.get(this.Base.url + this.ApiUrl.get_shapefile(recNo), {
      responseType: 'blob'
    });
  }

  getAttributes(recNo: number, datasetName?: string): Observable<any[]> {
  let url = this.Base.url + `/ShapeFile/attributes/${recNo}`;
  if (datasetName) {
    url += `?datasetName=${datasetName}`;
  }
  return this.Http.get<any[]>(url);
}


  getArchiveFiles(recNo: number): Observable<{files: string[] }> {
    return this.Http.get<{files: string[] }>(
      this.Base.url + `/ShapeFile/archive-files/${recNo}`
    );
  }
   getDatasets(recNo: number): Observable<Record<string, string[]>> {
    return this.Http.get<Record<string, string[]>>(
      this.Base.url + `/ShapeFile/datasets/${recNo}`
    );
  }
  ListMunCity() {
        return this.Http.get<any[]>(this.Base.url + this.ApiUrl.get_all_muncity(), { responseType: 'json' });
    }
}