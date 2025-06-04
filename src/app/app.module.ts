import { CityOfficialService } from 'src/app/shared/Governance/city-official.service';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './services/auth.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { GuestLayoutComponent } from './layout/guest-layout/guest-layout.component';
import { LoginComponent } from './pages/guest/login/login.component';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { GuestHomeComponent } from './pages/guest/guest-home/guest-home.component';
//import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RegisterComponent } from './pages/guest/register/register.component';
import { MainHomeComponent } from './pages/main/main-home/main-home.component';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { BarangaysComponent } from './pages/main/Governance/barangays/barangays.component';
import { CityOfficialsComponent } from './pages/main/Governance/city-officials/city-officials.component';
import { GeoProfileComponent } from './pages/main/Governance/geo-profile/geo-profile.component';
import { AddUserComponent } from './pages/main/Admin-Panel/add-user/add-user.component';
import { MajorEconomicActivitiesComponent } from './pages/main/Socio-Economic/Trade-and-Industry/major-economic-activities/major-economic-activities.component';
import { ManufacturingEstablishmentsComponent } from './pages/main/Socio-Economic/Trade-and-Industry/manufacturing-establishments/manufacturing-establishments.component';
import { CommercialEstablishmentsComponent } from './pages/main/Socio-Economic/Trade-and-Industry/commercial-establishments/commercial-establishments.component';
import { SummaryCommercialComponent } from './pages/main/Socio-Economic/Trade-and-Industry/summary-commercial/summary-commercial.component';
import { IndustrialEstatesComponent } from './pages/main/Socio-Economic/Trade-and-Industry/industrial-estates/industrial-estates.component';
import { FinancialInstitutionsComponent } from './pages/main/Socio-Economic/Trade-and-Industry/financial-institutions/financial-institutions.component';
import { ResortsComponent } from './pages/main/Socio-Economic/Tourism/resorts/resorts.component';
import { RecreationFacilitiesComponent } from './pages/main/Socio-Economic/Tourism/recreation-facilities/recreation-facilities.component';
import { HotelsLodgingHousesComponent } from './pages/main/Socio-Economic/Tourism/hotels-lodging-houses/hotels-lodging-houses.component';
import { CinemaMovieHousesComponent } from './pages/main/Socio-Economic/Tourism/cinema-movie-houses/cinema-movie-houses.component';
import { NaturalsAttractionsComponent } from './pages/main/Socio-Economic/Tourism/naturals-attractions/naturals-attractions.component';
import { CulturalAttractionsComponent } from './pages/main/Socio-Economic/Tourism/cultural-attractions/cultural-attractions.component';
import { FestivalAttractionsComponent } from './pages/main/Socio-Economic/Tourism/festival-attractions/festival-attractions.component';
import { AgriculturalProfileComponent } from './pages/main/Socio-Economic/Agriculture/agricultural-profile/agricultural-profile.component';
import { RiceCropsProductionComponent } from './pages/main/Socio-Economic/Agriculture/rice-crops-production/rice-crops-production.component';
import { FisheriesAquacultureComponent } from './pages/main/Socio-Economic/Agriculture/fisheries-aquaculture/fisheries-aquaculture.component';
import { LivestockProductionComponent } from './pages/main/Socio-Economic/Agriculture/livestock-production/livestock-production.component';
import { RicemillsComponent } from './pages/main/Socio-Economic/Agriculture/ricemills/ricemills.component';
import { WarehousesComponent } from './pages/main/Socio-Economic/Agriculture/warehouses/warehouses.component';
import { SlaughterhousesComponent } from './pages/main/Socio-Economic/Agriculture/slaughterhouses/slaughterhouses.component';
import { ProvincialCropsProductionComponent } from './pages/main/Socio-Economic/Agriculture/provincial-crops-production/provincial-crops-production.component';
import { ProvincialCropsHarvestedComponent } from './pages/main/Socio-Economic/Agriculture/provincial-crops-harvested/provincial-crops-harvested.component';
import { ProvincialCropsTotalProductionComponent } from './pages/main/Socio-Economic/Agriculture/provincial-crops-total-production/provincial-crops-total-production.component';
import { ElementaryPreElementaryComponent } from './pages/main/SocialProfile/Education/Private/elementary-pre-elementary/elementary-pre-elementary.component';
import { SecondaryComponent } from './pages/main/SocialProfile/Education/Private/secondary/secondary.component';
import { ElementaryComponent } from './pages/main/SocialProfile/Education/Public/elementary/elementary.component';
import { DayCareComponent } from './pages/main/SocialProfile/Education/Public/day-care/day-care.component';
import { PubSecondaryComponent } from './pages/main/SocialProfile/Education/Public/pub-secondary/pub-secondary.component';
import { TechVocComponent } from './pages/main/SocialProfile/Education/Public/tech-voc/tech-voc.component';
import { TertiaryComponent } from './pages/main/SocialProfile/Education/Public/tertiary/tertiary.component';
import { TrainingCenterComponent } from './pages/main/SocialProfile/Education/Public/training-center/training-center.component';
import { SPEDEnrolmentsComponent } from './pages/main/SocialProfile/Education/Public/spedenrolments/spedenrolments.component';
import { OSchoolYouthComponent } from './pages/main/SocialProfile/Education/Public/oschool-youth/oschool-youth.component';
import { PublicHealthComponent } from './pages/main/SocialProfile/Health/public-health/public-health.component';
import { CommunityHospitalComponent } from './pages/main/SocialProfile/Health/community-hospital/community-hospital.component';
import { BarangayHealthComponent } from './pages/main/SocialProfile/Health/barangay-health/barangay-health.component';
import { PrivateHospitalComponent } from './pages/main/SocialProfile/Health/private-hospital/private-hospital.component';
import { SanitaryFacilitiesComponent } from './pages/main/SocialProfile/Health/sanitary-facilities/sanitary-facilities.component';
import { MalnutritionComponent } from './pages/main/SocialProfile/Health/malnutrition/malnutrition.component';
import { MalnutritionRevisedComponent } from './pages/main/SocialProfile/Health/malnutrition-revised/malnutrition-revised.component';
import { PersonDisabilityComponent } from './pages/main/SocialProfile/Health/person-disability/person-disability.component';
import { ProvincialHospitalComponent } from './pages/main/SocialProfile/Health/provincial-hospital/provincial-hospital.component';
import { ProvincialHealthComponent } from './pages/main/SocialProfile/Health/provincial-health/provincial-health.component';
import { PoliceServicesComponent } from './pages/main/SocialProfile/PublicOrder/police-services/police-services.component';
import { FireProtectionComponent } from './pages/main/SocialProfile/PublicOrder/fire-protection/fire-protection.component';
import { BarangayPeacekeepingComponent } from './pages/main/SocialProfile/PublicOrder/barangay-peacekeeping/barangay-peacekeeping.component';
import { CrimeStatComponent } from './pages/main/SocialProfile/PublicOrder/crime-stat/crime-stat.component';
import { InformalSettlersComponent } from './pages/main/SocialProfile/Housing/informal-settlers/informal-settlers.component';
import { GovernmentHousingComponent } from './pages/main/SocialProfile/Housing/government-housing/government-housing.component';
import { SubdivisionsComponent } from './pages/main/SocialProfile/Housing/subdivisions/subdivisions.component';
import { CivicOrgComponent } from './pages/main/SocialProfile/Associations/civic-org/civic-org.component';
import { ReligiousComponent } from './pages/main/SocialProfile/Associations/religious/religious.component';
import { ProfessionalComponent } from './pages/main/SocialProfile/Associations/professional/professional.component';
import { CommercialComponent } from './pages/main/SocialProfile/Associations/commercial/commercial.component';
import { CooperativesComponent } from './pages/main/SocialProfile/Associations/cooperatives/cooperatives.component';
import { FoundationsComponent } from './pages/main/SocialProfile/Associations/foundations/foundations.component';
import { SectoralComponent } from './pages/main/SocialProfile/Associations/sectoral/sectoral.component';
import { PhysicalEnvironmentComponent } from './pages/main/Environment/physical-environment/physical-environment.component';
import { NaturalResourcesComponent } from './pages/main/Environment/natural-resources/natural-resources.component';
import { EnvironmentalActivitiesComponent } from './pages/main/Environment/environmental-activities/environmental-activities.component';
import { UrbanEnvironmentComponent } from './pages/main/Environment/urban-environment/urban-environment.component';
import { EnvironmentalHazardsComponent } from './pages/main/Environment/environmental-hazards/environmental-hazards.component';
import { SocialConditionComponent } from './pages/main/Environment/social-condition/social-condition.component';
import { HistoricalDisasterComponent } from './pages/main/Environment/historical-disaster/historical-disaster.component';
import { RoadsComponent } from './pages/main/Infrastructure/Transportation/roads/roads.component';
import { BridgesComponent } from './pages/main/Infrastructure/Transportation/bridges/bridges.component';
import { TransportTerminalsComponent } from './pages/main/Infrastructure/Transportation/transport-terminals/transport-terminals.component';
import { PortsComponent } from './pages/main/Infrastructure/Transportation/ports/ports.component';
import { TelecommunicationComponent } from './pages/main/Infrastructure/Communications/telecommunication/telecommunication.component';
import { CellSitesComponent } from './pages/main/Infrastructure/Communications/cell-sites/cell-sites.component';
import { TelegraphComponent } from './pages/main/Infrastructure/Communications/telegraph/telegraph.component';
import { ExpressMailComponent } from './pages/main/Infrastructure/Communications/express-mail/express-mail.component';
import { PostalServicesComponent } from './pages/main/Infrastructure/Communications/postal-services/postal-services.component';
import { InternetServiceComponent } from './pages/main/Infrastructure/Communications/internet-service/internet-service.component';
import { WaterUtilityComponent } from './pages/main/Infrastructure/Utility/water-utility/water-utility.component';
import { WaterPumpComponent } from './pages/main/Infrastructure/Utility/water-pump/water-pump.component';
import { IrrigationSystemComponent } from './pages/main/Infrastructure/Utility/irrigation-system/irrigation-system.component';
import { PowerSystemComponent } from './pages/main/Infrastructure/Utility/power-system/power-system.component';
import { PowerSubComponent } from './pages/main/Infrastructure/Utility/power-sub/power-sub.component';
import { WasteManagementComponent } from './pages/main/Infrastructure/Utility/waste-management/waste-management.component';
import { IcePlantComponent } from './pages/main/Infrastructure/Utility/ice-plant/ice-plant.component';
import { MarketSupermarketsComponent } from './pages/main/Infrastructure/Utility/market-supermarkets/market-supermarkets.component';
import { DepartmentStoreComponent } from './pages/main/Infrastructure/Utility/department-store/department-store.component';
import { MemorialParksComponent } from './pages/main/Infrastructure/Utility/memorial-parks/memorial-parks.component';
import { WorshipHousesComponent } from './pages/main/Infrastructure/Utility/worship-houses/worship-houses.component';
import { OtherStructureComponent } from './pages/main/Infrastructure/Utility/other-structure/other-structure.component';
import { OrgStaffingComponent } from './pages/main/Governance/org-staffing/org-staffing.component';
import { FiscalMattersComponent } from './pages/main/Governance/fiscal-matters/fiscal-matters.component';
import { DemographyComponent } from './pages/main/Governance/demography/demography.component';
import { RegisteredVotersComponent } from './pages/main/Governance/registered-voters/registered-voters.component';
import { SkVotersComponent } from './pages/main/Governance/sk-voters/sk-voters.component';
import { ProvincialOfficialsComponent } from './pages/main/Governance/provincial-officials/provincial-officials.component';
import { FiscalReportComponent } from './pages/main/Governance/fiscal-report/fiscal-report.component';
import { CityLocationComponent } from './pages/main/Governance/city-location/city-location.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { DashboardComponent } from './pages/main/Dashboard/dashboard/dashboard.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { LoadingComponent } from './components/loading/loading.component';
import { SepDataComponent } from './pages/main/Tools/sep-data/sep-data.component';
import { FilterPipe } from './pipes/filter.pipe';
import { FilterallPipe } from './pipes/filterall.pipe';
import { GoogleMapsModule } from '@angular/google-maps';
import { GmapComponent } from './components/gmap/gmap.component';
import { AgmCoreModule } from '@agm/core';
import { AdminComponent } from './Admin/admin/admin.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NewsComponent } from './pages/main/Tools/news/news.component';
import { HoursAgoOrDatePipe } from './pipes/hoursAgoOrDate.pipe';
import {
  FacebookLoginProvider,
  SocialLoginModule,
  SocialAuthServiceConfig,
} from 'angularx-social-login';
import { NotificationComponent } from './pages/main/Tools/notification/notification.component';
import { DdnComponent } from './Admin/ddn/ddn.component';
import { MenuComponent } from './Admin/menu/menu.component';
import { PdfComponent } from './components/pdf/pdf.component';
import { ImportComponent } from './components/import/import.component';
import { ImportLoadingComponent } from './components/import-loading/import-loading.component';
import { PublicPrivateComponent } from './pages/main/SocialProfile/Education/Facilities/public-private/public-private.component';
import { TertiaryInsComponent } from './pages/main/SocialProfile/Education/Facilities/tertiary-ins/tertiary-ins.component';
import { TechvocInsComponent } from './pages/main/SocialProfile/Education/Facilities/techvoc-ins/techvoc-ins.component';
import { TertiaryEnrolmentComponent } from './pages/main/SocialProfile/Education/Public/tertiary-enrolment/tertiary-enrolment.component';
import { TertiaryGradComponent } from './pages/main/SocialProfile/Education/Public/tertiary-grad/tertiary-grad.component';
import { TechvocProgramsComponent } from './pages/main/SocialProfile/Education/Public/techvoc-programs/techvoc-programs.component';
import { TechvocEnrolGradComponent } from './pages/main/SocialProfile/Education/Public/techvoc-enrol-grad/techvoc-enrol-grad.component';
import { IndexCrimeComponent } from './pages/main/SocialProfile/PublicOrder/index-crime/index-crime.component';
import { SepDataBtnComponent } from './pages/main/Tools/sep-data-btn/sep-data-btn.component';
import { SummaryReportComponent } from './pages/main/Tools/summary-report/summary-report.component';
import { MessageComponent } from './pages/main/Tools/message/message.component';
import { TruncatePipe } from './pipes/truncate.pipe';
import { MessageListComponent } from './pages/main/Tools/message-list/message-list.component';
import { HidefromguestmenuComponent } from './Admin/hidefromguestmenu/hidefromguestmenu.component';
import { ForAllAdminComponent } from './Admin/for-all-admin/for-all-admin.component';
import { DdnDashboardComponent } from './pages/main/Dashboard/ddn-dashboard/ddn-dashboard.component';
import { PrevRateComponent } from './pages/main/SocialProfile/Health/prev-rate/prev-rate.component';
import { NoDataComponent } from './components/no-data/no-data.component';
import { NgoComponent } from './Admin/ngo/ngo.component';
import { ExportExcelComponent } from './components/export-excel/export-excel.component';
import { ImportExcelComponent } from './components/import-excel/import-excel.component';
import { SearchPipe } from './search.pipe';
import { LGUComponent } from './Admin/lgu/lgu.component';
import { CategoryPipe } from './category.pipe';
import { PGDeptHeadsComponent } from './pages/main/Governance/pgdept-heads/pgdept-heads.component';
import { UpdateUserComponent } from './pages/main/Update-User/update-user/update-user.component';
import { ResetFormComponent } from './pages/main/reset-form/reset-form.component';
import { ActivityLogsComponent } from './pages/activity-logs/activity-logs.component';
import { FilterDatePipe } from './filter-date.pipe';
import { LunchingComponent } from './lunching/lunching.component';
import { NGAComponent } from './Admin/nga/nga.component';
import { AgeGroupComponent } from './pages/main/Governance/age-group/age-group.component';
import { FloodaffectedComponent } from './pages/main/Environment/floodaffected/floodaffected.component';
import { PopulationOfIndigenousPeopleComponent } from './pages/main/Governance/population-of-indigenous-people/population-of-indigenous-people.component';
import { AgriProfComponent } from './pages/main/Province/agri-prof/agri-prof.component';
import { SusceptibleFloodComponent } from './pages/main/Province/susceptible-flood/susceptible-flood.component';
import { RainInducedComponent } from './pages/main/Province/rain-induced/rain-induced.component';
import { ChildDevComponent } from './pages/main/Province/child-dev/child-dev.component';
import { PYAPComponent } from './pages/main/Province/pyap/pyap.component';
import { FedPWDComponent } from './pages/main/Province/fed-pwd/fed-pwd.component';
import { ProvIncomeComponent } from './pages/main/Province/prov-income/prov-income.component';
import { TouristArrivalComponent } from './pages/main/Province/tourist-arrival/tourist-arrival.component';
import { GuestSelectLoginComponent } from './pages/guest/guest-select-login/guest-select-login.component';
import { AccomEstabComponent } from './pages/main/Province/accom-estab/accom-estab.component';
import { ApprovalComponent } from './pages/approval/approval.component';
import { TravelOpsComponent } from './pages/main/Province/travel-ops/travel-ops.component';
import { NumberOfRestEstComponent } from './pages/main/Province/number-of-rest-est/number-of-rest-est.component';
import { SlopeComponent } from './pages/main/Province/slope/slope.component';
import { RainComponent } from './pages/main/Province/rain/rain.component';
import { RegSeniorComponent } from './pages/main/Province/reg-senior/reg-senior.component';
import { CrisisInComponent } from './pages/main/Province/crisis-in/crisis-in.component';
import { PopShareComponent } from './pages/main/Province/pop-share/pop-share.component';
import { UploadDataComponent } from './layout/upload-data/upload-data.component';
import { TablesCapsv2Pipe } from './pipes/tableCapsv2';
import { DataRequestComponent } from './pages/main/Province/data-request/data-request.component';
import { UtilityComponent } from './pages/main/Province/utility/utility.component';
import { ForGuestOnlyComponent } from './Admin/for-guest-only/for-guest-only.component';
import { CDRAComponent } from './pages/main/Province/cdra/cdra.component';
import { ExposureDBComponent } from './pages/main/Province/exposure-db/exposure-db.component';
import { UseUrbanComponent } from './pages/main/Province/use-urban/use-urban.component';

@NgModule({
  declarations: [
    PdfComponent,
    ImportComponent,
    AppComponent,
    MainLayoutComponent,
    GuestLayoutComponent,
    LoginComponent,
    GuestHomeComponent,
    RegisterComponent,
    MainHomeComponent,
    BarangaysComponent,
    CityOfficialsComponent,
    GeoProfileComponent,
    AddUserComponent,
    MajorEconomicActivitiesComponent,
    ManufacturingEstablishmentsComponent,
    CommercialEstablishmentsComponent,
    SummaryCommercialComponent,
    IndustrialEstatesComponent,
    FinancialInstitutionsComponent,
    ResortsComponent,
    RecreationFacilitiesComponent,
    HotelsLodgingHousesComponent,
    CinemaMovieHousesComponent,
    NaturalsAttractionsComponent,
    CulturalAttractionsComponent,
    FestivalAttractionsComponent,
    AgriculturalProfileComponent,
    RiceCropsProductionComponent,
    FisheriesAquacultureComponent,
    LivestockProductionComponent,
    RicemillsComponent,
    WarehousesComponent,
    SlaughterhousesComponent,
    ProvincialCropsProductionComponent,
    ProvincialCropsHarvestedComponent,
    ProvincialCropsTotalProductionComponent,
    ElementaryPreElementaryComponent,
    SecondaryComponent,
    ElementaryComponent,
    DayCareComponent,
    PubSecondaryComponent,
    TechVocComponent,
    TertiaryComponent,
    TrainingCenterComponent,
    SPEDEnrolmentsComponent,
    OSchoolYouthComponent,
    PublicHealthComponent,
    CommunityHospitalComponent,
    BarangayHealthComponent,
    PrivateHospitalComponent,
    SanitaryFacilitiesComponent,
    MalnutritionComponent,
    MalnutritionRevisedComponent,
    PersonDisabilityComponent,
    ProvincialHospitalComponent,
    ProvincialHealthComponent,
    PoliceServicesComponent,
    FireProtectionComponent,
    BarangayPeacekeepingComponent,
    CrimeStatComponent,
    InformalSettlersComponent,
    GovernmentHousingComponent,
    SubdivisionsComponent,
    CivicOrgComponent,
    ReligiousComponent,
    ProfessionalComponent,
    CommercialComponent,
    CooperativesComponent,
    FoundationsComponent,
    SectoralComponent,
    PhysicalEnvironmentComponent,
    NaturalResourcesComponent,
    EnvironmentalActivitiesComponent,
    UrbanEnvironmentComponent,
    EnvironmentalHazardsComponent,
    SocialConditionComponent,
    HistoricalDisasterComponent,
    RoadsComponent,
    BridgesComponent,
    TransportTerminalsComponent,
    PortsComponent,
    TelecommunicationComponent,
    CellSitesComponent,
    TelegraphComponent,
    ExpressMailComponent,
    PostalServicesComponent,
    InternetServiceComponent,
    WaterUtilityComponent,
    WaterPumpComponent,
    IrrigationSystemComponent,
    PowerSystemComponent,
    PowerSubComponent,
    WasteManagementComponent,
    IcePlantComponent,
    MarketSupermarketsComponent,
    DepartmentStoreComponent,
    MemorialParksComponent,
    WorshipHousesComponent,
    OtherStructureComponent,
    OrgStaffingComponent,
    FiscalMattersComponent,
    DemographyComponent,
    RegisteredVotersComponent,
    SkVotersComponent,
    ProvincialOfficialsComponent,
    FiscalReportComponent,
    CityLocationComponent,
    DashboardComponent,
    LoadingComponent,

    SepDataComponent,
    FilterPipe,
    TablesCapsv2Pipe,
    FilterallPipe,
    GmapComponent,
    AdminComponent,
    NewsComponent,
    HoursAgoOrDatePipe,
    NotificationComponent,
    DdnComponent,
    MenuComponent,
    ImportLoadingComponent,
    PdfComponent,
    PublicPrivateComponent,
    TertiaryInsComponent,
    TechvocInsComponent,
    TertiaryEnrolmentComponent,
    TertiaryGradComponent,
    TechvocProgramsComponent,
    TechvocEnrolGradComponent,
    IndexCrimeComponent,
    SepDataBtnComponent,
    SummaryReportComponent,
    MessageComponent,
    TruncatePipe,
    MessageListComponent,
    HidefromguestmenuComponent,
    ForAllAdminComponent,
    DdnDashboardComponent,
    PrevRateComponent,
    NoDataComponent,
    NgoComponent,
    ExportExcelComponent,
    ImportExcelComponent,
    SearchPipe,
    LGUComponent,
    CategoryPipe,
    PGDeptHeadsComponent,
    UpdateUserComponent,
    ResetFormComponent,
    ActivityLogsComponent,
    FilterDatePipe,
    LunchingComponent,
    NGAComponent,
    AgeGroupComponent,
    FloodaffectedComponent,
    PopulationOfIndigenousPeopleComponent,
    AgriProfComponent,
    SusceptibleFloodComponent,
    RainInducedComponent,
    ChildDevComponent,
    PYAPComponent,
    FedPWDComponent,
    ProvIncomeComponent,
    TouristArrivalComponent,
    GuestSelectLoginComponent,
    AccomEstabComponent,
    ApprovalComponent,
    TravelOpsComponent,
    NumberOfRestEstComponent,
    SlopeComponent,
    RainComponent,
    RegSeniorComponent,
    CrisisInComponent,
    PopShareComponent,
    UploadDataComponent,
    DataRequestComponent,
    UtilityComponent,
    ForGuestOnlyComponent,
    CDRAComponent,
    ExposureDBComponent,
    UseUrbanComponent,
  ],
  imports: [
    MdbCollapseModule,
    BrowserModule,
    // FontAwesomeModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPaginationModule,
    ImageCropperModule,
    GoogleMapsModule,
    AgmCoreModule.forRoot({
      // please get your own API key here:
      // https://developers.google.com/maps/documentation/javascript/get-api-key?hl=en
      apiKey: 'AIzaSyBfQJlyD65DekS6HrSDe2z-6-KvoO4aeRk',
    }),
    CKEditorModule,
    SocialLoginModule,
  ],
  providers: [
    AuthService,
    CityOfficialService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('1325737945023713'),
          },
        ],
      } as SocialAuthServiceConfig,
    },
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
