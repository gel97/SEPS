import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from 'src/app/services/apiUrl.service';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class SubmitService {
  constructor(
    private Http: HttpClient,
    private Auth: AuthService,
    private Base: BaseUrl,
    private ApiUrl: ApiUrl
  ) {}
  uploadSubmit(file: File, setYear: number, munCityId: string): Observable<any> {
  const formData = new FormData();
  formData.append('File', file);
  formData.append('SetYear', setYear.toString());
  formData.append('MunCityId', munCityId); // ✅ directly as string

  return this.Http.post(
    this.Base.url + '/EncoderValidate/upload-excel',
    formData
  );
}
  getAllSubmit(munCityId?: string): Observable<any[]> {
  let url = this.Base.url + '/EncoderValidate/list';
  if (munCityId) {
    url += `/${munCityId}`;
  }
  return this.Http.get<any[]>(url);
}

getAllValidate(munCityId?: string): Observable<any[]> {
  let url = this.Base.url + '/EncoderValidate/lists';
  
  const token = localStorage.getItem('token'); 
  
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  if (munCityId) {
    const cleanId = munCityId.includes('-') ? munCityId.split('-')[1] : munCityId;
    url += `/${cleanId}`; 
  }
  return this.Http.get<any[]>(url, { headers });
}
cancelSubmit(recNo: number): Observable<any> {
    const url = `${this.Base.url}/EncoderValidate/cancel-submission/${recNo}`;
    return this.Http.delete(url);
  }

  
downloadFile(recNo: number): Observable<Blob> {
  const url = `${this.Base.url}/EncoderValidate/download/${recNo}`;
  return this.Http.get(url, {
    responseType: 'blob'
  });
}
validateReport(recNo: number, remarks: string, isApproved: boolean): Observable<any> {
  const payload = {
    recNo: recNo,
    remarks: remarks,
    isApproved: isApproved
  };
  return this.Http.post(`${this.Base.url}/EncoderValidate/validate-report`, payload);
}
  ListMunCity() {
        return this.Http.get<any[]>(this.Base.url + this.ApiUrl.get_all_muncity(), { responseType: 'json' });
    }
}