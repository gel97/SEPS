import { Injectable } from '@angular/core';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from 'src/app/services/apiUrl.service';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  headers: any = new HttpHeaders().set('Accept', 'application/vnd.ms-excel');

  constructor(
    private http: HttpClient,
    private ApiUrl: ApiUrl,
    private Base: BaseUrl
  ) {}
  GetBarangayReport(data: any) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_barangay_report(),
      data,
      { responseType: 'json' }
    );
  }
  GetDemographyReport(data: any) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_report_demography(),
      data,
      { responseType: 'json' }
    );
  }
  GetDemographyBarangayReport(data: any) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_reportMun_demography_barangay(),
      data,
      { responseType: 'json' }
    );
  }
  GetDemographyReportMun(data: any) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_reportMun_demography(),
      data,
      { responseType: 'json' }
    );
  }
  GetCityOfficialsReport(data: any) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_report_officials(),
      data,
      { responseType: 'json' }
    );
  }
  GetOrgStaffReport(data: any) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_report_org(),
      data,
      { responseType: 'json' }
    );
  }
  GetGeoProfReport(data: any) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_report_geo(),
      data,
      { responseType: 'json' }
    );
  }
  GetGeoProfBrygReport(data: any) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_report_geobrgy(),
      data,
      { responseType: 'json' }
    );
  }
  GetRegvoterReport(data: any) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_report_regvoter(),
      data,
      { responseType: 'json' }
    );
  }
  GetRegvoterMunReport(data: any) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_reportMun_regvoter(),
      data,
      { responseType: 'json' }
    );
  }
  GetRegSkvoterReport(data: any) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_report_skVoter(),
      data,
      { responseType: 'json' }
    );
  }
  GetRegSkMunvoterReport(data: any) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_reportMun_regSKvoter(),
      data,
      { responseType: 'json' }
    );
  }
  GetProvOfficialReport(data: any) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_report_prov_officials(),
      data,
      { responseType: 'json' }
    );
  }
  GetPGOfficialReport(data: any) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_report_pg_officials(),
      data,
      { responseType: 'json' }
    );
  }
  GetFiscalMatterReport(data: any) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_report_fiscal(),
      data,
      { responseType: 'json' }
    );
  }

  //Socio-Economic Act
  //Trade and Industry
  GetMajorEcoReport(data: any) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_report_major_eco(),
      data,
      { responseType: 'json' }
    );
  }
  GetManEstabReport(data: any) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_report_manuf_estab(),
      data,
      { responseType: 'json' }
    );
  }
  GetComEstabReport(data: any) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_report_com_estab(),
      data,
      { responseType: 'json' }
    );
  }
  GetIndustrialReport(data: any) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_report_Industrial(),
      data,
      { responseType: 'json' }
    );
  }
  GetFinancialInsReport(data: any) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_report_financial_Ins(),
      data,
      { responseType: 'json' }
    );
  }
  GetExport_tamplate(apiControllerName: string, munCityId: string) {
    Swal.fire({
      title: 'Exporting Data',
      html: 'Please wait for a moment.',
      timerProgressBar: true,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
        const httpOptions: any = {
          headers: new HttpHeaders({
            Accept:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          }),
          responseType: 'blob',
          observe: 'response',
        };

        this.http
          .get<HttpResponse<Blob>>(
            this.Base.url +
              this.ApiUrl.get_ExExport_temp(apiControllerName, munCityId),
            httpOptions
          )
          .subscribe((response: any) => {
            const contentDispositionHeader = response.headers.get(
              'Content-Disposition'
            );
            const fileNameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            const matches = fileNameRegex.exec(contentDispositionHeader);
            const fileName =
              matches !== null && matches[1]
                ? matches[1].replace(/['"]/g, '')
                : 'file.xlsx';

            const blob = new Blob([response.body], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            Swal.close();
          });
      },
    });
  }

  Get_ExImport(
    file: File,
    setYear: number,
    munCityId: string,
    apiControllerName: string
  ): Observable<boolean> {
    let formdata = new FormData();
    formdata.append('File', file);
    formdata.append('Year', setYear.toString());
    formdata.append('MunCityId', munCityId);

    return this.http
      .post<any[]>(
        this.Base.url + this.ApiUrl.post_ExImport(apiControllerName),
        formdata,
        { responseType: 'json' }
      )
      .pipe(
        map((response: any) => {
          return true;
        }),
        catchError((error: any) => {
          return of(false);
        })
      );
  }
  GetExcelExport(
    setYear: number,
    munCityId: string,
    apiControllerName: string
  ) {
    Swal.fire({
      title: 'Exporting Data',
      html: 'Please wait for a moment.',
      timerProgressBar: true,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
        const httpOptions: any = {
          headers: new HttpHeaders({
            Accept:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          }),
          responseType: 'blob',
          observe: 'response',
        };

        this.http
          .get<HttpResponse<Blob>>(
            this.Base.url +
              this.ApiUrl.get_ExExport(setYear, munCityId, apiControllerName),
            httpOptions
          )
          .subscribe((response: any) => {
            const contentDispositionHeader = response.headers.get(
              'Content-Disposition'
            );
            const fileNameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            const matches = fileNameRegex.exec(contentDispositionHeader);
            const fileName =
              matches !== null && matches[1]
                ? matches[1].replace(/['"]/g, '')
                : 'file.xlsx';

            const blob = new Blob([response.body], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            Swal.close();
          });
      },
    });
  }
  // GetExcelExportWithMenuIdBrgyId(
  //   setYear: number,
  //   munCityId: string,
  //   apiControllerName: string,
  //   menuId: string,
  //   brgyId: string
  // ) {
  //   Swal.fire({
  //     title: 'Exporting Data',
  //     html: 'Please wait for a moment.',
  //     timerProgressBar: true,
  //     allowOutsideClick: false,
  //     didOpen: () => {
  //       Swal.showLoading();
  //       const httpOptions: any = {
  //         headers: new HttpHeaders({
  //           Accept:
  //             'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  //         }),
  //         responseType: 'blob',
  //         observe: 'response',
  //       };

  //       this.http
  //         .get<HttpResponse<Blob>>(
  //           this.Base.url +
  //             this.ApiUrl.get_export_with_menuId_BrgyId(
  //               setYear,
  //               munCityId,
  //               apiControllerName,
  //               menuId,
  //               brgyId
  //             ),
  //           httpOptions
  //         )
  //         .subscribe((response: any) => {
  //           const contentDispositionHeader = response.headers.get(
  //             'Content-Disposition'
  //           );
  //           const fileNameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
  //           const matches = fileNameRegex.exec(contentDispositionHeader);
  //           const fileName =
  //             matches !== null && matches[1]
  //               ? matches[1].replace(/['"]/g, '')
  //               : 'file.xlsx';

  //           const blob = new Blob([response.body], {
  //             type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  //           });

  //           const url = window.URL.createObjectURL(blob);
  //           const a = document.createElement('a');
  //           a.href = url;
  //           a.download = fileName;
  //           document.body.appendChild(a);
  //           a.click();
  //           window.URL.revokeObjectURL(url);
  //           document.body.removeChild(a);
  //           Swal.close();
  //         });
  //     },
  //   });
  // }

  GetExcelExportWithMenuId(
    setYear: number,
    munCityId: string,
    apiControllerName: string,
    menuId: any
  ) {
    Swal.fire({
      title: 'Exporting Data',
      html: 'Please wait for a moment.',
      timerProgressBar: true,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
        const httpOptions: any = {
          headers: new HttpHeaders({
            Accept:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          }),
          responseType: 'blob',
          observe: 'response',
        };
        console.log('Export parameters:', {
          setYear,
          munCityId,
          apiControllerName,
          menuId,
        });
        this.http
          .get<HttpResponse<Blob>>(
            this.Base.url +
              this.ApiUrl.get_export_with_menuId(
                menuId,
                setYear,
                munCityId,
                apiControllerName
              ),
            httpOptions
          )

          .subscribe((response: any) => {
            const contentDispositionHeader = response.headers.get(
              'Content-Disposition'
            );
            const fileNameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            const matches = fileNameRegex.exec(contentDispositionHeader);
            const fileName =
              matches !== null && matches[1]
                ? matches[1].replace(/['"]/g, '')
                : 'file.xlsx';

            const blob = new Blob([response.body], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            Swal.close();
          });
      },
    });
  }

  PostImportWithMenuId(
    file: File,
    setYear: number,
    munCityId: string,
    apiControllerName: string,
    menuId: string
  ): Observable<boolean> {
    let formdata = new FormData();
    formdata.append('File', file);
    formdata.append('Year', setYear.toString());
    formdata.append('MunCityId', munCityId);
    formdata.append('MenuId', menuId);

    return this.http
      .post<any[]>(
        this.Base.url + this.ApiUrl.post_ExImport(apiControllerName),
        formdata,
        { responseType: 'json' }
      )
      .pipe(
        map((response: any) => {
          return true;
        }),
        catchError((error: any) => {
          return of(false);
        })
      );
  }

  //Tourism
  GetTourismReport(data: any) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_report_tourism(),
      data,
      { responseType: 'json' }
    );
  }

  //Agriculture
  GetAgriProfReport(data: any) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_report_agriculture_profile(),
      data,
      { responseType: 'json' }
    );
  }
  GetAgricultureReport(data: any) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_report_agriculture(),
      data,
      { responseType: 'json' }
    );
  }
  GetAgricultureLivestockReport(data: any) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_report_agriculture_livestock(),
      data,
      { responseType: 'json' }
    );
  }

  //Education
  GetEducationStatReport(data: any) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_report_education_stat(),
      data,
      { responseType: 'json' }
    );
  }
  GetEducationTertiaryReport(data: any) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_report_education_tertiary(),
      data,
      { responseType: 'json' }
    );
  }
  GetEducationTechVocReport(data: any) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_report_education_techvoc(),
      data,
      { responseType: 'json' }
    );
  }
  GetEducationSchoolReport(data: any) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_report_education_schools(),
      data,
      { responseType: 'json' }
    );
  }
  GetEducationTertiaryGradReport(data: any) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_report_education_tertiary_grad(),
      data,
      { responseType: 'json' }
    );
  }
  GetEducationTechVocStatReport(data: any) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_report_education_techvoc_stat(),
      data,
      { responseType: 'json' }
    );
  }
  GetEducationOsyReport(data: any) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_report_education_osy(),
      data,
      { responseType: 'json' }
    );
  }
  GetEducationReport(data: any) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_report_education(),
      data,
      { responseType: 'json' }
    );
  }

  //Health
  GetHealthWorkersReport(data: any) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_report_health_workers(),
      data,
      { responseType: 'json' }
    );
  }
  GetHealthFacilityReport(data: any) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_report_health_facility(),
      data,
      { responseType: 'json' }
    );
  }
  GetHealthSanitaryReport(data: any) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_report_health_sanitary(),
      data,
      { responseType: 'json' }
    );
  }
  GetHealthHandiReport(data: any) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_report_health_handicap(),
      data,
      { responseType: 'json' }
    );
  }
  GetHealthHospitalReport(data: any) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_report_health_hospital(),
      data,
      { responseType: 'json' }
    );
  }
  GetHealthPrevRateReport(data: any) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_report_health_prev_rate(),
      data,
      { responseType: 'json' }
    );
  }

  //Safety
  GetSafetyPoliceReport(data: any) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_report_safety_police(),
      data,
      { responseType: 'json' }
    );
  }
  GetSafetyFireReport(data: any) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_report_safety_fire(),
      data,
      { responseType: 'json' }
    );
  }
  GetSafetyTanodReport(data: any) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_report_safety_tanod(),
      data,
      { responseType: 'json' }
    );
  }
  GetSafetyIndexReport(data: any) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_report_safety_index(),
      data,
      { responseType: 'json' }
    );
  }

  //Housing
  GetHousingSettlersReport(data: any) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_report_housing_settlers(),
      data,
      { responseType: 'json' }
    );
  }
  GetHousingProjReport(data: any) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_report_housing_project(),
      data,
      { responseType: 'json' }
    );
  }
  GetHousingSubdvReport(data: any) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_report_housing_subdivision(),
      data,
      { responseType: 'json' }
    );
  }

  //Association
  GetAssociationReport(data: any) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_report_association(),
      data,
      { responseType: 'json' }
    );
  }

  //Infra & Utilities
  GetTranspoRoadReport(data: any) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_report_transpo_road(),
      data,
      { responseType: 'json' }
    );
  }
  GetTranspoBridgesReport(data: any) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_report_transpo_bridge(),
      data,
      { responseType: 'json' }
    );
  }
  GetTranspoPortsReport(data: any) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_report_port(),
      data,
      { responseType: 'json' }
    );
  }
  GetTranspoTerminalsReport(data: any) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_report_transpo_terminal(),
      data,
      { responseType: 'json' }
    );
  }
  GetTelcomReport(data: any) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_report_telcom(),
      data,
      { responseType: 'json' }
    );
  }
  GetCellSitesReport(data: any) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_report_cell(),
      data,
      { responseType: 'json' }
    );
  }
  GetTelFacilityReport(data: any) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_report_com_telfacility(),
      data,
      { responseType: 'json' }
    );
  }
  GetComExpressReport(data: any) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_report_com_express_mail(),
      data,
      { responseType: 'json' }
    );
  }
  GetComPostalReport(data: any) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_report_com_postal(),
      data,
      { responseType: 'json' }
    );
  }
  GetComISPReport(data: any) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_report_com_isp(),
      data,
      { responseType: 'json' }
    );
  }
  GetServiceUtilReport(data: any) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_report_services(),
      data,
      { responseType: 'json' }
    );
  }
  GetStationReport(data: any) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_report_station(),
      data,
      { responseType: 'json' }
    );
  }
  GetServiceIrrigationReport(data: any) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_report_service_irrigation(),
      data,
      { responseType: 'json' }
    );
  }
  GetServiceFacilityReport(data: any) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_report_service_facility(),
      data,
      { responseType: 'json' }
    );
  }
  //ENVIRONMENT
  GetReportEnvironment(data: any) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_report_environment(),
      data,
      { responseType: 'json' }
    );
  }
  GetReportEnvironmentProf(data: any) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_report_environment_prof(),
      data,
      { responseType: 'json' }
    );
  }
  GetReportEnviromentAct(data: any) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_report_EnvAct(),
      data,
      { responseType: 'json' }
    );
  }

  // Summarized report & validation
  GetReportSummarized(year: number) {
    return this.http.get<any[]>(
      this.Base.url + this.ApiUrl.get_report_summarized(year),
      { responseType: 'json' }
    );
  }

  SeenNotif(data: any = {}) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_report_validation(),
      data,
      { responseType: 'json' }
    );
  }

  AddReportValidation(data: any = {}) {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_report_validation(),
      data,
      { responseType: 'json' }
    );
  }

  EditReportValidation(data: any = {}) {
    return this.http.put<any[]>(
      this.Base.url + this.ApiUrl.put_report_validation(),
      data,
      { responseType: 'json' }
    );
  }

  DeleteReportValidation(transId: string = '') {
    return this.http.delete(
      this.Base.url + this.ApiUrl.delete_report_validation(transId),
      { responseType: 'text' }
    );
  }
}
