import { Injectable } from '@angular/core';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from 'src/app/services/apiUrl.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentService {
  notApplicableModules: string[] = [];
  private readonly moduleKeyToSector: { [key: string]: string } = {
    ENV_Menu1: 'environment',
    ENV_Menu2: 'environment',
    activities: 'environment',
    urban: 'environment',
    hazards: 'environment',
    social: 'socialProfile',
    disaster: 'infrastructure',
  };
  updatedModules: string[] = [];
  constructor(
    private http: HttpClient,
    private ApiUrl: ApiUrl,
    private Base: BaseUrl
  ) {}

  GetEnvironment(menuId: any, setYear: any, munCityId: any) {
    return this.http.get<any[]>(
      this.Base.url +
        this.ApiUrl.get_list_environment(menuId, setYear, munCityId),
      { responseType: 'json' }
    );
  }

  AddEnvironment(environment: any = {}) {
    return this.http.post(
      this.Base.url + this.ApiUrl.post_environment(),
      environment,
      { responseType: 'json' }
    );
  }

  EditEnvironment(environment: any = {}) {
    return this.http.put<any[]>(
      this.Base.url + this.ApiUrl.put_environment(),
      environment,
      { responseType: 'json' }
    );
  }

  DeleteEnvironment(transId: any) {
    return this.http.delete(
      this.Base.url + this.ApiUrl.delete_environment(transId),
      { responseType: 'text' }
    );
  }
  Import(menuId: any): Observable<any[]> {
    return this.http.post<any[]>(
      this.Base.url + this.ApiUrl.post_import_Environment(menuId),
      { responseType: 'json' }
    );
  }

  getGovernanceData(
    setYear: number,
    munCityId: string,
    naModules: string[]
  ): Observable<any> {
    let params = new HttpParams()
      .set('setYear', setYear)
      .set('munCityId', munCityId);

    naModules.forEach((module) => {
      params = params.append('notApplicableModules', module);
    });

    return this.http.get('/api/Menu/sector-percentage-Governance', { params });
  }

  getNA(
    setYear: number,
    munCityId: string,
    notApplicableModules: string[]
  ): Observable<any> {
    let params = new HttpParams()
      .set('setYear', setYear)
      .set('munCityId', munCityId);

    notApplicableModules.forEach((module) => {
      params = params.append('notApplicableModules', module);
    });

    return this.http.get<any>(
      this.Base.url + '/Menu/sector-percentage-Environment',
      { params }
    );
  }

  getSocioEconomicNA(
    setYear: number,
    munCityId: string,
    notApplicableModules: string[]
  ): Observable<any> {
    let params = new HttpParams()
      .set('setYear', setYear)
      .set('munCityId', munCityId);

    notApplicableModules.forEach((module) => {
      params = params.append('notApplicableModules', module);
    });

    return this.http.get<any>(
      this.Base.url + '/Menu/sector-percentage-Socio_Economic_Activity',
      { params }
    );
  }

  getSocialProfNA(
    setYear: number,
    munCityId: string,
    notApplicableModules: string[]
  ): Observable<any> {
    let params = new HttpParams()
      .set('setYear', setYear)
      .set('munCityId', munCityId);

    notApplicableModules.forEach((module) => {
      params = params.append('notApplicableModules', module);
    });

    return this.http.get<any>(
      this.Base.url + '/Menu/sector-percentage-Social_Profile',
      { params }
    );
  }

  getInfraNA(
    setYear: number,
    munCityId: string,
    notApplicableModules: string[]
  ): Observable<any> {
    let params = new HttpParams()
      .set('setYear', setYear)
      .set('munCityId', munCityId);

    notApplicableModules.forEach((module) => {
      params = params.append('notApplicableModules', module);
    });

    return this.http.get<any>(
      this.Base.url + '/Menu/sector-percentage-Infrastructure_and_Utilities',
      { params }
    );
  }

  setNotApplicableModules(modules: string[]) {
    this.notApplicableModules = modules;
  }
  getNotApplicableModules(): string[] {
    return this.notApplicableModules;
  }
  getExcludedSectors(): string[] {
    const sectors = new Set<string>();
    this.notApplicableModules.forEach((key) => {
      const sector = this.moduleKeyToSector[key];
      if (sector) sectors.add(sector);
    });
    return Array.from(sectors);
  }
  setUpdatedModules(modules: string[]): void {
    this.updatedModules = modules;
  }

  getUpdatedModules(): string[] {
    return this.updatedModules;
  }

  isModuleUpdated(key: string): boolean {
    return this.updatedModules.includes(key);
  }
  getNotApplicableModulesFromServer(
    setYear: number,
    munCityId: string,
    userId: string
  ): Observable<string[]> {
    const url =
      this.Base.url +
      this.ApiUrl.get_notApplicableModules(munCityId, setYear, userId);
    return this.http.get<string[]>(url);
  }
  saveNotApplicableModulesToServer(
    userId: string,
    munCityId: string,
    setYear: number,
    moduleKeys: string[]
  ): Observable<any> {
    const url = this.Base.url + this.ApiUrl.post_save_notApplicableModules();
    const body = {
      userId,
      munCityId,
      setYear,
      moduleKeys,
    };
    return this.http.post(url, body);
  }
}
