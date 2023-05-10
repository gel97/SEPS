import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiUrl {

//  GOVERNANCE
        // Municipality/City Officials
    post_get_officials =(munCityId:any, setYear:any)=>`/MunCityOfficial/GetOfficials?munCityId=${munCityId}&setYear=${setYear}`;
    post_save_official =()=>`/MunCityOfficial/SaveOfficial`;
    post_update_official =()=>`/MunCityOfficial/Update`;
    get_mun_position =()=>`/MunCityOfficial/ListMunPosition`;
    delete_officials=(transId:any)=>`/MunCityOfficial/${transId}`;

        // Barangay Officials
    post_get_barangay_officials = (munCityId:any, setYear:any) => `/Barangay/GetBarangays?munCityId=${munCityId}&setYear=${setYear}`;
    post_save_barangay          = () => `/Barangay/SaveBarangay`;
    post_update_barangay        = () => `/Barangay/Update`;
    post_list_barangay          = (munCityId:any) => `/Barangay/ListBarangays?munCityId=${munCityId}`;
    delete_barangay             = (transId:any)   => `/Barangay/${transId}`;

        //Physical Geographic Profile
    get_get_geo    = (munCityId:any, setYear:any) => `/PhyGeoProf/${setYear}/${munCityId}`;
    post_save_geo  = () => `/PhyGeoProf`;
    put_update_geo = () => '/PhyGeoProf';
    delete_geo=(transId:any)=>`/PhyGeoProf/${transId}`;


        // Organization & Staffing Pattern
    get_get_org    = (munCityId:any, setYear:any) => `/OrgStaffPattern/${setYear}/${munCityId}`;
    post_save_org   = () => `/OrgStaffPattern`;
    put_update_org = () => '/OrgStaffPattern';
    delete_org=(transId:any)=>`/OrgStaffPattern/${transId}`;


        //Fiscal Matters
    post_get_fiscal_matters    = (munCityId:any) => `/FiscalMatters/List?munCityId=${munCityId}`;
    post_save_fiscal_matters   = () => `/FiscalMatters/Save`;
    post_update_fiscal_matters = () => '/FiscalMatters/Update';
    delete_fiscal=(transId:any)=>`/FiscalMatters/${transId}`;


    // IMAGE
    get_image_banner         = (munCityId:any) => `/Image/GetImage/${munCityId}`;
    post_upload_image_banner = () => `/Image/UploadImage`;
    get_muncity_logo         = (munCityId:any) => `/Image/GetMunLogo/${munCityId}`;
    post_upload_muncity_logo = () => `/Image/UploadMunLogo`;

    // MUN/CITY LIST
    get_all_muncity     = () => `/MunLoc/List`;
    post_update_muncity = () => `/MunLoc/Update`;


    // Demography Officials
    post_get_demography     = (munCityId:any, setYear:any) => `/Demography/List?munCityId=${munCityId}&setYear=${setYear}`;
    post_save_demography    = () => `/Demography/Save`;
    post_update_demography  = () => `/Demography/Update`;
    delete_demography       = (transId:any)   => `/Demography/${transId}`;
     post_list_barangay_demo = (munCityId:any) => `/Barangay/ListBarangays?munCityId=${munCityId}`;

    //Provincial Fiscal
    post_get_provincialfiscal    = (setYear:any)=>`/ProvFiscal/List?setYear=${setYear}`;
    post_save_provincialfiscal   = () => `/ProvFiscal/Save`;
    post_update_provincialfiscal = () => `/ProvFiscal/Update`;
    delete_provincialFical       = (transId:any)   => `/ProvFiscal/${transId}`;



    //Registered Voter
    post_get_regvoter    = (munCityId:any,setYear:any) => `/RegVoters/List?munCityId=${munCityId}&setYear=${setYear}`;
    post_save_regvoter   = () => `/RegVoters/Save`;
    post_update_regvoter = () => `/RegVoters/Update`;
    delete_regVoter=(transId:any)=>`/RegVoters/${transId}`;


    //SK Registered Voter
    post_get_skvoter    = (munCityId:any,setYear:any) => `/RegSkVoters/List?munCityId=${munCityId}&setYear=${setYear}`;
    post_save_skvoter   = () => `/RegSkVoters/Save`;
    post_update_skvoter = () => `/RegSkVoters/Update`;
    delete_skVoter=(transId:any)=>`/RegSkVoters/${transId}`;


    //Provincial official
    post_get_prov_official    = (setYear:any) => `/ProvOfficial/List?setYear=${setYear}`;
    post_save_prov_official   = () => `/ProvOfficial/Save`;
    post_update_prov_official = () => `/ProvOfficial/Update`;
    get_prov_position =()=>`/ProvOfficial`;
    delete_prov_officials=(transId:any)=>`/MunCityOfficial/${transId}`;


//SOCIO-ECONOMIC ACTIVITIES

    //Comercial Establishments
    get_com_estab=(munCityId:any, setYear:any)=>`/ComEstab/${setYear}/${munCityId}`;
    post_save_com_estab=()=>`/ComEstab`;
    put_update_com_estab=()=>`/ComEstab`;
    delete_com_estab=(transId:any)=>`/ComEstab/${transId}`;

    //Summary Commercial
    get_summ_commercial=(munCityId:any, setYear:any)=>`/SumComEst/${setYear}/${munCityId}`;
    post_save_summ_commercial=()=>`/SumComEst`;
    put_update_summ_commercial=()=>`/SumComEst`;
    delete_summ_commercial=(transId:any)=>`/SumComEst/${transId}`;

    //Financial Institutions
    get_financial_Ins=(munCityId:any, setYear:any)=>`/FinIns/${setYear}/${munCityId}`;
    post_save_financial_Ins=()=>`/FinIns`;
    put_update_financial_Ins=()=>`/FinIns`;
    delete_financial_Ins=(transId:any)=>`/FinIns/${transId}`;

    //Industrial estates
    get_Industrial=(munCityId:any, setYear:any)=>`/IndEst/${setYear}/${munCityId}`;
    post_save_Industrial=()=>`/IndEst`;
    put_update_Industrial=()=>`/IndEst`;
    delete_Industrial=(transId:any)=>`/IndEst/${transId}`;

    //Major Economic Activities
    get_major_eco        = (munCityId:any, setYear:any) => `/MjrEcoAct/${setYear}/${munCityId}`;
    post_save_major_eco  = () => `/MjrEcoAct`;
    put_update_major_eco = () => `/MjrEcoAct`;
    delete_major_eco     = (transId:any) => `/MjrEcoAct/${transId}`;

    //Manufacturing Establishment
    get_manuf_estab        = (munCityId:any, setYear:any) => `/ManEstab/${setYear}/${munCityId}`;
    post_save_manuf_estab  = () => `/ManEstab`;
    put_update_manuf_estab = () => `/ManEstab`;
    delete_manuf_estab     = (transId:any) => `/ManEstab/${transId}`;

    //TOURISM
    post_tourism     = ()=> `/Tourism`;
    put_tourism      = ()=> `/Tourism`;
    get_list_tourism = (menuId:any, setYear :any, munCityId :any)=> `/Tourism/${menuId}/${setYear }/${munCityId  }`;
    delete_tourism   = (transId :any) => `/Tourism/${transId}`;

    // Agriculture Profile
    post_agriculture_profile      = () => `/AgricultureProfile`;
    put_agriculture_profile       = () => `/AgricultureProfile`;
    get_list_agriculture_profile  = (setYear:any, munCityId:any) => `/AgricultureProfile/${setYear}/${munCityId}`;
    delete_agriculture_profile    = (transId:any)=>`/AgricultureProfile/${transId}`;

    //Provincial Profile on Crops Production and Area Harvested
    post_agriculture_prod     = ()=> `/AgricultureProd`;
    put_agriculture_prod      = () => `/AgricultureProd`;
    get_list_agriculture_prod = (menuId:any,setYear:any, munCityId:any) => `/AgricultureProd/${menuId}/${setYear}/${munCityId}`;
    delete_agriculture_prod   = (transId:any)=>`/AgricultureProd/${transId}`;

    //Rice/Crops Production
    post_agriculture     = ()=> `/Agriculture`;
    put_agriculture      = ()=> `/Agriculture`;
    get_list_agriculture = (menuId:any, setYear:any, munCityId:any) => `/Agriculture/${menuId}/${setYear}/${munCityId}`;
    delete_agriculture   = (transId:any) => `/Agriculture/${transId}`;

// SOCIAL-PROFILE

    // Education
    get_list_education = (menuId :any, setYear  :any,munCityId :any)=>`/Education/${menuId}/${setYear}/${munCityId}`;
    get_education      = (transId:any,)=>`/Education/${transId}`;
    post_education     = ()=>`/Education`;
    put_education      = ()=>`/Education`;
    delete_education   = (transId:any)=>`/Education/${transId}`;

    // Education -> Out of School
    get_list_education_osy = (setYear:any, munCityId:any) => `/EducationOsy/${setYear}/${munCityId}`;
    post_education_osy     = ()=>`/EducationOsy`;
    put_education_osy      = ()=>`/EducationOsy`;
    delete_education_osy   = (transId:any)=>`/EducationOsy/${transId}`;

    // Health -> Workers
    get_health_workers    = (setYear:any, munCityId:any) => `/HealthWorkers/${setYear}/${munCityId}`;
    post_health_workers   = ()=>`/HealthWorkers`;
    put_health_workers    = ()=>`/HealthWorkers`;
    delete_health_workers = (transId:any)=>`/HealthWorkers/${transId}`;

    // Health -> Facilities
    get_list_health_facilities = (menuId :any, setYear  :any,munCityId :any)=>`/HealthFacilities/${menuId}/${setYear}/${munCityId}`;
    post_health_facility       = ()=>`/HealthFacilities`;
    put_health_facility        = ()=>`/HealthFacilities`;
    delete_health_facility     = (transId:any)=>`/HealthFacilities/${transId}`;

    // Health -> Handicap
    get_list_health_handicap = (setYear  :any,munCityId :any)=>`/HealthHandi/${setYear}/${munCityId}`;
    post_health_handicap     = ()=>`/HealthHandi`;
    put_health_handicap      = ()=>`/HealthHandi`;
    delete_health_handicap   = (transId:any)=>`/HealthHandi/${transId}`;

    // Health -> HealthMalnutrition
    get_list_health_malnutrition = (setYear  :any,munCityId :any)=>`/HealthMalnut/${setYear}/${munCityId}`;
    post_health_malnutrition     = ()=>`/HealthMalnut`;
    put_health_malnutrition      = ()=>`/HealthMalnut`;
    delete_health_malnutrition   = (transId:any)=>`/HealthMalnut/${transId}`;

    // Health -> Sanitary
    get_list_health_sanitary = (setYear  :any,munCityId :any)=>`/HealthSanitary/${setYear}/${munCityId}`;
    post_health_sanitary     = ()=>`/HealthSanitary`;
    put_health_sanitary      = ()=>`/HealthSanitary`;
    delete_health_sanitary   = (transId:any)=>`/HealthSanitary/${transId}`;

    // Health -> Hospital -> Provincial
    get_list_health_hospital = (setYear:any)=>`/HealthHosp/${setYear}`;
    post_health_hospital     = ()=>`/HealthHosp`;
    put_health_hospital      = ()=>`/HealthHosp`;
    delete_health_hospital   = (transId:any)=>`/HealthHosp/${transId}`;

    // Health -> Profile -> Provincial
    get_list_health_profile  = (setYear:any)=>`/HealthProfile/${setYear}`;
    post_health_profile      = ()=>`/HealthProfile`;
    put_health_profile       = ()=>`/HealthProfile`;
    delete_health_profile    = (transId:any)=>`/HealthProfile/${transId}`;

    // Safety -> SafetyServices
    get_list_safety_services = (menuId :any, setYear  :any,munCityId :any)=>`/SafetyServices/${menuId}/${setYear}/${munCityId}`;
    post_safety_services     = ()=>`/SafetyServices`;
    put_safety_services      = ()=>`/SafetyServices`;
    delete_safety_services   = (transId:any)=>`/SafetyServices/${transId}`;

    // Safety -> SafetyTanod
    get_list_safety_tanod = ( setYear  :any,munCityId :any)=>`/SafetyTanod/${setYear}/${munCityId}`;
    post_safety_tanod     = ()=>`/SafetyTanod`;
    put_safety_tanod      = ()=>`/SafetyTanod`;
    delete_safety_tanod   = (transId:any)=>`/SafetyTanod/${transId}`;

//INFRASTRUCTURE & UTILITIES

    // Utility - SERVICES
    get_list_services = (menuId :any, setYear  :any,munCityId :any)=>`/ServiceUtilities/${menuId}/${setYear}/${munCityId}`;
    post_services     = ()=>`/ServiceUtilities`;
    put_services      = ()=>`/ServiceUtilities`;
    delete_services   = (transId:any)=>`/ServiceUtilities/${transId}`;

    // Service_Facilities
    get_list_facilities = (menuId :any, setYear  :any,munCityId :any)=>`/ServiceFacilities/${menuId}/${setYear}/${munCityId}`;
    post_facilities     = ()=>`/ServiceFacilities`;
    put_facilities      = ()=>`/ServiceFacilities`;
    delete_facilities   = (transId:any)=>`/ServiceFacilities/${transId}`;


//Manufacturing Establishment
get_list_transpo_road=(setYear:any, munCityId:any)=>`/TranspoRoads/${setYear}/${munCityId}`;
post_save_transpo_road=()=>`/TranspoRoads`;
put_update_transpo_road=()=>`/TranspoRoads`;
delete_transpo_road=(transId:any)=>`/TranspoRoads/${transId}`;

get_list_transpo_bridge=(setYear:any, munCityId:any)=>`/TranspoBridges/${setYear}/${munCityId}`;
post_save_transpo_bridge=()=>`/TranspoBridges`;
put_update_transpo_bridge=()=>`/TranspoBridges`;
delete_transpo_bridge=(transId:any)=>`/TranspoBridges/${transId}`;

get_list_transpo_terminal=(setYear:any, munCityId:any)=>`/TranspoTerminals/${setYear}/${munCityId}`;
post_save_transpo_terminal=()=>`/TranspoTerminals`;
put_update_transpo_terminal=()=>`/TranspoTerminals`;
delete_transpo_terminal=(transId:any)=>`/TranspoTerminals/${transId}`;

    // Service_Station
    get_list_station = (menuId :any, setYear  :any,munCityId :any)=>`/ServiceStations/${menuId}/${setYear}/${munCityId}`;
    post_station    = ()=>`/ServiceStations`;
    put_station      = ()=>`/ServiceStations`;
    delete_station   = (transId:any)=>`/ServiceStations/${transId}`;

    // Cell Sites
    get_list_cell = (setYear  :any,munCityId :any)=>`/ComCellSites/${setYear}/${munCityId}`;
    post_cell   = ()=>`/ComCellSites`;
    put_cell      = ()=>`/ComCellSites`;
    delete_cell   = (transId:any)=>`/ComCellSites/${transId}`;

    // Telecommunication
    get_list_telcom = (setYear  :any,munCityId :any)=>`/ComTelSystems/${setYear}/${munCityId}`;
    post_telcom   = ()=>`/ComTelSystems`;
    put_telcom      = ()=>`/ComTelSystems`;
    delete_telcom   = (transId:any)=>`/ComTelSystems/${transId}`;


    //Communications Services
    get_list_com_telfacilities = ( setYear  :any,munCityId :any)=>`/ComTelFacilities/${setYear}/${munCityId}`;
    post_com_telfacility       = ()=>`/ComTelFacilities`;
    put_com_telfacility        = ()=>`/ComTelFacilities`;
    delete_com_telfacility     = (transId:any)=>`/ComTelFacilities/${transId}`;
     
    get_list_com_isp = ( setYear  :any,munCityId :any)=>`/ComISP/${setYear}/${munCityId}`;
    post_com_isp     = ()=>`/ComISP`;
    put_com_isp      = ()=>`/ComISP`;
    delete_com_isp   = (transId:any)=>`/ComISP/${transId}`;
                   
    get_list_com_express_mail = ( setYear  :any,munCityId :any)=>`/ComExpressMail/${setYear}/${munCityId}`;
    post_com_express_mail     = ()=>`/ComExpressMail`;
    put_com_express_mail      = ()=>`/ComExpressMail`;
    delete_com_express_mail   = (transId:any)=>`/ComExpressMail/${transId}`;
     
    get_com_postal    = ( setYear  :any,munCityId :any)=>`/ComPostalService/${setYear}/${munCityId}`;
    post_com_postal   = ()=>`/ComPostalService`;
    put_com_postal    = ()=>`/ComPostalService`;
    delete_com_postal = (transId:any)=>`/ComPostalService/${transId}`;
     
    //ServiceFacilities
    get_list_service_facilities = (menuId :any, setYear  :any,munCityId :any)=>`/ServiceFacilities/${menuId}/${setYear}/${munCityId}`;
    post_services_faclitity     = ()=>`/ServiceFacilities`;
    put_serivce_facility        = ()=>`/ServiceFacilities`;
    delete_service_facility     = (transId:any)=>`/ServiceFacilities/${transId}`;
    //ServiceIrrigation
    get_service_irrigation      = ( setYear  :any,munCityId :any)=>`/ServiceIrrigation/${setYear}/${munCityId}`;
    post_service_irrigation     = ()=>`/ServiceIrrigation`;
    put_service_irrigation      = ()=>`/ServiceIrrigation`;
    delete_service_irrigation   = (transId:any)=>`/ServiceIrrigation/${transId}`; 

// TOOLS
    get_news      = ()=>`/News/list`;
    post_news     = ()=>`/News`;
    put_news      = ()=>`/News`;
    delete_news   = (transId:any)=>`/News/${transId}`;

    get_notif_seen      = (userId:any)=>`/NotifSeen/${userId}`;
    post_notif_seen     = ()=>`/NotifSeen`;

}
