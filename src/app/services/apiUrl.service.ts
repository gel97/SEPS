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

        // Barangay Officials  
    post_get_barangay_officials =(munCityId:any, setYear:any)=>`/Barangay/GetBarangays?munCityId=${munCityId}&setYear=${setYear}`;
    post_save_barangay =()=>`/Barangay/SaveBarangay`;
    post_update_barangay =()=>`/Barangay/Update`;
    post_list_barangay = (munCityId:any) => `/Barangay/ListBarangays?munCityId=${munCityId}`;

        //Physical Geographic Profile
    post_get_geo = (munCityId:any, setYear:any) => `/PhyGeoProf/ShowPhyGeoProf?munCityId=${munCityId}&setYear=${setYear}`;
    post_save_geo = () => `/PhyGeoProf/SavePhyGeoProf`;
    post_update_geo = () => '/PhyGeoProf/Update';

        // Organization & Staffing Pattern
    post_get_org = (munCityId:any, setYear:any) => `/OrgStaffPattern/Show?munCityId=${munCityId}&setYear=${setYear}`;
    post_save_org = () => `/OrgStaffPattern/Save`;
    post_update_org = () => '/OrgStaffPattern/Update'; 
      
        //Fiscal Matters
    post_get_fiscal_matters = (munCityId:any) => `/FiscalMatters/List?munCityId=${munCityId}`;
    post_save_fiscal_matters = () => `/FiscalMatters/Save`;
    post_update_fiscal_matters = () => '/FiscalMatters/Update';
    
    // IMAGE
    get_image_banner = (munCityId:any) => `/Image/GetImage/${munCityId}`;
    post_upload_image_banner = () => `/Image/UploadImage`;
    get_muncity_logo = (munCityId:any) => `/Image/GetMunLogo/${munCityId}`;
    post_upload_muncity_logo = () => `/Image/UploadMunLogo`;

    // MUN/CITY LIST
    get_all_muncity = () => `/MunLoc/List`;





}