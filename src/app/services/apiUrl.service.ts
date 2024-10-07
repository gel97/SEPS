import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiUrl {
  verify_token() {
    throw new Error('Method not implemented.');
  }
  //  GOVERNANCE
  // Municipality/City Officials
  post_get_officials = (munCityId: any, setYear: any) =>
    `/MunCityOfficial/GetOfficials?munCityId=${munCityId}&setYear=${setYear}`;
  post_save_official = () => `/MunCityOfficial/SaveOfficial`;
  post_update_official = () => `/MunCityOfficial/Update`;
  get_mun_position = () => `/MunCityOfficial/ListMunPosition`;
  delete_officials = (transId: any) => `/MunCityOfficial/${transId}`;
  post_report_officials = () => `/MunCityOfficial/Reports`;
  post_import_officials = () => `/MunCityOfficial/Import`;

  // Barangay Officials
  post_get_barangay_officials = (munCityId: any, setYear: any) =>
    `/Barangay/GetBarangays?munCityId=${munCityId}&setYear=${setYear}`;
  post_save_barangay = () => `/Barangay/SaveBarangay`;
  post_update_barangay = () => `/Barangay/Update`;
  post_list_barangay = (munCityId: any) =>
    `/Barangay/ListBarangays?munCityId=${munCityId}`;
  delete_barangay = (transId: any) => `/Barangay/${transId}`;
  post_barangay_report = () => `/Barangay/Reports`;
  post_import_report = () => `/Barangay/Import`;

  //Physical Geographic Profile
  get_get_geo = (munCityId: any, setYear: any) =>
    `/PhyGeoProf/${setYear}/${munCityId}`;
  post_save_geo = () => `/PhyGeoProf`;
  put_update_geo = () => '/PhyGeoProf';
  delete_geo = (transId: any) => `/PhyGeoProf/${transId}`;
  post_report_geo = () => `/PhyGeoProf/Reports`;
  post_import_geo = () => `/PhyGeoProf/Import`;

  //Physical Geo Barangay
  get_list_profbrgy = (munCityId: any, setYear: any) =>
    `/PhyGeoProfBrgy/${setYear}/${munCityId}`;
  post_save_profbrgy = () => `/PhyGeoProfBrgy`;
  put_update_profbrgy = () => `/PhyGeoProfBrgy`;
  delete_profbrgy = (transId: any) => `/PhyGeoProfBrgy/${transId}`;
  post_report_geobrgy = () => `/PhyGeoProfBrgy/Reports`;

  // Organization & Staffing Pattern
  get_get_org = (munCityId: any, setYear: any) =>
    `/OrgStaffPattern/${setYear}/${munCityId}`;
  post_save_org = () => `/OrgStaffPattern`;
  put_update_org = () => '/OrgStaffPattern';
  delete_org = (transId: any) => `/OrgStaffPattern/${transId}`;
  post_report_org = () => `/OrgStaffPattern/Reports`;
  post_import_org = () => `/OrgStaffPattern/Import`;

  //Fiscal Matters
  post_get_fiscal_matters = (munCityId: any) =>
    `/FiscalMatters/List?munCityId=${munCityId}`;
  post_save_fiscal_matters = () => `/FiscalMatters/Save`;
  post_update_fiscal_matters = () => '/FiscalMatters/Update';
  delete_fiscal = (transId: any) => `/FiscalMatters/${transId}`;
  post_report_fiscal = () => `/FiscalMatters/Reports`;

  // IMAGE
  get_image_banner = (munCityId: any) => `/Image/GetImage/${munCityId}`;
  post_upload_image_banner = () => `/Image/UploadImage`;
  get_muncity_logo = (munCityId: any) => `/Image/GetMunLogo/${munCityId}`;
  post_upload_muncity_logo = () => `/Image/UploadMunLogo`;
  get_image_org = (munCityId: any) => `/Image/GetOrg/${munCityId}`;
  post_upload_image_org = () => `/Image/UploadOrg`;

  // MUN/CITY LIST
  get_all_muncity = () => `/MunLoc/List`;
  post_update_muncity = () => `/MunLoc/Update`;

  // Mun Loc Building
  get_all_building = () => `/MunCityBuilding/List`;
  get_mun_building = (munCityId: any, setYear: any) =>
    `/MunCityBuilding/${setYear}/${munCityId}`;
  post_save_building = () => `/MunCityBuilding`;
  post_update_Building = () => `/MunCityBuilding`;
  delete_building = (transId: any) => `/MunCityBuilding/${transId}`;

  // Demography Officials
  get_demography = (munCityId: any, setYear: any) =>
    `/Demography/${munCityId}/${setYear}`;
  post_save_demography = () => `/Demography/Save`;
  post_update_demography = () => `/Demography/Update`;
  delete_demography = (transId: any) => `/Demography/${transId}`;
  post_list_barangay_demo = (munCityId: any) =>
    `/Barangay/ListBarangays?munCityId=${munCityId}`;
  post_report_demography = () => `/Demography/Reports`;
  post_reportMun_demography = () => `/Demography/Reports/Mun`;

  //Provincial Fiscal
  post_get_provincialfiscal = (setYear: any) =>
    `/ProvFiscal/List?setYear=${setYear}`;
  post_save_provincialfiscal = () => `/ProvFiscal/Save`;
  post_update_provincialfiscal = () => `/ProvFiscal/Update`;
  delete_provincialFical = (transId: any) => `/ProvFiscal/${transId}`;

  //Registered Voter
  post_get_regvoter = (munCityId: any, setYear: any) =>
    `/RegVoters/List?munCityId=${munCityId}&setYear=${setYear}`;
  post_save_regvoter = () => `/RegVoters/Save`;
  post_update_regvoter = () => `/RegVoters/Update`;
  delete_regVoter = (transId: any) => `/RegVoters/${transId}`;
  post_report_regvoter = () => `/RegVoters/Reports`;
  post_import_regvoter = () => `/RegVoters/Import`;
  post_reportMun_regvoter = () => `/RegVoters/Reports/Mun`;

  //SK Registered Voter
  post_get_skvoter = (munCityId: any, setYear: any) =>
    `/RegSkVoters/List?munCityId=${munCityId}&setYear=${setYear}`;
  post_save_skvoter = () => `/RegSkVoters/Save`;
  post_update_skvoter = () => `/RegSkVoters/Update`;
  delete_skVoter = (transId: any) => `/RegSkVoters/${transId}`;
  post_report_skVoter = () => `/RegSkVoters/Reports`;
  post_import_skVoter = () => `/RegSkVoters/Import`;
  post_reportMun_regSKvoter = () => `/RegSkVoters/Reports/Mun`;

  //Provincial official
  post_get_prov_official = (setYear: any) =>
    `/ProvOfficial/List?setYear=${setYear}`;
  post_save_prov_official = () => `/ProvOfficial/Save`;
  post_update_prov_official = () => `/ProvOfficial/Update`;
  get_prov_position = () => `/ProvOfficial`;
  delete_prov_officials = (transId: any) => `/MunCityOfficial/${transId}`;
  post_import_prov_officials = () => `/ProvOfficial/Import`;
  post_report_prov_officials = () => `/ProvOfficial/Reports`;

  //PG DepartmentHead
  post_get_pg_official = (setYear: any) =>
    `/PGDepartmentHeads/List?setYear=${setYear}`;
  post_save_pg_official = () => `/PGDepartmentHeads/SaveOfficial`;
  post_update_pg_official = () => `/PGDepartmentHeads/Update`;
  delete_pg_official = (transId: any) => `/PGDepartmentHeads/${transId}`;
  post_report_pg_officials = () => `/PGDepartmentHeads/Reports`;

  //SOCIO-ECONOMIC ACTIVITIES

  //Comercial Establishments
  get_com_estab = (munCityId: any, setYear: any) =>
    `/ComEstab/${setYear}/${munCityId}`;
  get_com_estab_summary = (munCityId: any, setYear: any) =>
    `/ComEstab/comestab_summary/${setYear}/${munCityId}`;

  post_save_com_estab = () => `/ComEstab`;
  put_update_com_estab = () => `/ComEstab`;
  delete_com_estab = (transId: any) => `/ComEstab/${transId}`;
  post_report_com_estab = () => `/ComEstab/Reports`;
  post_import_com_estab = () => `/ComEstab/Import`;

  get_com_estab_cat = () => `/ComEstabCategory/List`;
  get_com_estab_type = () => `/ComEstabLineBusiness/List`;

  //Summary Commercial
  get_summ_commercial = (munCityId: any, setYear: any) =>
    `/SumComEst/${setYear}/${munCityId}`;
  post_save_summ_commercial = () => `/SumComEst`;
  put_update_summ_commercial = () => `/SumComEst`;
  delete_summ_commercial = (transId: any) => `/SumComEst/${transId}`;

  //Financial Institutions
  get_financial_Ins = (munCityId: any, setYear: any) =>
    `/FinIns/${setYear}/${munCityId}`;
  post_save_financial_Ins = () => `/FinIns`;
  put_update_financial_Ins = () => `/FinIns`;
  delete_financial_Ins = (transId: any) => `/FinIns/${transId}`;
  post_import_financial_Ins = () => `/FinIns/Import`;
  post_report_financial_Ins = () => `/FinIns/Reports`;

  //Financial Institutions --> Category
  get_list_financial_Ins_cat = () => `/FinInsCategory/List`;
  post_save_financial_Ins_cat = () => `/FinInsCategory`;
  put_update_financial_Ins_cat = () => `/FinInsCategory`;
  delete_financial_Ins_cat = (recNo: any) => `/FinInsCategory/${recNo}`;

  //Financial Institutions --> Category Type
  get_list_financial_Ins_cat_type = () => `/FinInsCatType/List`;
  post_save_financial_Ins_cat_type = () => `/FinInsCatType`;
  put_update_financial_Ins_cat_type = () => `/FinInsCatType`;
  delete_financial_Ins_cat_type = (recNo: any) => `/FinInsCatType/${recNo}`;

  //Industrial estates
  get_Industrial = (munCityId: any, setYear: any) =>
    `/IndEst/${setYear}/${munCityId}`;
  post_save_Industrial = () => `/IndEst`;
  put_update_Industrial = () => `/IndEst`;
  delete_Industrial = (transId: any) => `/IndEst/${transId}`;
  post_report_Industrial = () => `/IndEst/Reports`;
  post_import_Industrial = () => `/IndEst/Import`;

  //Major Economic Activities
  get_major_eco = (munCityId: any, setYear: any) =>
    `/MjrEcoAct/${setYear}/${munCityId}`;
  post_save_major_eco = () => `/MjrEcoAct`;
  put_update_major_eco = () => `/MjrEcoAct`;
  delete_major_eco = (transId: any) => `/MjrEcoAct/${transId}`;
  post_report_major_eco = () => `/MjrEcoAct/Reports`;
  post_import_major_eco = () => `/MjrEcoAct/Import`;

  //Manufacturing Establishment
  get_manuf_estab = (munCityId: any, setYear: any) =>
    `/ManEstab/${setYear}/${munCityId}`;
  post_save_manuf_estab = () => `/ManEstab`;
  put_update_manuf_estab = () => `/ManEstab`;
  delete_manuf_estab = (transId: any) => `/ManEstab/${transId}`;
  post_report_manuf_estab = () => `/ManEstab/Reports`;
  post_import_manuf_estab = () => `/ManEstab/Import`;
  get_manuf_estab_cat = () => `/ManEstabCategory/List`;
  get_manuf_estab_types = () => `/ManEstabType/List`;

  //Excel
  post_ExImport = (apiControllerName: string) =>
    `/${apiControllerName}/import_excel`;
  get_ExExport = (setYear: any, MunCityId: any, apiControllerName: string) =>
    `/${apiControllerName}/export/${setYear}/${MunCityId}`;
  get_ExExport_temp = (apiController: string, munCityId: any) =>
    `/${apiController}/export_template/${munCityId}`;

  get_export_with_menuId = (
    setYear: any,
    MunCityId: any,
    apiControllerName: string,
    menuId: string
  ) => `/${apiControllerName}/export_excel/${menuId}/${setYear}/${MunCityId}`;
  get_import_with_menuId = (
    setYear: any,
    MunCityId: any,
    apiControllerName: string,
    menuId: string
  ) => `/${apiControllerName}/import_excel/${menuId}/${setYear}/${MunCityId}`;

  //TOURISM
  post_tourism = () => `/Tourism`;
  put_tourism = () => `/Tourism`;
  get_tourism_type = () => `/TourismType/List`;
  get_list_tourism = (menuId: any, setYear: any, munCityId: any) =>
    `/Tourism/${menuId}/${setYear}/${munCityId}`;
  delete_tourism = (transId: any) => `/Tourism/${transId}`;
  post_import_tourism = (menuId: any) => `/Tourism/Import/${menuId}`;
  post_report_tourism = () => `/Tourism/Reports`;

  // Agriculture Profile
  post_agriculture_profile = () => `/AgricultureProfile`;
  put_agriculture_profile = () => `/AgricultureProfile`;
  get_list_agriculture_profile = (setYear: any, munCityId: any) =>
    `/AgricultureProfile/${setYear}/${munCityId}`;
  delete_agriculture_profile = (transId: any) =>
    `/AgricultureProfile/${transId}`;
  post_report_agriculture_profile = () => `/AgricultureProfile/Reports`;
  post_import_agriculture_profile = () => `/AgricultureProfile/Import`;

  get_list_harvest_type = () => `/AgricultureHarvestType/List`;
  get_list_ricemill_type = () => `/AgricultureRicemillType/List`;

  // Agriculture Livestock
  post_agriculture_livestock = () => `/AgricultureLivestock`;
  put_agriculture_livestock = () => `/AgricultureLivestock`;
  get_list_agriculture_livestock = (setYear: any, munCityId: any) =>
    `/AgricultureLivestock/${setYear}/${munCityId}`;
  delete_agriculture_livestock = (transId: any) =>
    `/AgricultureLivestock/${transId}`;
  post_report_agriculture_livestock = () => `/AgricultureLivestock/Reports`;
  post_import_agriculture_livestock = () => `/AgricultureLivestock/Import`;

  //Provincial Profile on Crops Production and Area Harvested
  post_agriculture_prod = () => `/AgricultureProd`;
  put_agriculture_prod = () => `/AgricultureProd`;
  get_list_agriculture_prod = (menuId: any, setYear: any, munCityId: any) =>
    `/AgricultureProd/${menuId}/${setYear}/${munCityId}`;
  delete_agriculture_prod = (transId: any) => `/AgricultureProd/${transId}`;
  post_import_agriculture_prod = (menuId: any) =>
    `/AgricultureProd/Import/${menuId}`;

  //Agriculture
  post_agriculture = () => `/Agriculture`;
  put_agriculture = () => `/Agriculture`;
  get_list_agriculture = (menuId: any, setYear: any, munCityId: any) =>
    `/Agriculture/${menuId}/${setYear}/${munCityId}`;
  delete_agriculture = (transId: any) => `/Agriculture/${transId}`;
  post_import_agriculture = (menuId: any) => `/Agriculture/Import/${menuId}`;
  post_report_agriculture = () => `/Agriculture/Reports`;

  // SOCIAL-PROFILE
  // Association
  post_association = () => `/Associations`;
  put_association = () => `/Associations`;
  get_list_associations = (menuId: any, setYear: any, munCityId: any) =>
    `/Associations/${menuId}/${setYear}/${munCityId}`;
  delete_association = (transId: any) => `/Associations/${transId}`;
  post_import_association = (menuId: any) => `/Associations/Import/${menuId}`;
  post_report_association = () => `/Associations/Reports`;

  // Education
  get_list_education = (menuId: any, setYear: any, munCityId: any) =>
    `/Education/${menuId}/${setYear}/${munCityId}`;
  get_education = (transId: any) => `/Education/${transId}`;
  post_education = () => `/Education`;
  put_education = () => `/Education`;
  delete_education = (transId: any) => `/Education/${transId}`;
  post_report_education = () => `/Education/Reports`;
  post_import_education = (menuId: any) => `/Education/Import/${menuId}`;

  //Area of Exceptionality
  get_list_education_area_ex = () => `/EducationAreaEx/List`;
  get_education_area_ex = (transId: any) => `/EducationAreaEx/${transId}`;
  post_education_area_ex = () => `/EducationAreaEx`;
  put_education_area_ex = () => `/EducationAreaEx`;
  delete_education_area_ex = (transId: any) => `/EducationAreaEx/${transId}`;

  // Education Schools
  get_list_education_schools = (menuId: any, setYear: any, munCityId: any) =>
    `/EducationSchools/${menuId}/${setYear}/${munCityId}`;
  get_education_schools = (transId: any) => `/EducationSchools/${transId}`;
  post_education_schools = () => `/EducationSchools`;
  put_education_schools = () => `/EducationSchools`;
  delete_education_schools = (transId: any) => `/EducationSchools/${transId}`;
  post_report_education_schools = () => `/EducationSchools/Reports`;
  post_import_education_schools = (menuId: any) =>
    `/EducationSchools/Import/${menuId}`;

  // Education TechVoc
  get_list_education_techvoc = (setYear: any, munCityId: any) =>
    `/EducationTechVoc/${setYear}/${munCityId}`;
  get_education_techvoc = (transId: any) => `/EducationTechVoc/${transId}`;
  post_education_techvoc = () => `/EducationTechVoc`;
  put_education_techvoc = () => `/EducationTechVoc`;
  delete_education_techvoc = (transId: any) => `/EducationTechVoc/${transId}`;
  post_report_education_techvoc = () => `/EducationTechVoc/Reports`;
  post_import_education_techvoc = () => `/EducationTechVoc/Import`;

  // Education TechVoc Stat
  get_list_education_techvoc_stat = (setYear: any, munCityId: any) =>
    `/EducationTechVocStat/${setYear}/${munCityId}`;
  get_education_techvoc_stat = (transId: any) =>
    `/EducationTechVocStat/${transId}`;
  post_education_techvoc_stat = () => `/EducationTechVocStat`;
  post_list_education_techvoc_stat = () => `/EducationTechVocStat/SaveList`;
  put_education_techvoc_stat = () => `/EducationTechVocStat`;
  delete_education_techvoc_stat = (transId: any) =>
    `/EducationTechVocStat/${transId}`;
  post_report_education_techvoc_stat = () => `/EducationTechVocStat/Reports`;

  // Education Tertiary
  get_list_education_tertiary = (setYear: any, munCityId: any) =>
    `/EducationTertiary/${setYear}/${munCityId}`;
  get_education_tertiary = (transId: any) => `/EducationTertiary/${transId}`;
  post_education_tertiary = () => `/EducationTertiary`;
  put_education_tertiary = () => `/EducationTertiary`;
  delete_education_tertiary = (transId: any) => `/EducationTertiary/${transId}`;
  post_report_education_tertiary = () => `/EducationTertiary/Reports`;
  post_import_education_tertiary = () => `/EducationTertiary/Import`;

  // Education Tertiary Grad
  get_list_education_tertiary_grad = (setYear: any, munCityId: any) =>
    `/EducationTertiaryGrad/${setYear}/${munCityId}`;
  get_education_tertiary_grad = (transId: any) =>
    `/EducationTertiaryGrad/${transId}`;
  post_education_tertiary_grad = () => `/EducationTertiaryGrad`;
  put_education_tertiary_grad = () => `/EducationTertiaryGrad`;
  delete_education_tertiary_grad = (transId: any) =>
    `/EducationTertiaryGrad/${transId}`;
  post_report_education_tertiary_grad = () => `/EducationTertiaryGrad/Reports`;

  // Education Stat
  get_list_education_stat = (setYear: any, munCityId: any) =>
    `/EducationStat/${setYear}/${munCityId}`;
  get_education_stat = (transId: any) => `/EducationStat/${transId}`;
  post_education_stat = () => `/EducationStat`;
  put_education_stat = () => `/EducationStat`;
  delete_education_stat = (transId: any) => `/EducationStat/${transId}`;
  post_report_education_stat = () => `/EducationStat/Reports`;

  // Education Programs
  get_list_education_programs = () => `/EducationPrograms/List`;
  get_education_programs = (recNo: any) => `/EducationPrograms/${recNo}`;
  post_education_programs = () => `/EducationPrograms`;
  put_education_programs = () => `/EducationPrograms`;
  delete_education_programs = (recNo: any) => `/EducationPrograms/${recNo}`;

  // Education Programs TechVoc
  get_list_education_programs_techvoc = () => `/EducationProgramTechVoc/List`;
  get_education_programs_techvoc = (recNo: any) =>
    `/EducationProgramTechVoc/${recNo}`;
  post_education_programs_techvoc = () => `/EducationProgramTechVoc`;
  put_education_programs_techvoc = () => `/EducationProgramTechVoc`;
  delete_education_programs_techvoc = (recNo: any) =>
    `/EducationProgramTechVoc/${recNo}`;

  // Education -> Out of School
  get_list_education_osy = (setYear: any, munCityId: any) =>
    `/EducationOsy/${setYear}/${munCityId}`;
  post_education_osy = () => `/EducationOsy`;
  put_education_osy = () => `/EducationOsy`;
  delete_education_osy = (transId: any) => `/EducationOsy/${transId}`;
  post_report_education_osy = () => `/EducationOsy/Reports`;

  // Health -> Workers
  get_health_workers = (setYear: any, munCityId: any) =>
    `/HealthWorkers/${setYear}/${munCityId}`;
  post_health_workers = () => `/HealthWorkers`;
  put_health_workers = () => `/HealthWorkers`;
  delete_health_workers = (transId: any) => `/HealthWorkers/${transId}`;
  post_import_health_workers = () => `/HealthWorkers/Import`;
  post_report_health_workers = () => `/HealthWorkers/Reports`;

  // Health -> Facilities
  get_list_health_facilities = (menuId: any, setYear: any, munCityId: any) =>
    `/HealthFacilities/${menuId}/${setYear}/${munCityId}`;
  post_health_facility = () => `/HealthFacilities`;
  put_health_facility = () => `/HealthFacilities`;
  delete_health_facility = (transId: any) => `/HealthFacilities/${transId}`;
  post_import_health_facility = (menuId: any) =>
    `/HealthFacilities/Import/${menuId}`;
  post_report_health_facility = () => `/HealthFacilities/Reports`;

  // Health -> Handicap
  get_list_health_handicap = (setYear: any, munCityId: any) =>
    `/HealthHandi/${setYear}/${munCityId}`;
  post_health_handicap = () => `/HealthHandi`;
  put_health_handicap = () => `/HealthHandi`;
  delete_health_handicap = (transId: any) => `/HealthHandi/${transId}`;
  post_import_health_handicap = () => `/HealthHandi/Import`;
  post_report_health_handicap = () => `/HealthHandi/Reports`;

  // Health -> Handicap Type
  get_list_health_handicap_type = () => `/HealthHandiType/List`;
  post_health_handicap_type = () => `/HealthHandiType`;
  put_health_handicap_type = () => `/HealthHandiType`;
  delete_health_handicap_type = (recNo: any) => `/HealthHandiType/${recNo}`;

  // Health -> HealthMalnutrition
  get_list_health_malnutrition = (setYear: any, munCityId: any) =>
    `/HealthMalnut/${setYear}/${munCityId}`;
  post_health_malnutrition = () => `/HealthMalnut`;
  put_health_malnutrition = () => `/HealthMalnut`;
  delete_health_malnutrition = (transId: any) => `/HealthMalnut/${transId}`;
  post_import_health_malnutrition = () => `/HealthMalnut/Import`;

  // Health -> Prev Rate
  get_list_health_prev_rate = (setYear: any) =>
    `/HealthPrevRate/List/${setYear}`;
  post_health_prev_rate = () => `/HealthPrevRate`;
  put_health_prev_rate = () => `/HealthPrevRate`;
  delete_health_prev_rate = (transId: any) => `/HealthPrevRate/${transId}`;
  post_import_health_prev_rate = () => `/HealthPrevRate/Import`;
  post_report_health_prev_rate = () => `/HealthPrevRate/Reports `;

  // Health -> Sanitary
  get_list_health_sanitary = (setYear: any, munCityId: any) =>
    `/HealthSanitary/${setYear}/${munCityId}`;
  post_health_sanitary = () => `/HealthSanitary`;
  put_health_sanitary = () => `/HealthSanitary`;
  delete_health_sanitary = (transId: any) => `/HealthSanitary/${transId}`;
  post_import_health_sanitary = () => `/HealthSanitary/Import`;
  post_report_health_sanitary = () => `/HealthSanitary/Reports`;

  // Health -> Hospital -> Provincial
  get_list_health_hospital = (setYear: any) => `/HealthHosp/${setYear}`;
  post_health_hospital = () => `/HealthHosp`;
  put_health_hospital = () => `/HealthHosp`;
  delete_health_hospital = (transId: any) => `/HealthHosp/${transId}`;
  post_import_health_hospital = () => `/HealthHosp/Import`;
  post_report_health_hospital = () => `/HealthHosp/Reports`;

  // Health -> Profile -> Provincial
  get_list_health_profile = (setYear: any) => `/HealthProfile/${setYear}`;
  post_health_profile = () => `/HealthProfile`;
  put_health_profile = () => `/HealthProfile`;
  delete_health_profile = (transId: any) => `/HealthProfile/${transId}`;
  post_import_health_profile = () => `/HealthProfile/Import`;

  // Safety -> SafetyServices
  get_list_safety_services = (menuId: any, setYear: any, munCityId: any) =>
    `/SafetyServices/${menuId}/${setYear}/${munCityId}`;
  post_safety_services = () => `/SafetyServices`;
  put_safety_services = () => `/SafetyServices`;
  delete_safety_services = (transId: any) => `/SafetyServices/${transId}`;

  // Safety -> Safety Crime Types
  get_list_safety_crime_types = () => `/SafetyCrimeTypes/List`;
  get_safety_crime_types = (recNo: any) => `/SafetyCrimeTypes/${recNo}`;
  post_safety_crime_types = () => `/SafetyCrimeTypes`;
  put_safety_crime_types = () => `/SafetyCrimeTypes`;
  delete_safety_crime_types = (recNo: any) => `/SafetyCrimeTypes/${recNo}`;

  // Safety -> SafetyStatistics
  get_safety_statistics = (setYear: any, munCityId: any) =>
    `/SafetyStatistics/${setYear}/${munCityId}`;
  post_safety_statistics = () => `/SafetyStatistics`;
  put_safety_statistics = () => `/SafetyStatistics`;
  delete_safety_statistics = (transId: any) => `/SafetyStatistics/${transId}`;

  // Safety -> Fire Protection
  get_list_safety_fire = (setYear: any, munCityId: any) =>
    `/SafetyFireProtection/${setYear}/${munCityId}`;
  post_safety_fire = () => `/SafetyFireProtection`;
  put_safety_fire = () => `/SafetyFireProtection`;
  delete_safety_fire = (transId: any) => `/SafetyFireProtection/${transId}`;
  post_import_safety_fire = () => `/SafetyFireProtection/Import`;
  post_report_safety_fire = () => `/SafetyFireProtection/Reports`;

  // Safety -> Police Service
  get_list_safety_police = (setYear: any) =>
    `/SafetyPoliceServices/List/${setYear}`;
  post_safety_police = () => `/SafetyPoliceServices`;
  put_safety_police = () => `/SafetyPoliceServices`;
  delete_safety_police = (transId: any) => `/SafetyPoliceServices/${transId}`;
  post_import_safety_police = () => `/SafetyPoliceServices/Import`;
  post_report_safety_police = () => `/SafetyPoliceServices/Reports`;

  // Safety -> Index Crime
  get_list_safety_index = (setYear: any) => `/SafetyIndexCrime/List/${setYear}`;
  post_safety_index = () => `/SafetyIndexCrime`;
  put_safety_index = () => `/SafetyIndexCrime`;
  delete_safety_index = (transId: any) => `/SafetyIndexCrime/${transId}`;
  post_import_safety_index = () => `/SafetyIndexCrime/Import`;
  post_report_safety_index = () => `/SafetyIndexCrime/Reports`;

  // Safety -> SafetyTanod
  get_list_safety_tanod = (setYear: any, munCityId: any) =>
    `/SafetyTanod/${setYear}/${munCityId}`;
  post_safety_tanod = () => `/SafetyTanod`;
  put_safety_tanod = () => `/SafetyTanod`;
  delete_safety_tanod = (transId: any) => `/SafetyTanod/${transId}`;
  post_report_safety_tanod = () => `/SafetyTanod/Reports`;
  post_import_safety_tanod = () => `/SafetyTanod/Import`;

  //Housing -> HousingProject
  get_list_housing_project = (setYear: any, munCityId: any) =>
    `/HousingProject/${setYear}/${munCityId}`;
  post_housing_project = () => `/HousingProject`;
  put_housing_project = () => `/HousingProject`;
  delete_housing_project = (transId: any) => `/HousingProject/${transId}`;
  post_report_housing_project = () => `/HousingProject/Reports`;
  post_import_housing_project = () => `/HousingProject/Import`;

  //Housing -> HousingSubdv
  get_list_housing_subdivision = (setYear: any, munCityId: any) =>
    `/HousingSubdv/${setYear}/${munCityId}`;
  post_housing_subdivision = () => `/HousingSubdv`;
  put_housing_subdivision = () => `/HousingSubdv`;
  delete_housing_subdivision = (transId: any) => `/HousingSubdv/${transId}`;
  post_report_housing_subdivision = () => `/HousingSubdv/Reports`;
  post_import_housing_subdivision = () => `/HousingSubdv/Import`;

  //Housing -> HousingSettlers
  get_list_housing_settlers = (setYear: any, munCityId: any) =>
    `/HousingSettlers/${setYear}/${munCityId}`;
  post_housing_settlers = () => `/HousingSettlers`;
  put_housing_settlers = () => `/HousingSettlers`;
  delete_housing_settlers = (transId: any) => `/HousingSettlers/${transId}`;
  post_report_housing_settlers = () => `/HousingSettlers/Reports`;
  post_import_housing_settlers = () => `/HousingSettlers/Import`;

  //ENVIRONMENT
  get_list_environment = (menuId: any, setYear: any, munCityId: any) =>
    `/Environment/${menuId}/${setYear}/${munCityId}`;
  post_environment = () => `/Environment`;
  put_environment = () => `/Environment`;
  delete_environment = (transId: any) => `/Environment/${transId}`;
  post_report_environment = () => `/Environment/Reports`;
  //Environment Act
  get_list_environment_activities = (setYear: any, munCityId: any) =>
    `/EnvironmentAct/${setYear}/${munCityId}`;
  post_environment_activities = () => `/EnvironmentAct`;
  put_environment_activities = () => `/EnvironmentAct`;
  delete_environment_activities = (transId: any) =>
    `/EnvironmentAct/${transId}`;
  post_report_EnvAct = () => `/EnvironmentAct/Reports`;
  //Environmen Profile
  get_list_environment_profile = (setYear: any, munCityId: any) =>
    `/EnvironmentProfile/${setYear}/${munCityId}`;
  post_environment_profile = () => `/EnvironmentProfile`;
  put_environment_profile = () => `/EnvironmentProfile`;
  post_report_environment_prof = () => `/EnvironmentProfile/Reports`;
  delete_environment_profile = (transId: any) =>
    `/EnvironmentProfile/${transId}`;

  //INFRASTRUCTURE & UTILITIES

  // Utility - SERVICES
  get_list_services = (menuId: any, setYear: any, munCityId: any) =>
    `/ServiceUtilities/${menuId}/${setYear}/${munCityId}`;
  post_services = () => `/ServiceUtilities`;
  put_services = () => `/ServiceUtilities`;
  delete_services = (transId: any) => `/ServiceUtilities/${transId}`;
  post_import_services = (menuId: any) => `/ServiceUtilities/Import/${menuId}`;
  post_report_services = () => `/ServiceUtilities/Reports`;

  // Service_Facilities
  get_list_facilities = (menuId: any, setYear: any, munCityId: any) =>
    `/ServiceFacilities/${menuId}/${setYear}/${munCityId}`;
  post_facilities = () => `/ServiceFacilities`;
  put_facilities = () => `/ServiceFacilities`;
  delete_facilities = (transId: any) => `/ServiceFacilities/${transId}`;
  post_import_facilities = (menuId: any) =>
    `/ServiceFacilities/Import/${menuId}`;
  post_report_facilities = () => `/ServiceFacilities/Reports`;

  get_list_transpo_road = (setYear: any, munCityId: any) =>
    `/TranspoRoads/${setYear}/${munCityId}`;
  post_save_transpo_road = () => `/TranspoRoads`;
  put_update_transpo_road = () => `/TranspoRoads`;
  delete_transpo_road = (transId: any) => `/TranspoRoads/${transId}`;
  post_import_transpo_road = () => `/TranspoRoads/Import`;
  post_report_transpo_road = () => `/TranspoRoads/Reports`;

  get_list_transpo_bridge = (setYear: any, munCityId: any) =>
    `/TranspoBridges/${setYear}/${munCityId}`;
  post_save_transpo_bridge = () => `/TranspoBridges`;
  put_update_transpo_bridge = () => `/TranspoBridges`;
  delete_transpo_bridge = (transId: any) => `/TranspoBridges/${transId}`;
  post_import_transpo_bridge = () => `/TranspoBridges/Import`;
  post_report_transpo_bridge = () => `/TranspoBridges/Reports`;

  get_list_transpo_terminal = (setYear: any, munCityId: any) =>
    `/TranspoTerminals/${setYear}/${munCityId}`;
  post_save_transpo_terminal = () => `/TranspoTerminals`;
  put_update_transpo_terminal = () => `/TranspoTerminals`;
  delete_transpo_terminal = (transId: any) => `/TranspoTerminals/${transId}`;
  post_import_transpo_terminal = () => `/TranspoTerminals/Import`;
  post_report_transpo_terminal = () => `/TranspoTerminals/Reports`;
  get_list_transpo_terminal_type = () => `/TranspoTerminalsType/List`;

  post_port = () => `/TranspoPorts`;
  put_port = () => `/TranspoPorts`;
  get_list_port = (setYear: any, munCityId: any) =>
    `/TranspoPorts/${setYear}/${munCityId}`;
  delete_port = (transId: any) => `/TranspoPorts/${transId}`;
  post_import_port = () => `/TranspoPorts/Import`;
  post_report_port = () => `/TranspoPorts/Reports`;

  // Service_Station
  get_list_station = (menuId: any, setYear: any, munCityId: any) =>
    `/ServiceStations/${menuId}/${setYear}/${munCityId}`;
  post_station = () => `/ServiceStations`;
  put_station = () => `/ServiceStations`;
  delete_station = (transId: any) => `/ServiceStations/${transId}`;
  post_import_station = (menuId: any) => `/ServiceStations/Import/${menuId}`;
  post_report_station = () => `/ServiceStations/Reports`;

  // Cell Sites
  get_list_cell = (setYear: any, munCityId: any) =>
    `/ComCellSites/${setYear}/${munCityId}`;
  post_cell = () => `/ComCellSites`;
  put_cell = () => `/ComCellSites`;
  delete_cell = (transId: any) => `/ComCellSites/${transId}`;
  post_import_cell = () => `/ComCellSites/Import`;
  post_report_cell = () => `/ComCellSites/Reports`;

  // Telecommunication
  get_list_telcom = (setYear: any, munCityId: any) =>
    `/ComTelSystems/${setYear}/${munCityId}`;
  post_telcom = () => `/ComTelSystems`;
  put_telcom = () => `/ComTelSystems`;
  delete_telcom = (transId: any) => `/ComTelSystems/${transId}`;
  post_import_telcom = () => `/ComTelSystems/Import`;
  post_report_telcom = () => `/ComTelSystems/Reports`;

  //Communications Services
  get_list_com_telfacilities = (setYear: any, munCityId: any) =>
    `/ComTelFacilities/${setYear}/${munCityId}`;
  post_com_telfacility = () => `/ComTelFacilities`;
  put_com_telfacility = () => `/ComTelFacilities`;
  delete_com_telfacility = (transId: any) => `/ComTelFacilities/${transId}`;
  post_import_com_telfacility = () => `/ComTelFacilities/Import`;
  post_report_com_telfacility = () => `/ComTelFacilities/Reports`;

  get_list_com_isp = (setYear: any, munCityId: any) =>
    `/ComISP/${setYear}/${munCityId}`;
  post_com_isp = () => `/ComISP`;
  put_com_isp = () => `/ComISP`;
  delete_com_isp = (transId: any) => `/ComISP/${transId}`;
  post_import_com_isp = () => `/ComISP/Import`;
  post_report_com_isp = () => `/ComISP/Reports`;

  get_list_com_express_mail = (setYear: any, munCityId: any) =>
    `/ComExpressMail/${setYear}/${munCityId}`;
  post_com_express_mail = () => `/ComExpressMail`;
  put_com_express_mail = () => `/ComExpressMail`;
  delete_com_express_mail = (transId: any) => `/ComExpressMail/${transId}`;
  post_import_com_express_mail = () => `/ComExpressMail/Import`;
  post_report_com_express_mail = () => `/ComExpressMail/Reports`;

  get_com_postal = (setYear: any, munCityId: any) =>
    `/ComPostalService/${setYear}/${munCityId}`;
  post_com_postal = () => `/ComPostalService`;
  put_com_postal = () => `/ComPostalService`;
  delete_com_postal = (transId: any) => `/ComPostalService/${transId}`;
  post_import_com_postal = () => `/ComPostalService/Import`;
  post_report_com_postal = () => `/ComPostalService/Reports`;

  //ServiceFacilities
  get_list_service_facilities = (menuId: any, setYear: any, munCityId: any) =>
    `/ServiceFacilities/${menuId}/${setYear}/${munCityId}`;
  post_services_faclitity = () => `/ServiceFacilities`;
  put_serivce_facility = () => `/ServiceFacilities`;
  delete_service_facility = (transId: any) => `/ServiceFacilities/${transId}`;
  post_import_service_facility = (menuId: any) =>
    `/ServiceFacilities/Import/${menuId}`;
  post_report_service_facility = () => `/ServiceFacilities/Reports`;

  //ServiceIrrigation
  get_service_irrigation = (setYear: any, munCityId: any) =>
    `/ServiceIrrigation/${setYear}/${munCityId}`;
  post_service_irrigation = () => `/ServiceIrrigation`;
  put_service_irrigation = () => `/ServiceIrrigation`;
  delete_service_irrigation = (transId: any) => `/ServiceIrrigation/${transId}`;
  post_import_service_irrigation = () => `/ServiceIrrigation/Import`;
  post_report_service_irrigation = () => `/ServiceIrrigation/Reports`;

  // TOOLS
  get_news = () => `/News/list`;
  post_news = () => `/News`;
  put_news = () => `/News`;
  delete_news = (transId: any) => `/News/${transId}`;

  get_notif_seen = (userId: any) => `/NotifSeen/${userId}`;
  post_notif_seen = () => `/NotifSeen`;

  get_list_message = () => `/Message/list`;
  get_list_my_message = () => `/Message/MyMessages`;
  get_list_message_data = (userId: any) => `/Message/list/${userId}`;
  post_message = () => `/Message`;
  put_message = () => `/Message`;
  delete_message = (transId: any) => `/Message/${transId}`;
  post_message_seen = (transId: any) => `/Message/SeenMessage/${transId}`;

  post_user = () => `/User`;
  post_user_update = () => `/User/UpdatePassword`;
  post_reset_pass = () => `/User/sendPasswordResetLink`;
  post_user_username_check = (username: any) =>
    `/User/UsernameCheck/${username}`;
  get_user_account = () => `/User`;

  get_report_summarized = (year: number) => `/ReportSummarized/${year}`;
  post_report_validation = () => `/ReportValidation`;
  put_report_validation = () => `/ReportValidation`;
  delete_report_validation = (transId: any) => `/ReportValidation/${transId}`;

  get_sep_year = () => `/SepYear`;

  //Activity Logs
  get_logs_act = (userId: any) => `/Logs/${userId}`;
  post_logs_act = () => `Logs`;
  get_date_act = (month: number, year: number) =>
    `/logs/filter-by-month/${month}/${year}`;
}
