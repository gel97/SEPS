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
    post_get_barangay_officials =(munCityId:any, setYear:any)=>`/Barangay/GetBarangays?munCityId=${munCityId}&setYear=${setYear}`;
    post_save_barangay =()=>`/Barangay/SaveBarangay`;
    post_update_barangay =()=>`/Barangay/Update`;
    post_list_barangay = (munCityId:any) => `/Barangay/ListBarangays?munCityId=${munCityId}`;
    delete_barangay=(transId:any)=>`/Barangay/${transId}`;



        //Physical Geographic Profile
    post_get_geo = (munCityId:any, setYear:any) => `/PhyGeoProf/ShowPhyGeoProf?munCityId=${munCityId}&setYear=${setYear}`;
    post_save_geo = () => `/PhyGeoProf/SavePhyGeoProf`;
    post_update_geo = () => '/PhyGeoProf/Update';

        // Organization & Staffing Pattern
    post_get_org = (munCityId:any, setYear:any) => `/OrgStaffPattern/Show?munCityId=${munCityId}&setYear=${setYear}`;
    post_save_org = () => `/OrgStaffPattern/Save`;
    post_update_org = () => '/OrgStaffPattern/Update';
    delete_org=(munCityId:any, setYear:any)=>`/OrgStaffPattern/${setYear}/${munCityId}`;

        //Fiscal Matters
    post_get_fiscal_matters = (munCityId:any) => `/FiscalMatters/List?munCityId=${munCityId}`;
    post_save_fiscal_matters = () => `/FiscalMatters/Save`;
    post_update_fiscal_matters = () => '/FiscalMatters/Update';
    delete_fiscal=(transId:any)=>`/FiscalMatters/${transId}`;


    // IMAGE
    get_image_banner = (munCityId:any) => `/Image/GetImage/${munCityId}`;
    post_upload_image_banner = () => `/Image/UploadImage`;
    get_muncity_logo = (munCityId:any) => `/Image/GetMunLogo/${munCityId}`;
    post_upload_muncity_logo = () => `/Image/UploadMunLogo`;

    // MUN/CITY LIST
    get_all_muncity=()=> `/MunLoc/List`;
    post_update_muncity=()=>`/MunLoc/Update`;

  // Demography Officials
  post_get_demography=(munCityId:any)=>`/Demography/List?munCityId=${munCityId}`;
  post_save_demography =()=>`/Demography/Save`;
  post_update_demography =()=>`/Demography/Update`;
  post_list_demography = (munCityId:any) => `/Barangay/ListBarangays?munCityId=${munCityId}`;
  delete_demography=(transId:any)=>`/Demography/${transId}`;
  post_list_barangay_demo = (munCityId:any) => `/Barangay/ListBarangays?munCityId=${munCityId}`;


  //Provincial Fiscal
  post_get_provincialfiscal =(setYear:any)=>`/ProvFiscal/List?setYear=${setYear}`;
  post_save_provincialfiscal=()=>`/ProvFiscal/Save`;
  post_update_provincialfiscal =()=>`/ProvFiscal/Update`;

  //Registered Voter
  post_get_regvoter=(munCityId:any,setYear:any)=>`/RegVoters/List?munCityId=${munCityId}&setYear=${setYear}`;
  post_save_regvoter=()=>`/RegVoters/Save`;
  post_update_regvoter =()=>`/RegVoters/Update`;
  post_list_barangay_RegV = (munCityId:any) => `/Barangay/ListBarangays?munCityId=${munCityId}`;
  delete_regVoter=(transId:any)=>`/RegVoters/${transId}`;



 //SK Registered Voter
 post_get_skvoter=(munCityId:any,setYear:any)=>`/RegSkVoters/List?munCityId=${munCityId}&setYear=${setYear}`;
 post_save_skvoter=()=>`/RegSkVoters/Save`;
 post_update_skvoter =()=>`/RegSkVoters/Update`;
 post_list_barangay_SKV = (munCityId:any) => `/Barangay/ListBarangays?munCityId=${munCityId}`;
 delete_skVoter=(transId:any)=>`/RegSkVoters/${transId}`;



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
post_list_barangays = (munCityId:any) => `/Barangay/ListBarangays?munCityId=${munCityId}`;

//Comercial Establishments
get_com_estab=(munCityId:any, setYear:any)=>`/ComEstab/${setYear}/${munCityId}`;
post_save_com_estab=()=>`/ComEstab`;
put_update_com_estab=()=>`/ComEstab`;
delete_com_estab=(transId:any)=>`/ComEstab/${transId}`;
post_list_barangay_com = (munCityId:any) => `/Barangay/ListBarangays?munCityId=${munCityId}`;

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

}
