import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from 'src/app/services/apiUrl.service';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from 'src/app/services/auth.service';
@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(private http: HttpClient, private ApiUrl: ApiUrl, private Base:BaseUrl ) {}

  GetBarangayReport(data:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_barangay_report(), data, { responseType: 'json' });
  }
  GetCityOfficialsReport(data:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_report_officials(), data, { responseType: 'json' });
  }
  GetGeoProfReport(data:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_report_geo(), data, { responseType: 'json' });
  }
  GetRegvoterReport(data:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_report_regvoter(), data, { responseType: 'json' });
  }
  GetRegSkvoterReport(data:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_report_skVoter(), data, { responseType: 'json' });
  }
  GetProvOfficialReport(data:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_report_prov_officials(), data, { responseType: 'json' });
  }
  
  //Socio-Economic Act
    //Trade and Industry
  GetMajorEcoReport(data:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_report_major_eco(), data, { responseType: 'json' });
  }
  GetManEstabReport(data:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_report_manuf_estab(), data, { responseType: 'json' });
  }
  GetComEstabReport(data:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_report_com_estab(), data, { responseType: 'json' });
  }
  GetIndustrialReport(data:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_report_Industrial(), data, { responseType: 'json' });
  }
  GetFinancialInsReport(data:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_report_financial_Ins(), data, { responseType: 'json' });
  }

  //Tourism
  GetTourismReport(data:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_report_tourism(), data, { responseType: 'json' });
  }

  //Agriculture
  GetAgriProfReport(data:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_report_agriculture_profile(), data, { responseType: 'json' });
  }
  GetAgricultureReport(data:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_report_agriculture(), data, { responseType: 'json' });
  }
  GetAgricultureLivestockReport(data:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_report_agriculture_livestock(), data, { responseType: 'json' });
  }

  //Education
  GetEducationStatReport(data:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_report_education_stat(), data, { responseType: 'json' });
  }
  GetEducationTertiaryReport(data:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_report_education_tertiary(), data, { responseType: 'json' });
  }
  GetEducationTechVocReport(data:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_report_education_techvoc(), data, { responseType: 'json' });
  }
  GetEducationSchoolReport(data:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_report_education_schools(), data, { responseType: 'json' });
  }
  GetEducationTertiaryGradReport(data:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_report_education_tertiary_grad(), data, { responseType: 'json' });
  }
  GetEducationTechVocStatReport(data:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_report_education_techvoc_stat(), data, { responseType: 'json' });
  }
  GetEducationOsyReport(data:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_report_education_osy(), data, { responseType: 'json' });
  }
}
