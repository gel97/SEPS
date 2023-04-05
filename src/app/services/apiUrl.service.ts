import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiUrl {

//  GOVERNANCE
        // Municipality/City Officials
    post_get_officials   = (munCityId:any, setYear:any) => `/MunCityOfficial/GetOfficials?munCityId=${munCityId}&setYear=${setYear}`;
    post_save_official   = () => `/MunCityOfficial/SaveOfficial`;
    post_update_official = () => `/MunCityOfficial/Update`;
    get_mun_position     = () => `/MunCityOfficial/ListMunPosition`;

        // Barangay Officials
    post_get_barangay_officials = (munCityId:any, setYear:any) => `/Barangay/GetBarangays?munCityId=${munCityId}&setYear=${setYear}`;
    post_save_barangay          = () => `/Barangay/SaveBarangay`;
    post_update_barangay        = () => `/Barangay/Update`;
    post_list_barangay          = (munCityId:any) => `/Barangay/ListBarangays?munCityId=${munCityId}`;

        //Physical Geographic Profile
    post_get_geo    = (munCityId:any, setYear:any) => `/PhyGeoProf/ShowPhyGeoProf?munCityId=${munCityId}&setYear=${setYear}`;
    post_save_geo   = () => `/PhyGeoProf/SavePhyGeoProf`;
    post_update_geo = () => '/PhyGeoProf/Update';

        // Organization & Staffing Pattern
    post_get_org    = (munCityId:any, setYear:any) => `/OrgStaffPattern/Show?munCityId=${munCityId}&setYear=${setYear}`;
    post_save_org   = () => `/OrgStaffPattern/Save`;
    post_update_org = () => '/OrgStaffPattern/Update';

        //Fiscal Matters
    post_get_fiscal_matters    = (munCityId:any) => `/FiscalMatters/List?munCityId=${munCityId}`;
    post_save_fiscal_matters   = () => `/FiscalMatters/Save`;
    post_update_fiscal_matters = () => '/FiscalMatters/Update';

    // IMAGE
    get_image_banner         = (munCityId:any) => `/Image/GetImage/${munCityId}`;
    post_upload_image_banner = () => `/Image/UploadImage`;
    get_muncity_logo         = (munCityId:any) => `/Image/GetMunLogo/${munCityId}`;
    post_upload_muncity_logo = () => `/Image/UploadMunLogo`;

    // MUN/CITY LIST
    get_all_muncity     = () => `/MunLoc/List`;
    post_update_muncity = () => `/MunLoc/Update`;

    // Demography Officials
    post_get_demography    = (munCityId:any, setYear:any) => `/Demography/List?munCityId=${munCityId}&setYear=${setYear}`;
    post_save_demography   = () => `/Demography/Save`;
    post_update_demography = () => `/Demography/Update`;
    post_list_demography   = (munCityId:any) => `/Barangay/ListBarangays?munCityId=${munCityId}`;

    //Provincial Fiscal
    post_get_provincialfiscal    = (setYear:any)=>`/ProvFiscal/List?setYear=${setYear}`;
    post_save_provincialfiscal   = () => `/ProvFiscal/Save`;
    post_update_provincialfiscal = () => `/ProvFiscal/Update`;

    //Registered Voter
    post_get_regvoter    = (munCityId:any,setYear:any) => `/RegVoters/List?munCityId=${munCityId}&setYear=${setYear}`;
    post_save_regvoter   = () => `/RegVoters/Save`;
    post_update_regvoter = () => `/RegVoters/Update`;

    //SK Registered Voter
    post_get_skvoter    = (munCityId:any) => `/RegSkVoters/List?munCityId=${munCityId}`;
    post_save_skvoter   = () => `/RegSkVoters/Save`;
    post_update_skvoter = () => `/RegSkVoters/Update`;

    //Provincial official
    post_get_prov_official    = (setYear:any) => `/ProvOfficial/List?setYear=${setYear}`;
    post_save_prov_official   = () => `/ProvOfficial/Save`;
    post_update_prov_official = () => `/ProvOfficial/Update`;


//SOCIO-ECONOMIC ACTIVITIES

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
    get_list_agriculture_prod = (setYear:any, munCityId:any) => `/AgricultureProd/${setYear}/${munCityId}`;
    delete_agriculture_prod   = (transId:any)=>`/AgricultureProd/${transId}`;
            
    //Rice/Crops Production
    post_agriculture     = ()=> `/Agriculture`;
    put_agriculture      = ()=> `/Agriculture`;
    get_list_agriculture = (menuId:any, setYear:any, munCityId:any) => `/Agriculture/${menuId}/${setYear}/${munCityId}`;
    delete_agriculture   = (transId:any) => `/Agriculture/${transId}`;

}
