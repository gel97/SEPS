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
    get_all_muncity=()=> `/MunLoc/List`;
    post_update_muncity=()=>`/MunLoc/Update`;

  // Demography Officials
  post_get_demography =(munCityId:any, setYear:any)=>`/Demography/List?munCityId=${munCityId}&setYear=${setYear}`;
  post_save_demography =()=>`/Demography/Save`;
  post_update_demography =()=>`/Demography/Update`;
  post_list_demography = (munCityId:any) => `/Barangay/ListBarangays?munCityId=${munCityId}`;

  //Provincial Fiscal
  post_get_provincialfiscal =(setYear:any)=>`/ProvFiscal/List?setYear=${setYear}`;
  post_save_provincialfiscal=()=>`/ProvFiscal/Save`;
  post_update_provincialfiscal =()=>`/ProvFiscal/Update`;

  //Registered Voter
  post_get_regvoter=(munCityId:any,setYear:any)=>`/RegVoters/List?munCityId=${munCityId}&setYear=${setYear}`;
  post_save_regvoter=()=>`/RegVoters/Save`;
  post_update_regvoter =()=>`/RegVoters/Update`;

 //SK Registered Voter
 post_get_skvoter=(munCityId:any)=>`/RegSkVoters/List?munCityId=${munCityId}`;
 post_save_skvoter=()=>`/RegSkVoters/Save`;
 post_update_skvoter =()=>`/RegSkVoters/Update`;

//Provincial official
  post_get_prov_official=(setYear:any)=>`/ProvOfficial/List?setYear=${setYear}`;
  post_save_prov_official=()=>`/ProvOfficial/Save`;
  post_update_prov_official =()=>`/ProvOfficial/Update`;


//Major Economic Activities
get_major_eco=(munCityId:any, setYear:any)=>`/MjrEcoAct/${setYear}/${munCityId}`;
post_save_major_eco=()=>`/MjrEcoAct`;
put_update_major_eco=()=>`/MjrEcoAct`;
delete_major_eco=(transId:any)=>`/MjrEcoAct/${transId}`;

//Manufacturing Establishment
get_manuf_estab=(munCityId:any, setYear:any)=>`/ManEstab/${setYear}/${munCityId}`;
post_save_manuf_estab=()=>`/ManEstab`;
put_update_manuf_estab=()=>`/ManEstab`;
delete_manuf_estab=(transId:any)=>`/ManEstab/${transId}`;

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



}
