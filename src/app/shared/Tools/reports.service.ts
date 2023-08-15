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
  GetDemographyReport(data:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_report_demography(), data, { responseType: 'json' });
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
  GetEducationReport(data:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_report_education(), data, { responseType: 'json' });
  }
  
  //Health
  GetHealthWorkersReport(data:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_report_health_workers(), data, { responseType: 'json' });
  }
  GetHealthFacilityReport(data:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_report_health_facility(), data, { responseType: 'json' });
  }
  GetHealthSanitaryReport(data:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_report_health_sanitary(), data, { responseType: 'json' });
  }
  GetHealthHandiReport(data:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_report_health_handicap(), data, { responseType: 'json' });
  }
  GetHealthHospitalReport(data:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_report_health_hospital(), data, { responseType: 'json' });
  }

  //Safety
  GetSafetyPoliceReport(data:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_report_safety_police(), data, { responseType: 'json' });
  }
  GetSafetyFireReport(data:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_report_safety_fire(), data, { responseType: 'json' });
  }
  GetSafetyTanodReport(data:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_report_safety_tanod(), data, { responseType: 'json' });
  }
  GetSafetyIndexReport(data:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_report_safety_index(), data, { responseType: 'json' });
  }
  
  //Housing
  GetHousingSettlersReport(data:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_report_housing_settlers(), data, { responseType: 'json' });
  }
  GetHousingProjReport(data:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_report_housing_project(), data, { responseType: 'json' });
  }
  GetHousingSubdvReport(data:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_report_housing_subdivision(), data, { responseType: 'json' });
  }

  //Association
  GetAssociationReport(data:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_report_association(), data, { responseType: 'json' });
  }

  //Infra & Utilities
  GetTranspoRoadReport(data:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_report_transpo_road(), data, { responseType: 'json' });
  }
  GetTranspoBridgesReport(data:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_report_transpo_bridge(), data, { responseType: 'json' });
  }
  GetTranspoPortsReport(data:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_report_port(), data, { responseType: 'json' });
  }
  GetTranspoTerminalsReport(data:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_report_transpo_terminal(), data, { responseType: 'json' });
  }
  GetTelcomReport(data:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_report_telcom(), data, { responseType: 'json' });
  }
  GetCellSitesReport(data:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_report_cell(), data, { responseType: 'json' });
  }
  GetTelFacilityReport(data:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_report_com_telfacility(), data, { responseType: 'json' });
  }
  GetComExpressReport(data:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_report_com_express_mail(), data, { responseType: 'json' });
  }
  GetComPostalReport(data:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_report_com_postal(), data, { responseType: 'json' });
  }
  GetComISPReport(data:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_report_com_isp(), data, { responseType: 'json' });
  }
  GetServiceUtilReport(data:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_report_services(), data, { responseType: 'json' });
  }
  GetStationReport(data:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_report_station(), data, { responseType: 'json' });
  }
  GetServiceIrrigationReport(data:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_report_service_irrigation(), data, { responseType: 'json' });
  }
  GetServiceFacilityReport(data:any) {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_report_service_facility(), data, { responseType: 'json' });
  }
}
