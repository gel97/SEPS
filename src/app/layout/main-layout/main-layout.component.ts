import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ImagesService } from 'src/app/services/image.service';
import { EnvironmentService } from 'src/app/shared/Environment/environment.service';
import { BaseUrl } from 'src/app/services/baseUrl.service';

import {
  Dimensions,
  ImageCroppedEvent,
  ImageCropperComponent,
  LoadedImage,
} from 'ngx-image-cropper';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { catchError } from 'rxjs/internal/operators/catchError';
import { map } from 'rxjs/internal/operators/map';
import Swal from 'sweetalert2';
import { Observable, of } from 'rxjs';
import { concatMap, delay } from 'rxjs/operators';
import * as $ from 'jquery';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import {
  SocialAuthService,
  FacebookLoginProvider,
  SocialUser,
} from 'angularx-social-login';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css'],
})
export class MainLayoutComponent implements OnInit {
  http: any;

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
  @ViewChild('closeModal')
  closeModal!: ElementRef;
  fakeObservable = of('dummy').pipe(delay(100000));

  imageChangedEventt: any = '';
  croppedImagee: any = '';
  file!: File;
  fileName: any = '';
  progressvalue = 0;
  munCityName: any = '';
  isLoading: boolean = true;
  set_year: any;
  active_set_year: any;
  currentUrl: any;
  updatedModules: string[] = [];
  showDashboardAndHeader: boolean = true;
  socioUpdatedModules: string[] = []; // separate array for socio-economic
  socialUpdatedModules: string[] = []; // separate array for social profile
  InfraUpdatedModules: string[] = []; // separate array for Infrastructure
  environmentModules = [
    {
      name: 'Physical Environment Profile',
      route: 'Environment/physical-environment',
      key: 'ENV_Menu1',
    },
    {
      name: 'Natural/ Biological Resources',
      route: 'Environment/natural-resources',
      key: 'ENV_Menu2',
    },
    {
      name: 'Environmental Activities',
      route: 'Environment/environmental-activities',
      key: 'tEnvActivities',
    },
    {
      name: 'Urban Environment Quality',
      route: 'Environment/urban-environment',
      key: 'ENV_Menu4',
    },
    {
      name: 'Environmental Hazards',
      route: 'Environment/environmental-hazards',
      key: 'ENV_Menu5',
    },
    {
      name: 'Social Condition/ Vulnerabilty',
      route: 'Environment/social-condition',
      key: 'ENV_Menu6',
    },
    {
      name: 'Historical Disaster Profile',
      route: 'Environment/historical-disaster',
      key: 'tEnvProfile',
    },
  ];
  governanceModules = [
    {
      name: 'City/Muncipal Officials',
      route: 'gov_cityOfficials',
      key: 'tGovMunCityOffcial',
    },
    {
      name: 'Barangay Officials',
      route: 'gov_Barangays',
      key: 'tGovBarangay',
    },
    {
      name: 'Physical / Geographic Profile',
      route: 'gov_geoProfile',
      key: 'tGovPhyGeoProf',
    },
    {
      name: 'Organization & Staffing Pattern',
      route: 'Governance/org-staffing',
      key: 'tGovOrgStaffPattern',
    },
    {
      name: 'Fiscal Matters',
      route: 'Governance/fiscal-matters',
      key: 'tGovFiscalMatters',
    },
    {
      name: 'Demography',
      route: 'Governance/demography',
      key: 'tGovDemography',
    },
    {
      name: 'Precincts/ Registered Voters',
      route: 'Governance/registered-voters',
      key: 'tGovRegVoters',
    },
    {
      name: 'Precincts/ Registered SK Voters',
      route: 'Governance/sk-voters',
      key: 'tGovRegSkVoters',
    },
    {
      name: 'Municipal/City Locations',
      route: 'Governance/city-location',
      key: 'tRefAddressMun',
    },
    {
      name: 'AgeGroup',
      route: 'Governance/age-group',
      key: 'tGovAgeGroup',
    },
    {
      name: 'Population of Indigenous People',
      route: 'Governance/population-of-indigenous-people',
      key: 'tGovBenificiaries',
    },
  ];
  TradeIndustryModules = [
    {
      name: 'Major Economic Activities',
      route: 'socio-economic/trade-and-industry/major-economic-activities',
      key: 'tTIMjrEcoAct',
    },
    {
      name: 'Manufacturing Establishments',
      route: 'socio-economic/trade-and-industry/manufacturing-establishments',
      key: 'tTIManEstab',
    },
    {
      name: 'Commercial Establishments',
      route: 'socio-economic/trade-and-industry/comercial-establishments',
      key: 'tTIComEstab',
    },
    {
      name: 'Summary - Commercial Est.',
      route: 'socio-economic/trade-and-industry/summary-commercial',
      key: 'tTIComEstab',
    },
    {
      name: 'Industrial Estates',
      route: 'socio-economic/trade-and-industry/industrial-estates',
      key: 'tTIIndEst',
    },
    {
      name: 'Financial Institutions',
      route: 'socio-economic/trade-and-industry/financial-institutions',
      key: 'tTIFinIns',
    },
  ];
  tourismModules = [
    {
      name: 'Resorts',
      route: 'socio-economic/Tourism/resorts',
      key: 'tSEATourism_Menu1',
    },
    {
      name: 'Recreation Facilities',
      route: 'socio-economic/Tourism/recreation-facilities',
      key: 'tSEATourism_Menu2',
    },
    {
      name: 'Lodging Houses',
      route: 'socio-economic/Tourism/hotels-lodging-houses',
      key: 'tSEATourism_Menu3',
    },
    {
      name: 'Cinema/ Movie Houses',
      route: 'socio-economic/Tourism/cinema-movie-houses',
      key: 'tSEATourism_Menu4',
    },
    {
      name: 'Natural/ Man-made Tourist Attractions',
      route: 'socio-economic/Tourism/naturals-attractions',
      key: 'tSEATourism_Menu5',
    },
    {
      name: 'Cultural/ Religious Attractions',
      route: 'socio-economic/Tourism/cultural-attractions',
      key: 'tSEATourism_Menu6',
    },
    {
      name: 'Fiestas and Festivals',
      route: 'socio-economic/Tourism/festival-attractions',
      key: 'tSEATourism_Menu7',
    },
  ];
  agricultureModules = [
    {
      name: 'Agricultural Profile',
      route: 'socio-economic/Agriculture/agricultural-profile',
      key: 'tSEAAgriProf',
    },
    {
      name: 'Rice/ Crops Production',
      route: 'socio-economic/Agriculture/rice-crops-production',
      key: 'tSEAAgri_Menu2',
    },
    {
      name: 'Fisheries/ Aquaculture',
      route: 'socio-economic/Agriculture/fisheries-aquaculture',
      key: 'tSEAAgri_Menu3',
    },
    {
      name: 'Livestock / Poultry',
      route: 'socio-economic/Agriculture/livestock-production',
      key: 'tSEAAgriLivestock',
    },
    {
      name: 'Ricemills',
      route: 'socio-economic/Agriculture/ricemills',
      key: 'tSEAAgri_Menu5',
    },
    {
      name: 'Warehouses',
      route: 'socio-economic/Agriculture/warehouses',
      key: 'tSEAAgri_Menu6',
    },
    {
      name: 'Slaughterhouses',
      route: 'socio-economic/Agriculture/slaughterhouses',
      key: 'tSEAAgri_Menu7',
    },
  ];
  facilitiesModules = [
    {
      name: 'Public and Private',
      route: 'socialProfile/education/facilities/public-private',
      key: 'tSPEducationStat',
    },
    {
      name: 'Tertiary Ins.',
      route: 'socialProfile/education/facilities/tertiary-institutions',
      key: 'tSPEducationTertiary',
    },
    {
      name: 'Technical Vocational Ins.',
      route: 'socialProfile/education/facilities/techvoc-institutions',
      key: 'tSPEducationTechVoc',
    },
  ];
  privateModules = [
    {
      name: 'Elementary/ Pre-elementary',
      route: 'socialProfile/education/private/elementary',
      key: 'tEducationSchools_Menu1',
    },
    {
      name: 'Secondary',
      route: 'socialProfile/education/private/secondary',
      key: 'tEducationSchools_Menu2',
    },
  ];
  publicModules = [
    {
      name: 'Day Care Centers',
      route: 'socialProfile/education/public/day-care',
      key: 'tEducationSchools_Menu3',
    },
    {
      name: 'Elementary/ Pre-elementary',
      route: 'socialProfile/education/public/elementary',
      key: 'tEducationSchools_Menu4',
    },
    {
      name: 'Secondary',
      route: 'socialProfile/education/public/pub-secondary',
      key: 'tEducationSchools_Menu5',
    },
  ];
  TertiaryModules = [
    {
      name: 'Enrolment',
      route: 'socialProfile/education/public/tertiary-enrolment',
      key: 'tSPEducationTertiary',
    },
    {
      name: 'Graduates',
      route: 'socialProfile/education/public/tertiary-graduates',
      key: 'tSPEducationTertiaryGrad',
    },
  ];
  techvocModules = [
    {
      name: 'Programs',
      route: 'socialProfile/education/public/tech-voc/programs',
      key: 'tSPEducationTechVoc',
    },
    {
      name: 'Enrolment & Graduates',
      route: 'socialProfile/education/public/tech-voc/enrolment-graduates',
      key: 'tSPEducationTechVoc',
    },
  ];
  othersModules = [
    {
      name: 'Training Centers',
      route: 'socialProfile/education/public/training-center',
      key: 'tSPEducation_Menu8',
    },
    {
      name: 'SPED Enrolments',
      route: 'socialProfile/education/public/spedenrolments',
      key: 'tSPEducation_Menu9',
    },
    {
      name: 'Out of School Youth',
      route: 'socialProfile/education/public/oschool-youth',
      key: 'tSPEducationOsy',
    },
  ];
  healthModules = [
    {
      name: 'Public Health Service Workers',
      route: 'socialProfile/health/public-health',
      key: 'tSPHealthWorkers',
    },
    {
      name: 'RHU / Community Hospital',
      route: 'socialProfile/health/community-hospital',
      key: 'Facilities_Menu2',
    },
    {
      name: 'Barangay Health Stations',
      route: 'socialProfile/health/barangay-health',
      key: 'Facilities_Menu3',
    },
    {
      name: 'Private Hospitals/ Clinics',
      route: 'socialProfile/health/private-hospital',
      key: 'Facilities_Menu4',
    },
    {
      name: 'Sanitary/Water Facilities',
      route: 'socialProfile/health/sanitary-facilities',
      key: 'tSPHealthSanitary',
    },
    {
      name: 'Malnutrition (Revised Form)',
      route: 'socialProfile/health/malnutrition-revised',
      key: 'tSPHealthMalnut',
    },
    {
      name: 'Prevalence Rate',
      route: 'socialProfile/health/prevalence-rate',
      key: 'tSPHealthPrevRate',
    },
    {
      name: 'Persons with Disability',
      route: 'socialProfile/health/person-disability',
      key: 'tSPHealthHandi',
    },
    // {
    //   name: 'Provincial/ District Hospitals',
    //   route: 'socialProfile/health/provincial-hospital',
    //   key: 'tSPHealthHosp',
    // },
    {
      name: 'Provincial Health Profile',
      route: 'socialProfile/health/provincial-health',
      key: 'tSPHealthProf',
    },
  ];
  publicorderModules = [
    {
      name: 'Police Services',
      route: 'socialProfile/PublicOrder/police-services',
      key: 'tSPSafetyPoliceServices',
    },
    {
      name: 'Fire Protection Services',
      route: 'socialProfile/PublicOrder/fire-protection',
      key: 'tSPSafetyFireProtection',
    },
    {
      name: 'Barangay Peacekeeping/ Tanod',
      route: 'socialProfile/PublicOrder/barangay-peacekeeping',
      key: 'tSPSafetyTanod',
    },
    {
      name: 'Crime Statistics',
      route: 'socialProfile/PublicOrder/crime-stat',
      key: 'tSPSafetyStat',
    },
    {
      name: 'No. of Index Crime',
      route: 'socialProfile/PublicOrder/index-crime',
      key: 'tSPSafetyIndexCrime',
    },
  ];
  housingModules = [
    {
      name: 'Informal Settlers',
      route: 'socialProfile/Housing/informal-settlers',
      key: 'tSPHousingSettlers',
    },
    {
      name: 'Government Housing Projects',
      route: 'socialProfile/Housing/government-housing',
      key: 'tSPHousingProj',
    },
    {
      name: 'Subdivisions',
      route: 'socialProfile/Housing/subdivisions',
      key: 'tSPHousingSubdv',
    },
  ];
  associationModules = [
    {
      name: 'Civic Organizations',
      route: 'socialProfile/Associations/civic-org',
      key: 'Association_Menu1',
    },
    {
      name: 'Religious',
      route: 'socialProfile/Associations/religious',
      key: 'Association_Menu2',
    },
    {
      name: 'Professional',
      route: 'socialProfile/Associations/professional',
      key: 'Association_Menu3',
    },
    {
      name: 'Commercial/Industrial/Labor',
      route: 'socialProfile/Associations/commercial',
      key: 'Association_Menu4',
    },
    {
      name: 'Cooperatives',
      route: 'socialProfile/Associations/cooperatives',
      key: 'Association_Menu5',
    },
    {
      name: 'Foundations',
      route: 'socialProfile/Associations/foundations',
      key: 'Association_Menu6',
    },
    {
      name: 'Sectoral',
      route: 'socialProfile/Associations/sectoral',
      key: 'Association_Menu7',
    },
  ];
  infraModules = [
    {
      name: 'Telecommunication Systems',
      route: 'Infrastructure/Communications/telecommunication',
      key: 'tIUCTelcoSystem',
    },
    {
      name: 'Cell Sites/ Towers',
      route: 'Infrastructure/Communications/cell-sites',
      key: 'tIUCCellSites',
    },
    {
      name: 'Telegraph Facilities',
      route: 'Infrastructure/Communications/telegraph',
      key: 'tIUCTelFacilities',
    },
    {
      name: 'Express Mail',
      route: 'Infrastructure/Communications/express-mail',
      key: 'tIUCExpressMail',
    },
    {
      name: 'Postal Services',
      route: 'Infrastructure/Communications/postal-services',
      key: 'tIUCPostalServices',
    },
    {
      name: 'Internet Service Providers',
      route: 'Infrastructure/Communications/internet-service',
      key: 'tIUCISP',
    },
  ];
  transportModules = [
    {
      name: 'Roads',
      route: 'Insfrastructure/Transportation/roads',
      key: 'tIUTRoads',
    },
    {
      name: 'Bridges',
      route: 'Insfrastructure/Transportation/bridges',
      key: 'tIUTBridges',
    },
    {
      name: 'Transport Terminals',
      route: 'Insfrastructure/Transportation/transport-terminals',
      key: 'tIUTTransport',
    },
    {
      name: 'Ports',
      route: 'Insfrastructure/Transportation/ports',
      key: 'tIUTPorts',
    },
  ];
  utilityModules = [
    {
      name: 'Water Utility Service Provider',
      route: 'Infrastructure/Utility/water-utility',
      key: 'Utilities_Menu1',
    },
    {
      name: 'Water Pump Stations',
      route: 'Infrastructure/Utility/water-pump',
      key: 'Stations_Menu2',
    },
    {
      name: 'Irrigation Systems',
      route: 'Infrastructure/Utility/irrigation-system',
      key: 'tIUUSIrrigation',
    },
    {
      name: 'Power System Utilities',
      route: 'Infrastructure/Utility/power-system',
      key: 'Utilities_Menu4',
    },
    {
      name: 'Power Sub-stations',
      route: 'Infrastructure/Utility/power-sub',
      key: 'Stations_Menu5',
    },
    {
      name: 'Waste Management Facilities',
      route: 'Infrastructure/Utility/waste-management',
      key: 'Facilities_Menu6',
    },
    {
      name: 'Ice Plant/ Cold Storage',
      route: 'Infrastructure/Utility/ice-plant',
      key: 'Facilities_Menu7',
    },
    {
      name: 'Market/ Supermarkets',
      route: 'Infrastructure/Utility/market-supermarkets',
      key: 'Facilities_Menu8',
    },
    {
      name: 'Department Stores',
      route: 'Infrastructure/Utility/department-store',
      key: 'Facilities_Menu9',
    },
    {
      name: 'Cemetery/ Memorial Parks',
      route: 'Infrastructure/Utility/ memorial-parks',
      key: 'Facilities_Menu10',
    },
    {
      name: 'Churches/ Worship Houses',
      route: 'Infrastructure/Utility/worship-houses',
      key: 'Facilities_Menu11',
    },
    {
      name: 'Other Structures',
      route: 'Infrastructure/Utility/other-structure',
      key: 'Facilities_Menu12',
    },
  ];
  notApplicableModules: string[] = [];
  confirmModule: any = null;

  constructor(
    private service: AuthService,
    private auth: AuthService,
    private router: Router,
    private baseUrl: BaseUrl,
    private imagesService: ImagesService,
    private socialAuthService: SocialAuthService,
    private modifyService: ModifyCityMunService,
    private Service: EnvironmentService,
    private location: Location,
    private cdRef: ChangeDetectorRef
  ) {
    console.log(router.url);

    // this.router.events.pipe(
    //   filter(event => event instanceof NavigationEnd)
    // ).subscribe(event => {

    //   console.log(event);
    // });
    this.currentUrl = this.location.path();
  }

  _userData: any = {};
  userInfo: any = {};
  guest: any;

  ngOnInit(): void {
    const munCityId = this.getMunCityId();
    const userId = this.auth.userId;

    // 1. Load from server
    this.Service.getNotApplicableModulesFromServer(
      this.auth.activeSetYear,
      munCityId,
      userId
    ).subscribe({
      next: (serverModules) => {
        this.notApplicableModules = serverModules || [];

        // Optional: sync to localStorage too
        localStorage.setItem(
          `notApplicableModules_${munCityId}`,
          JSON.stringify(this.notApplicableModules)
        );

        this.Service.setNotApplicableModules(this.notApplicableModules);

        // Load charts using correct modules
        this.getNA(this.auth.activeSetYear, munCityId);
        this.getSocioNA(this.auth.activeSetYear, munCityId);
        this.getSocialNA(this.auth.activeSetYear, munCityId);
        this.getInfraNA(this.auth.activeSetYear, munCityId);
        this.loadGovernanceData(); // ← don't forget governance if needed
      },
      error: (err) => {
        console.warn('[ngOnInit] ⚠️ Server NA load failed, fallback to local');

        // 2. Fallback: load from localStorage
        const saved = localStorage.getItem(`notApplicableModules_${munCityId}`);
        if (saved) {
          this.notApplicableModules = JSON.parse(saved);
          this.Service.setNotApplicableModules(this.notApplicableModules);
        }

        // Proceed anyway
        this.getNA(this.auth.activeSetYear, munCityId);
        this.getSocioNA(this.auth.activeSetYear, munCityId);
        this.getSocialNA(this.auth.activeSetYear, munCityId);
        this.getInfraNA(this.auth.activeSetYear, munCityId);
        this.loadGovernanceData();
      },
    });
    this.showDashboardAndHeader = false;
    console.log('currentUrl: ', this.currentUrl);
    this.guest = localStorage.getItem('guest');

    this.set_year = this.service.setYear;
    this.active_set_year = this.service.activeSetYear;
    this._userData = this.service.getUserData();
    this.munCityName =
      this.guest && this.service.munCityId === 'null'
        ? 'Province of Davao del Norte'
        : this.service.munCityName;
    this.userInfo = JSON.parse(this._userData);

    this.imagesService
      .GetLogo(
        this.guest && this.service.munCityId === 'null'
          ? 'ddn'
          : this.service.munCityId
      )
      .pipe(
        concatMap((item) => of(item).pipe(delay(2000))),
        catchError((error: any, caught: Observable<any>): Observable<any> => {
          console.error('There was an error!', error);
          if (error) {
            this.isLoading = false;
          }
          return of();
        })
      )
      .subscribe((response) => {
        const reader = new FileReader();
        reader.readAsDataURL(response);
        reader.onload = () => {
          if (reader.result) {
            this.croppedImagee = reader.result.toString();
            this.isLoading = false;
          }
        };
      });
  }
  loadGovernanceData() {
    throw new Error('Method not implemented.');
  }

  getMunCityId(): string {
    // Try to get from service, fallback to localStorage, or return empty string
    return this.service.munCityId || localStorage.getItem('munCityId') || '';
  }
  isModuleNA(key: string): boolean {
    return this.notApplicableModules.includes(key);
  }
  promptMarkAsNA(module: any) {
    this.confirmModule = module;
  }
  confirmNA(): void {
    if (this.confirmModule) {
      const key = this.confirmModule.key;
      const munCityId = this.getMunCityId();
      const userId = this.auth.userId; // <- Make sure `auth.userId` exists

      if (!this.notApplicableModules.includes(key)) {
        this.notApplicableModules.push(key);

        // Save to localStorage for fast local use
        localStorage.setItem(
          `notApplicableModules_${munCityId}`,
          JSON.stringify(this.notApplicableModules)
        );

        // Save to server for persistence across devices
        this.Service.saveNotApplicableModulesToServer(
          userId,
          munCityId,
          this.auth.activeSetYear,
          this.notApplicableModules
        ).subscribe({
          next: () => console.log('[confirmNA] ✅ Saved to server'),
          error: (err) =>
            console.error('[confirmNA] ❌ Server save failed:', err),
        });

        this.Service.setNotApplicableModules(this.notApplicableModules); // Optional: sync service
      }

      this.confirmModule = null;
    }
  }

  cancelNA() {
    this.confirmModule = null;
  }
  enableModule(key: string) {
    this.notApplicableModules = this.notApplicableModules.filter(
      (k) => k !== key
    );

    const munCityId = this.getMunCityId();
    localStorage.setItem(
      `notApplicableModules_${munCityId}`,
      JSON.stringify(this.notApplicableModules)
    );

    this.getNA(this.auth.activeSetYear, munCityId);
  }
  goToFirstUpdatedModule(modules: any[]): void {
    const firstKey = this.updatedModules[0];
    const module = modules.find((m) => m.key === firstKey);
    if (module) {
      this.router.navigate([module.route], {
        queryParams: { updated: 'true' }, // 👈 mark it as updated
      });
    }
  }

  isModuleUpdated(key: string): boolean {
    return this.updatedModules?.includes(key);
  }
  getUpdatedSocioModuleNames(): string[] {
    const allModules = [
      ...this.TradeIndustryModules,
      ...this.tourismModules,
      ...this.agricultureModules,
      ...this.facilitiesModules,
      ...this.privateModules,
      ...this.publicModules,
      ...this.TertiaryModules,
      ...this.techvocModules,
      ...this.othersModules,
      ...this.governanceModules,
      ...this.environmentModules,
      ...this.healthModules,
      ...this.publicorderModules,
      ...this.housingModules,
      ...this.infraModules,
      ...this.associationModules,
      ...this.utilityModules,
    ];

    const updatedKeys = new Set([
      ...this.socioUpdatedModules,
      ...this.socialUpdatedModules,
      ...this.InfraUpdatedModules,
    ]);

    return allModules
      .filter((m) => m && m.key && updatedKeys.has(m.key)) // ensure safety
      .map((m) => m.name);
  }

  getNA(setYear: number, munCityId: string): void {
    this.Service.getNA(setYear, munCityId, this.notApplicableModules).subscribe(
      (response) => {
        console.log('[getNA] ✅ Full response:', response);

        const socioModules = response?.TotalSocioEconomic?.updatedModules || [];
        const socialModules =
          response?.TotalSocialProfile?.updatedModules || [];
        const infraModules =
          response?.TotalInfrastructure?.updatedModules || [];

        this.updatedModules = Array.from(
          new Set([...socioModules, ...socialModules, ...infraModules])
        );

        console.log(
          '[getNA] ✅ Combined updated modules:',
          this.updatedModules
        );
      },
      (error) => {
        console.error('[getNA] ❌ Error fetching NA data:', error);
        // this.notificationService.error('Failed to fetch NA data'); // Optional
      }
    );
  }

  getSocioNA(setYear: number, munCityId: string): void {
    this.Service.getSocioEconomicNA(
      setYear,
      munCityId,
      this.notApplicableModules
    ).subscribe(
      (response) =>
        this.handleNAResponse(
          response,
          'TotalSocioEconomic',
          'socioUpdatedModules'
        ),
      (error) => {
        console.error(
          '[getSocioNA] ❌ Error fetching Socio-Economic data:',
          error
        );
        // this.notificationService.error('Failed to fetch Socio-Economic data');
      }
    );
  }

  getSocialNA(setYear: number, munCityId: string): void {
    this.Service.getSocialProfNA(
      setYear,
      munCityId,
      this.notApplicableModules
    ).subscribe(
      (response) =>
        this.handleNAResponse(
          response,
          'TotalSocialProfile',
          'socialUpdatedModules'
        ),
      (error) => {
        console.error(
          '[getSocialNA] ❌ Error fetching Social Profile data:',
          error
        );
        // this.notificationService.error('Failed to fetch Social Profile data');
      }
    );
  }

  getInfraNA(setYear: number, munCityId: string): void {
    this.Service.getInfraNA(
      setYear,
      munCityId,
      this.notApplicableModules
    ).subscribe(
      (response) =>
        this.handleNAResponse(
          response,
          'TotalInfrastructure',
          'InfraUpdatedModules'
        ),
      (error) => {
        console.error(
          '[getInfraNA] ❌ Error fetching Infrastructure data:',
          error
        );
        // this.notificationService.error('Failed to fetch Infrastructure data');
      }
    );
  }

  // Generic response handler
  private handleNAResponse(
    response: any,
    key: 'TotalSocioEconomic' | 'TotalSocialProfile' | 'TotalInfrastructure',
    stateKey:
      | 'socioUpdatedModules'
      | 'socialUpdatedModules'
      | 'InfraUpdatedModules'
  ): void {
    this[stateKey] = response?.[key]?.updatedModules || [];
    this.Service.setUpdatedModules(this[stateKey]);
    this.cdRef.detectChanges();
    console.log(`[${key}] ✅ Updated modules:`, this[stateKey]);
  }

  isMatchURL: boolean = false;
  isMatchUrl(text: string) {
    if (this.currentUrl.includes(text)) {
      console.log(`The main string contains the specific text "${text}".`);
      return true;
    } else {
      console.log(
        `The main string does not contain the specific text "${text}".`
      );
      return false;
    }
  }

  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }
  backtohome() {
    var o_munCityId = localStorage.getItem('o_munCityId');
    var o_munCityName = localStorage.getItem('o_munCityName');

    //localStorage.setItem("setYear", this.set_year);
    localStorage.setItem('munCityId', o_munCityId!);
    localStorage.setItem('munCityName', o_munCityName!);
    window.location.reload();
  }

  dataURItoBlob(dataURI: any) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  fileChangeEventt(event: any): void {
    this.imageChangedEventt = event;
    this.fileName = event.target.files[0].name;
  }
  imageCroppedd(event: ImageCroppedEvent) {
    this.croppedImagee = event.base64;
  }
  imageLoadedd(image: LoadedImage) {}
  cropperReadyy(crop: Dimensions) {
    console.log('crop: ', crop);
  }
  loadImageFailedd() {}
  updateImage() {
    const imageBlob = this.dataURItoBlob(this.croppedImagee);
    const imageFile = new File([imageBlob], this.fileName);
    this.file = imageFile;
    this.ProceedUpload();
    console.log('imageFile: ', this.file);
  }
  ProceedUpload() {
    let formdata = new FormData();
    formdata.append('file', this.file, this.service.munCityId);

    this.imagesService
      .UploadLogo(formdata)
      .pipe(
        map((events) => {
          switch (events.type) {
            case HttpEventType.UploadProgress:
              this.progressvalue = Math.round(
                (events.loaded / events.total!) * 100
              );
              break;
            case HttpEventType.Response:
              Swal.fire({
                icon: 'success',
                title: 'Image uploaded successfully!',
                showConfirmButton: false,
                timer: 1500,
              });
              this.closeModal.nativeElement.click();
              console.log('HttpEventType.Response : Upload completed');
              setTimeout(() => {
                this.progressvalue = 0;
              }, 2500);
              break;
          }
        }),
        catchError((error: HttpErrorResponse) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops, something went wrong!',
            showConfirmButton: false,
            timer: 1500,
          });
          return 'failed';
        })
      )
      .subscribe();
  }
  signOut() {
    const user = {
      userId: localStorage.getItem('userId'), // Get userId or any other data needed
    };

    this.service.signOut(user).subscribe({
      next: (response) => {
        console.log(response.message); // Display logout message if needed

        // Clear session only if logout is successful
        this.service.clearSession();

        // Update activity logs if needed
        let activityLogs = JSON.parse(
          localStorage.getItem('activityLogs') || '[]'
        );
        if (activityLogs.length > 0) {
          activityLogs[activityLogs.length - 1].logoutTime =
            new Date().toLocaleString();
          localStorage.setItem('activityLogs', JSON.stringify(activityLogs));
        }
        console.log('User logged out successfully.');

        this.router.navigate(['home']); // Navigate to login page after logout
      },
      error: (error) => {
        console.error('Sign-out failed:', error); // Log error if sign-out fails
      },
      complete: () => {
        console.log('Sign-out process complete.'); // Indicate completion of sign-out
      },
    });
  }

  // signOut() {
  //   //localStorage.removeItem('token');
  //   this.service.clearSession();
  //   this.socialAuthService.signOut();
  //   this.router.navigate(['login']);
  // }

  toggleSidebar() {
    $('body').toggleClass('sidebar-toggled');
    $('.sidebar').toggleClass('toggled');
    if ($('.sidebar').hasClass('toggled')) {
    }
  }
}
